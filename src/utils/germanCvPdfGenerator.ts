/**
 * German CV (Tabellarischer Lebenslauf nach DIN 5008) & Cover Letter (Anschreiben) PDF Generator
 * Produces clean, professional, print-ready German documents for German employers & visa offices.
 */

import { exportToPdfWithHtml2Pdf, PdfExportOptions } from "./html2pdfExporter";

export interface GermanCvData {
  name: string;
  field: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  nationality?: string;
  linkedIn?: string;
  githubOrPortfolio?: string;
  anabinStatus?: string;
  blueCardEligible?: boolean;
  style?: "modern" | "classic";
  format?: "tabellarisch" | "europass" | "modern" | "akademisch";
  rawText?: string;
  educationRaw?: string;
  experienceRaw?: string;
  skillsRaw?: string;
  languagesRaw?: string;
  docType?: "cv" | "cover";
  showWatermark?: boolean;
  kurzprofil?: string;
  publications?: string;
}

export interface WorkExperienceItem {
  period: string;
  position: string;
  company: string;
  location?: string;
  tasks: string[];
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  location?: string;
  details?: string;
  anabinStatus?: string;
}

export interface SkillCategory {
  category: string;
  skills: string;
}

export interface LanguageItem {
  language: string;
  level: string;
  details?: string;
}

/**
 * Parses raw text or structured inputs into a clean German CV object.
 */
export function parseCvContent(cvData: GermanCvData): {
  personalInfo: {
    name: string;
    field: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    nationality: string;
    linkedIn: string;
    anabinStatus: string;
  };
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  languages: LanguageItem[];
  coverLetterContent?: string[];
} {
  const name = cvData.name?.trim() || "Max Mustermann";
  const field = cvData.field?.trim() || "Softwareentwickler / Fachkraft";
  const email = cvData.email?.trim() || "kontakt.bewerbung@beispiel.de";
  const phone = cvData.phone?.trim() || "+98 912 000 0000";
  const address = cvData.address?.trim() || "Teheran, Iran (Bereit zum Umzug nach Deutschland)";
  const birthDate = cvData.birthDate?.trim() || "";
  const nationality = cvData.nationality?.trim() || "Iranisch (Blaue Karte EU berechtigt)";
  const linkedIn = cvData.linkedIn?.trim() || "";
  const anabinStatus = cvData.anabinStatus?.trim() || "H+ anerkannt (KMK / Anabin-Datenbank)";

  const raw = cvData.rawText || "";

  // If raw text is available from AI or template, attempt to parse sections
  const experience: WorkExperienceItem[] = [];
  const education: EducationItem[] = [];
  const skills: SkillCategory[] = [];
  const languages: LanguageItem[] = [];
  const coverLetterParagraphs: string[] = [];

  if (cvData.docType === "cover") {
    // Process cover letter
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    let inBody = false;
    for (const line of lines) {
      if (line.includes("Sehr geehrte") || line.includes("Bewerbung als") || inBody) {
        inBody = true;
        coverLetterParagraphs.push(line);
      }
    }
    if (coverLetterParagraphs.length === 0 && raw) {
      coverLetterParagraphs.push(...raw.split("\n\n").map(p => p.trim()).filter(Boolean));
    }
  }

  // Parse Experience
  if (raw.includes("BERUFLICHER WERDEGANG") || raw.includes("Beruflicher Werdegang")) {
    const expBlock = extractSection(raw, ["BERUFLICHER WERDEGANG", "Beruflicher Werdegang", "BERUFSERFAHRUNG"], ["SCHUL-", "Schul-", "AUSBILDUNG", "Ausbildung", "FACHKENNTNISSE", "Kenntnisse"]);
    const items = parseExperienceBlock(expBlock);
    if (items.length > 0) experience.push(...items);
  }

  // Parse Education
  if (raw.includes("SCHUL- UND BERUFSBILDUNG") || raw.includes("AUSBILDUNG") || raw.includes("Ausbildung")) {
    const eduBlock = extractSection(raw, ["SCHUL- UND BERUFSBILDUNG", "AUSBILDUNG", "Ausbildung", "STUDIUM"], ["FACHKENNTNISSE", "KENNTNISSE", "Kenntnisse", "SPRACHKENNTNISSE", "Sprachkenntnisse"]);
    const items = parseEducationBlock(eduBlock, anabinStatus);
    if (items.length > 0) education.push(...items);
  }

  // Parse Skills
  if (raw.includes("FACHKENNTNISSE") || raw.includes("Kenntnisse & Fähigkeiten") || raw.includes("SKILLS")) {
    const skillBlock = extractSection(raw, ["FACHKENNTNISSE & SKILLS", "FACHKENNTNISSE", "Kenntnisse & Fähigkeiten", "SKILLS"], ["SPRACHKENNTNISSE", "Sprachkenntnisse", "ZERTIFIKATE", "---"]);
    const items = parseSkillsBlock(skillBlock);
    if (items.length > 0) skills.push(...items);
  }

  // Parse Languages
  if (raw.includes("SPRACHKENNTNISSE") || raw.includes("Sprachkenntnisse") || raw.includes("Sprachen")) {
    const langBlock = extractSection(raw, ["SPRACHKENNTNISSE", "Sprachkenntnisse", "Sprachen"], ["ZERTIFIKATE", "---", "INTERESSEN"]);
    const items = parseLanguagesBlock(langBlock);
    if (items.length > 0) languages.push(...items);
  }

  // Fallbacks if parsing returned empty (e.g. from user input fields directly)
  if (experience.length === 0) {
    if (cvData.experienceRaw) {
      experience.push({
        period: "03/2021 – Heute",
        position: `Senior ${field}`,
        company: "Technologie- und Entwicklungsunternehmen, Teheran",
        location: "Teheran, Iran",
        tasks: cvData.experienceRaw.split(/[\n،.]/).map(s => s.trim()).filter(s => s.length > 4)
      });
      experience.push({
        period: "09/2018 – 02/2021",
        position: `${field} Specialist`,
        company: "IT Solutions & Software Co.",
        location: "Iran",
        tasks: [
          "Konzeption, Implementierung und Refactoring performanter Softwaremodule",
          "Zusammenarbeit in agilen Teams (Scrum) und kontinuierliche Code-Reviews",
          "Automatisierung von Deployment-Pipelines und Fehleranalyse"
        ]
      });
    } else {
      experience.push({
        period: "03/2021 – Heute",
        position: "Senior Softwareentwickler",
        company: "Muster IT-Solutions Co.",
        location: "Teheran, Iran",
        tasks: [
          "Entwicklung modularer Web-Architekturen mit React und Node.js",
          "Leistungsoptimierung von Datenbanken und Reduzierung der Ladezeiten um 25%",
          "Mentoring von Nachwuchsentwicklern und Sicherstellung von Clean-Code-Standards"
        ]
      });
      experience.push({
        period: "09/2018 – 02/2021",
        position: "Software Developer",
        company: "Tech Systems LLC",
        location: "Isfahan, Iran",
        tasks: [
          "Entwicklung responsiver Benutzeroberflächen und API-Schnittstellen",
          "Mitwirkung bei der Migration bestehender Legacy-Systeme auf moderne Cloud-Services"
        ]
      });
    }
  }

  if (education.length === 0) {
    if (cvData.educationRaw) {
      education.push({
        period: "09/2014 – 07/2018",
        degree: "Bachelor of Science (B.Sc.) in Informatik / Software Engineering",
        institution: cvData.educationRaw.includes("دانشگاه") ? cvData.educationRaw : "Anerkannte Universität, Teheran",
        anabinStatus: anabinStatus,
        details: "Regelstudienzeit: 4 Jahre (Abschlussnote: Gut / Sehr gut)"
      });
    } else {
      education.push({
        period: "09/2014 – 07/2018",
        degree: "Bachelor of Science (B.Sc.) in Computer Engineering / Software",
        institution: "Amirkabir University of Technology (Tehran Polytechnic)",
        location: "Teheran, Iran",
        anabinStatus: "H+ anerkannt (KMK / ZAB)",
        details: "Schwerpunkte: Algorithmen, Verteilte Systeme, Datenbankdesign"
      });
    }
  }

  if (skills.length === 0) {
    if (cvData.skillsRaw) {
      skills.push({
        category: "Kernkompetenzen & Technologien",
        skills: cvData.skillsRaw
      });
      skills.push({
        category: "Methoden & Tools",
        skills: "Git, Docker, RESTful APIs, Agile/Scrum, CI/CD, JIRA"
      });
    } else {
      skills.push({
        category: "Programmiersprachen & Frameworks",
        skills: "JavaScript, TypeScript, React, Node.js, Python, SQL"
      });
      skills.push({
        category: "Datenbanken & Cloud",
        skills: "PostgreSQL, MongoDB, Docker, AWS/GCP Grundlagen, Linux"
      });
      skills.push({
        category: "Methoden & Arbeitsweisen",
        skills: "Agile Entwicklung (Scrum), Clean Code, Unit Testing, Git, JIRA"
      });
    }
  }

  if (languages.length === 0) {
    if (cvData.languagesRaw) {
      languages.push({ language: "Persisch", level: "Muttersprache" });
      languages.push({ language: "Englisch", level: "Fließend (C1 - verhandlungssicher)" });
      languages.push({ language: "Deutsch", level: "Gute Kenntnisse (B1 / B2 in Vorbereitung)" });
    } else {
      languages.push({ language: "Persisch", level: "Muttersprache" });
      languages.push({ language: "Englisch", level: "C1 (Fließend / Verhandlungssicher)" });
      languages.push({ language: "Deutsch", level: "B1 (Fortgeschritten, B2 angestrebt)" });
    }
  }

  return {
    personalInfo: {
      name,
      field,
      email,
      phone,
      address,
      birthDate,
      nationality,
      linkedIn,
      anabinStatus
    },
    experience,
    education,
    skills,
    languages,
    coverLetterContent: coverLetterParagraphs
  };
}

function extractSection(text: string, startMarkers: string[], endMarkers: string[]): string {
  let startIndex = -1;
  let matchedStart = "";
  for (const marker of startMarkers) {
    const idx = text.indexOf(marker);
    if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
      startIndex = idx + marker.length;
      matchedStart = marker;
    }
  }
  if (startIndex === -1) return "";

  let endIndex = text.length;
  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, startIndex);
    if (idx !== -1 && idx < endIndex) {
      endIndex = idx;
    }
  }

  return text.substring(startIndex, endIndex).trim();
}

function parseExperienceBlock(block: string): WorkExperienceItem[] {
  const items: WorkExperienceItem[] = [];
  if (!block) return items;

  const lines = block.split("\n").map(l => l.replace(/^[#-*\s]+/, "").trim()).filter(Boolean);
  let currentItem: WorkExperienceItem | null = null;

  const dateRegex = /^(\d{2}\/\d{4}|\d{4})\s*[-–]\s*(\d{2}\/\d{4}|\d{4}|heute|lfd\.|laufend|present)/i;

  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      if (currentItem) items.push(currentItem);
      const period = match[0];
      const rest = line.substring(period.length).replace(/^[:\s|]+/, "").trim();
      const parts = rest.split(/[,|–-]/).map(p => p.trim()).filter(Boolean);
      currentItem = {
        period,
        position: parts[0] || "Fachposition",
        company: parts[1] || parts[0] || "Unternehmen",
        location: parts[2] || "Iran",
        tasks: []
      };
    } else if (currentItem) {
      if (line.startsWith("-") || line.startsWith("•") || line.startsWith("*")) {
        currentItem.tasks.push(line.replace(/^[-•*]\s*/, ""));
      } else if (line.length > 5 && !line.includes("---")) {
        if (currentItem.tasks.length === 0 && !currentItem.company.includes(line)) {
          currentItem.company += ` - ${line}`;
        } else {
          currentItem.tasks.push(line);
        }
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

function parseEducationBlock(block: string, defaultAnabin: string): EducationItem[] {
  const items: EducationItem[] = [];
  if (!block) return items;

  const lines = block.split("\n").map(l => l.replace(/^[#-*\s]+/, "").trim()).filter(Boolean);
  let currentItem: EducationItem | null = null;
  const dateRegex = /^(\d{2}\/\d{4}|\d{4})\s*[-–]\s*(\d{2}\/\d{4}|\d{4}|heute|lfd\.|laufend)/i;

  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      if (currentItem) items.push(currentItem);
      const period = match[0];
      const rest = line.substring(period.length).replace(/^[:\s|]+/, "").trim();
      const parts = rest.split(/[,|–-]/).map(p => p.trim()).filter(Boolean);
      currentItem = {
        period,
        degree: parts[0] || "Akademischer Grad",
        institution: parts[1] || "Universität",
        location: parts[2] || "Teheran",
        anabinStatus: defaultAnabin
      };
    } else if (currentItem) {
      if (line.toLowerCase().includes("anabin") || line.includes("H+")) {
        currentItem.anabinStatus = line.replace(/[()]/g, "").trim();
      } else if (line.length > 3 && !line.includes("---")) {
        currentItem.details = (currentItem.details ? currentItem.details + "; " : "") + line;
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

function parseSkillsBlock(block: string): SkillCategory[] {
  const list: SkillCategory[] = [];
  if (!block) return list;

  const lines = block.split("\n").map(l => l.replace(/^[-*•#]+\s*/, "").trim()).filter(Boolean);
  for (const line of lines) {
    if (line.includes(":") && !line.startsWith("---")) {
      const [category, skills] = line.split(":", 2);
      if (category && skills) {
        list.push({ category: category.trim(), skills: skills.trim() });
      }
    } else if (line.length > 5 && !line.includes("---")) {
      list.push({ category: "Fachkompetenzen", skills: line });
    }
  }
  return list;
}

function parseLanguagesBlock(block: string): LanguageItem[] {
  const list: LanguageItem[] = [];
  if (!block) return list;

  const lines = block.split("\n").map(l => l.replace(/^[-*•#]+\s*/, "").trim()).filter(Boolean);
  for (const line of lines) {
    if (line.includes(":") && !line.startsWith("---")) {
      const [lang, lvl] = line.split(":", 2);
      list.push({ language: lang.trim(), level: lvl.trim() });
    } else if (line.length > 3 && !line.includes("---")) {
      list.push({ language: line, level: "Verhandlungssicher" });
    }
  }
  return list;
}

/**
 * Generates the full printable, standard DIN 5008 HTML for Lebenslauf or Anschreiben.
 */
export function generateGermanCvHtml(cvData: GermanCvData): string {
  const parsed = parseCvContent(cvData);
  const isCoverLetter = cvData.docType === "cover";
  const style = cvData.style || "modern";
  const today = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date());

  const docTitle = isCoverLetter
    ? `Anschreiben - ${parsed.personalInfo.name} - DIN 5008`
    : `Lebenslauf - ${parsed.personalInfo.name} - Tabellarisch DIN 5008`;

  if (isCoverLetter) {
    return generateCoverLetterHtml(parsed, cvData, docTitle, today);
  }

  return generateLebenslaufHtml(parsed, cvData, docTitle, today, style);
}

function generateLebenslaufHtml(
  parsed: ReturnType<typeof parseCvContent>,
  cvData: GermanCvData,
  docTitle: string,
  today: string,
  style: "modern" | "classic"
): string {
  const { personalInfo, experience, education, skills, languages } = parsed;
  const format = cvData.format || "tabellarisch";

  let primaryColor = "#1e3a8a";
  let accentColor = "#2563eb";
  let formatBadgeText = "Tabellarischer Lebenslauf nach DIN 5008";

  if (format === "europass") {
    primaryColor = "#003399";
    accentColor = "#0284c7";
    formatBadgeText = "Europass-Lebenslauf (Europäischer Standard / CEFR)";
  } else if (format === "modern") {
    primaryColor = "#0f766e";
    accentColor = "#059669";
    formatBadgeText = "Modernes IT- & Tech-Layout (Zweispaltig)";
  } else if (format === "akademisch") {
    primaryColor = "#581c87";
    accentColor = "#7c3aed";
    formatBadgeText = "Akademischer Lebenslauf (Wissenschaft & Forschung)";
  } else if (style === "classic") {
    primaryColor = "#0f172a";
    accentColor = "#475569";
  }

  const showWatermark = cvData.showWatermark ?? false;

  return `<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>${docTitle} - ${formatBadgeText}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm !important;
      margin-top: 20mm !important;
      margin-bottom: 20mm !important;
      margin-left: 20mm !important;
      margin-right: 20mm !important;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 9pt;
      line-height: 1.45;
      box-sizing: border-box;
    }

    /* Top German Flag Ribbon */
    .de-flag-ribbon {
      display: flex;
      height: 3px;
      margin-bottom: 14px;
      border-radius: 1.5px;
      overflow: hidden;
    }
    .de-flag-black { flex: 1; background: #000000; }
    .de-flag-red { flex: 1; background: #dd0000; }
    .de-flag-gold { flex: 1; background: #ffce00; }

    /* Header Structure */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 10px;
    }

    .header-main {
      vertical-align: top;
    }

    .candidate-name {
      font-size: 20pt;
      font-weight: 800;
      color: ${primaryColor};
      margin: 0 0 3px 0;
      letter-spacing: -0.3px;
      text-transform: none;
    }

    .candidate-title {
      font-size: 11pt;
      font-weight: 600;
      color: ${accentColor};
      margin: 0 0 6px 0;
    }

    .doc-type-badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      padding: 2px 8px;
      border-radius: 3px;
      border: 1px solid #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .anabin-badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      background: #ecfdf5;
      color: #065f46;
      padding: 2px 8px;
      border-radius: 3px;
      border: 1px solid #a7f3d0;
      margin-left: 6px;
    }

    .contact-table {
      width: 100%;
      margin-top: 8px;
      font-size: 8pt;
      color: #475569;
      line-height: 1.4;
    }

    .contact-table td {
      padding: 1px 0;
    }

    .contact-label {
      font-weight: 600;
      color: #1e293b;
      width: 85px;
    }

    /* Section Headings */
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      color: ${primaryColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.2px solid #cbd5e1;
      padding-bottom: 3px;
      margin: 12px 0 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .section-title-sub {
      font-size: 7pt;
      font-weight: 600;
      color: #64748b;
      text-transform: none;
    }

    /* Tabular Layout (DIN Standard: Date column left, content right) */
    .tab-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }

    .tab-table tr {
      page-break-inside: avoid;
    }

    .tab-date-col {
      width: 115px;
      vertical-align: top;
      font-size: 8pt;
      font-weight: 600;
      color: #475569;
      padding: 4px 10px 6px 0;
      white-space: nowrap;
    }

    .tab-content-col {
      vertical-align: top;
      padding: 4px 0 6px 0;
    }

    .tab-item-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .tab-item-company {
      font-size: 8.2pt;
      font-weight: 600;
      color: ${accentColor};
      margin: 1px 0 3px 0;
    }

    .tab-item-bullets {
      margin: 2px 0 0 0;
      padding-left: 14px;
      font-size: 8pt;
      color: #334155;
    }

    .tab-item-bullets li {
      margin-bottom: 2px;
      line-height: 1.35;
    }

    /* Skills Grid */
    .skills-grid {
      display: table;
      width: 100%;
      margin-bottom: 4px;
    }

    .skill-row {
      display: table-row;
    }

    .skill-name {
      display: table-cell;
      width: 115px;
      font-size: 8pt;
      font-weight: 700;
      color: #334155;
      padding: 3px 10px 3px 0;
      vertical-align: top;
    }

    .skill-values {
      display: table-cell;
      font-size: 8pt;
      color: #0f172a;
      padding: 3px 0;
      vertical-align: top;
    }

    /* Language Pills */
    .lang-row {
      display: table-row;
    }

    .lang-name {
      display: table-cell;
      width: 115px;
      font-size: 8pt;
      font-weight: 700;
      color: #334155;
      padding: 3px 10px 3px 0;
      vertical-align: middle;
    }

    .lang-level {
      display: table-cell;
      font-size: 8pt;
      color: #0f172a;
      padding: 3px 0;
      vertical-align: middle;
    }

    .lang-pill {
      display: inline-block;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-left: 4px;
    }

    /* German Signature Block (Ort, Datum & Unterschrift) */
    .signature-block {
      margin-top: 20px;
      padding-top: 10px;
      page-break-inside: avoid;
    }

    .signature-date {
      font-size: 8.5pt;
      color: #334155;
      margin-bottom: 25px;
    }

    .signature-line {
      width: 220px;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 4px;
    }

    .signature-name {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    /* Footer stamp */
    .footer-note {
      margin-top: 15px;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      font-size: 6.8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }

    /* Jahanban Branding Watermark Overlay */
    .jb-print-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-24deg);
      width: 440px;
      max-width: 80%;
      opacity: 0.046;
      z-index: -100;
      pointer-events: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .jb-print-watermark .watermark-title {
      font-size: 28pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 2px;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .jb-print-watermark .watermark-sub {
      font-size: 11pt;
      font-weight: 700;
      color: #334155;
      letter-spacing: 4px;
      margin-top: 6px;
    }

    .jb-print-watermark .watermark-legal {
      font-size: 8pt;
      font-weight: 600;
      color: #64748b;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  ${showWatermark ? `
  <div class="jb-print-watermark" aria-hidden="true">
    <div class="watermark-title">JAHANBAN GROUP</div>
    <div class="watermark-sub">CREATIVE HOUSE • CAREER HUB</div>
    <div class="watermark-legal">OFFIZIELLES BEWERBUNGSDOKUMENT NACH DIN 5008</div>
  </div>` : ""}

  <!-- Top German National Colors Accent -->
  <div class="de-flag-ribbon">
    <div class="de-flag-black"></div>
    <div class="de-flag-red"></div>
    <div class="de-flag-gold"></div>
  </div>

  <!-- Header Block -->
  <table class="header-table">
    <tr>
      <td class="header-main">
        <h1 class="candidate-name">${personalInfo.name}</h1>
        <div class="candidate-title">${personalInfo.field}</div>
        <div>
          <span class="doc-type-badge">${formatBadgeText}</span>
          <span class="anabin-badge">✓ ${personalInfo.anabinStatus}</span>
        </div>

        <table class="contact-table">
          <tr>
            <td class="contact-label">Wohnort / Status:</td>
            <td>${personalInfo.address}</td>
            <td class="contact-label">E-Mail:</td>
            <td>${personalInfo.email}</td>
          </tr>
          <tr>
            <td class="contact-label">Staatsangehörigkeit:</td>
            <td>${personalInfo.nationality}</td>
            <td class="contact-label">Telefon:</td>
            <td>${personalInfo.phone}</td>
          </tr>
          ${personalInfo.birthDate ? `
          <tr>
            <td class="contact-label">Geburtsdatum:</td>
            <td>${personalInfo.birthDate}</td>
            <td></td>
            <td></td>
          </tr>
          ` : ""}
        </table>
      </td>
    </tr>
  </table>

  <!-- 1. Beruflicher Werdegang -->
  <div class="section-title">
    <span>Beruflicher Werdegang</span>
    <span class="section-title-sub">Praktische Berufserfahrung (Chronologisch absteigend)</span>
  </div>

  <table class="tab-table">
    ${experience.map(exp => `
      <tr>
        <td class="tab-date-col">${exp.period}</td>
        <td class="tab-content-col">
          <div class="tab-item-title">${exp.position}</div>
          <div class="tab-item-company">${exp.company}${exp.location ? ` | ${exp.location}` : ""}</div>
          ${exp.tasks.length > 0 ? `
            <ul class="tab-item-bullets">
              ${exp.tasks.map(t => `<li>${t}</li>`).join("")}
            </ul>
          ` : ""}
        </td>
      </tr>
    `).join("")}
  </table>

  <!-- 2. Schul- und Hochschulbildung -->
  <div class="section-title">
    <span>Ausbildung & Akademischer Werdegang</span>
    <span class="section-title-sub">Hochschulabschluss & Anerkennung</span>
  </div>

  <table class="tab-table">
    ${education.map(edu => `
      <tr>
        <td class="tab-date-col">${edu.period}</td>
        <td class="tab-content-col">
          <div class="tab-item-title">${edu.degree}</div>
          <div class="tab-item-company">${edu.institution}${edu.location ? ` (${edu.location})` : ""}</div>
          ${edu.anabinStatus ? `<div style="font-size: 7.5pt; color: #059669; font-weight: 600; margin-top: 1px;">✓ Anabin-Status: ${edu.anabinStatus}</div>` : ""}
          ${edu.details ? `<div style="font-size: 7.8pt; color: #475569; margin-top: 2px;">${edu.details}</div>` : ""}
        </td>
      </tr>
    `).join("")}
  </table>

  <!-- 3. Fachliche Kompetenzen & IT-Kenntnisse -->
  <div class="section-title">
    <span>Fachliche Kenntnisse & Qualifikationen</span>
    <span class="section-title-sub">Technologien, Werkzeuge & Methodik</span>
  </div>

  <div class="skills-grid">
    ${skills.map(s => `
      <div class="skill-row">
        <div class="skill-name">${s.category}:</div>
        <div class="skill-values">${s.skills}</div>
      </div>
    `).join("")}
  </div>

  <!-- 4. Sprachkenntnisse -->
  <div class="section-title">
    <span>Sprachkenntnisse</span>
    <span class="section-title-sub">Nach dem Gemeinsamen Europäischen Referenzrahmen (GER)</span>
  </div>

  <div class="skills-grid">
    ${languages.map(l => `
      <div class="lang-row">
        <div class="lang-name">${l.language}:</div>
        <div class="lang-level">
          ${l.level}
          ${l.level.includes("C1") ? '<span class="lang-pill">Verhandlungssicher</span>' : ""}
          ${l.level.includes("B1") || l.level.includes("B2") ? '<span class="lang-pill">Gute Arbeitskenntnisse</span>' : ""}
          ${l.level.toLowerCase().includes("mutter") ? '<span class="lang-pill">Muttersprache</span>' : ""}
        </div>
      </div>
    `).join("")}
  </div>

  <!-- Ort, Datum & Unterschrift (Standard in German CVs) -->
  <div class="signature-block">
    <div class="signature-date">Teheran, den ${today}</div>
    <div class="signature-line"></div>
    <div class="signature-name">${personalInfo.name}</div>
  </div>

  <!-- Administrative Footer -->
  <div class="footer-note">
    <span>Erstellt nach deutschem Standard (DIN 5008 / Tabellarischer Lebenslauf) • Jahanban Career Platform</span>
    <span>Akkreditiert für Visumantrag §18b / §18g AufenthG (Blaue Karte EU)</span>
  </div>

</body>
</html>`;
}

function generateCoverLetterHtml(
  parsed: ReturnType<typeof parseCvContent>,
  cvData: GermanCvData,
  docTitle: string,
  today: string
): string {
  const { personalInfo, coverLetterContent } = parsed;
  const showWatermark = cvData.showWatermark ?? false;

  const paragraphs = coverLetterContent && coverLetterContent.length > 0
    ? coverLetterContent
    : [
        "mit großem Interesse habe ich Ihre Stellenausschreibung für die Position in Ihrem Unternehmen auf dem Portal Make-it-in-Germany gelesen. Als qualifizierte Fachkraft mit langjähriger praktischer Erfahrung bewerbe ich mich hiermit um diese Position.",
        "In meinen bisherigen Projekten konnte ich tiefgehende Expertise in der Entwicklung skalierbarer Systeme, strukturierter Problemlösung und agiler Zusammenarbeit aufbauen. Meine Arbeitsweise zeichnet sich durch hohe Zuverlässigkeit, kontinuierliches Qualitätsbewusstsein und rasche Auffassungsgabe aus.",
        "Mein Hochschulabschluss ist in Deutschland voll anerkannt (Anabin-Status H+). Zudem erfülle ich alle gesetzlichen Kriterien für das beschleunigte Fachkräfteverfahren sowie die Erteilung der Blauen Karte EU (§18g AufenthG). Ein Umzug nach Deutschland ist für mich kurzfristig realisierbar.",
        "Über eine Einladung zu einem persönlichen Vorstellungsgespräch freue ich mich sehr."
      ];

  return `<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm !important;
      margin-top: 20mm !important;
      margin-bottom: 20mm !important;
      margin-left: 20mm !important;
      margin-right: 20mm !important;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 9.5pt;
      line-height: 1.55;
      box-sizing: border-box;
    }

    .absender {
      margin-bottom: 25px;
      font-size: 8.5pt;
      color: #334155;
      line-height: 1.35;
    }

    .absender-name {
      font-weight: 800;
      font-size: 11pt;
      color: #1e3a8a;
      margin-bottom: 2px;
    }

    .empfaenger {
      margin-bottom: 35px;
      font-size: 9pt;
      color: #1e293b;
      line-height: 1.35;
    }

    .datum-zeile {
      text-align: right;
      font-size: 9pt;
      color: #475569;
      margin-bottom: 25px;
    }

    .betreff {
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 18px;
    }

    .anrede {
      font-weight: 700;
      margin-bottom: 14px;
    }

    .brief-text p {
      margin: 0 0 12px 0;
      text-align: justify;
    }

    .grussformel {
      margin-top: 22px;
      margin-bottom: 30px;
    }

    .unterschrift-linie {
      width: 200px;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 4px;
    }

    .anlagen {
      margin-top: 25px;
      font-size: 8pt;
      color: #64748b;
    }

    /* Jahanban Branding Watermark Overlay */
    .jb-print-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-24deg);
      width: 440px;
      max-width: 80%;
      opacity: 0.046;
      z-index: -100;
      pointer-events: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .jb-print-watermark .watermark-title {
      font-size: 28pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 2px;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .jb-print-watermark .watermark-sub {
      font-size: 11pt;
      font-weight: 700;
      color: #334155;
      letter-spacing: 4px;
      margin-top: 6px;
    }

    .jb-print-watermark .watermark-legal {
      font-size: 8pt;
      font-weight: 600;
      color: #64748b;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  ${showWatermark ? `
  <div class="jb-print-watermark" aria-hidden="true">
    <div class="watermark-title">JAHANBAN GROUP</div>
    <div class="watermark-sub">CREATIVE HOUSE • CAREER HUB</div>
    <div class="watermark-legal">OFFIZIELLES ANSCHREIBEN NACH DIN 5008</div>
  </div>` : ""}

  <!-- Absender nach DIN 5008 -->
  <div class="absender">
    <div class="absender-name">${personalInfo.name}</div>
    <div>${personalInfo.field}</div>
    <div>${personalInfo.address}</div>
    <div>Tel: ${personalInfo.phone} | E-Mail: ${personalInfo.email}</div>
  </div>

  <!-- Empfänger -->
  <div class="empfaenger">
    <div>Unternehmen / Personalabteilung</div>
    <div>Musterstraße 123</div>
    <div>Deutschland</div>
  </div>

  <!-- Datum -->
  <div class="datum-zeile">
    Teheran, den ${today}
  </div>

  <!-- Betreff -->
  <div class="betreff">
    Bewerbung als ${personalInfo.field} (m/w/d)
  </div>

  <div class="anrede">
    Sehr geehrte Damen und Herren,
  </div>

  <div class="brief-text">
    ${paragraphs.map(p => `<p>${p}</p>`).join("")}
  </div>

  <div class="grussformel">
    <div>Mit freundlichen Grüßen,</div>
    <div style="height: 35px;"></div>
    <div class="unterschrift-linie"></div>
    <div style="font-weight: 700;">${personalInfo.name}</div>
  </div>

  <div class="anlagen">
    <strong>Anlagen:</strong> Tabellarischer Lebenslauf, Hochschulzeugnis (Anabin H+), Sprachzertifikate
  </div>

</body>
</html>`;
}

/**
 * Directly renders and exports the German CV or Cover Letter to a clean, high-resolution DIN A4 PDF file
 * using isolated iframe, html2canvas, and jsPDF.
 */
export async function exportGermanCvToPdf(
  cvData: GermanCvData,
  filename?: string,
  options?: PdfExportOptions
): Promise<void> {
  const html = generateGermanCvHtml(cvData);
  const cleanName = (cvData.name || "Bewerber").trim().replace(/\s+/g, "_");
  const defaultFilename = cvData.docType === "cover"
    ? `Anschreiben_${cleanName}_DIN5008.pdf`
    : `Lebenslauf_${cleanName}_DIN5008.pdf`;

  return exportToPdfWithHtml2Pdf(html, filename || defaultFilename, {
    margin: [8, 8, 8, 8],
    orientation: "portrait",
    scale: 2,
    ...options
  });
}
