import React from "react";
import { 
  FileSpreadsheet, Globe, Sparkles, GraduationCap, 
  MapPin, Phone, Mail, Award, CheckCircle2, ShieldCheck, 
  BookOpen, ExternalLink, Cpu, Layers, User, Calendar
} from "lucide-react";
import { GermanCvFormatId } from "../data/germanCvFormatsData";
import { CVBuilderInput } from "../types";

interface GermanCvVisualPreviewProps {
  formatId: GermanCvFormatId;
  inputs: CVBuilderInput;
  rawText?: string;
}

export const GermanCvVisualPreview: React.FC<GermanCvVisualPreviewProps> = ({
  formatId,
  inputs,
  rawText
}) => {
  const name = inputs.name || "Max Mustermann";
  const field = inputs.field || "Softwareentwickler / IT-Fachkraft";
  const address = inputs.address || "Valiasr Ave. 1420, 19979-12345 Teheran, Iran (Bereit zum Umzug nach Deutschland)";
  const experience = inputs.experience || "۳ سال سابقه کاری تخصصی در زمینه توسعه نرم‌افزار و معماری سیستم‌های توزیع‌شده.";
  const education = inputs.education || "کارشناسی مهندسی کامپیوتر (تاییدیه H+ در آنابین آلمان).";
  const skills = inputs.skills || "React, TypeScript, Node.js, PostgreSQL, Docker, Git";
  const languages = inputs.languages || "فارسی (زبان مادری)، انگلیسی (C1)، آلمانی (B1)";
  const anabin = "H+ anerkannt (KMK / ZAB Datenbank)";

  // ---------------------------------------------------------------------------
  // 1. TABELLARISCHER LEBENSLAUF (DIN 5008)
  // ---------------------------------------------------------------------------
  if (formatId === "tabellarisch") {
    return (
      <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-7 font-sans text-xs shadow-md border border-slate-300 space-y-5 select-text text-left" dir="ltr">
        {/* German Flag Tri-color top ribbon */}
        <div className="flex h-1 rounded overflow-hidden">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-amber-400" />
        </div>

        {/* DIN 5008 Header */}
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              LEBENSLAUF
            </h1>
            <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">
              Tabellarischer Lebenslauf nach DIN 5008
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-900">{name}</div>
            <div className="font-mono text-[10px] text-slate-500 max-w-[280px] truncate">{address}</div>
            <div className="text-[10px] text-indigo-700 font-medium">mustermann.karriere@beispiel.de</div>
          </div>
        </div>

        {/* Section 1: Persönliche Daten */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 border-b border-slate-300 pb-1 tracking-wider flex items-center justify-between">
            <span>PERSÖNLICHE DATEN</span>
            <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Blaue Karte EU berechtigt (§ 18g AufenthG)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            <div><span className="text-slate-500 w-28 inline-block">Name:</span> <strong className="text-slate-900">{name}</strong></div>
            <div><span className="text-slate-500 w-28 inline-block">Berufsbezeichnung:</span> <strong className="text-slate-900">{field}</strong></div>
            <div><span className="text-slate-500 w-28 inline-block">Staatsangehörigkeit:</span> <span>Iranisch (Umzugsbereit)</span></div>
            <div><span className="text-slate-500 w-28 inline-block">Familienstand:</span> <span>Ledig</span></div>
            <div><span className="text-slate-500 w-28 inline-block">Anabin-Status:</span> <strong className="text-emerald-700">{anabin}</strong></div>
            <div><span className="text-slate-500 w-28 inline-block">Geburtsort:</span> <span>Teheran</span></div>
          </div>
        </div>

        {/* Section 2: Beruflicher Werdegang (Tabular) */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-black uppercase text-slate-900 border-b border-slate-300 pb-1 tracking-wider">
            BERUFLICHER WERDEGANG
          </h2>
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-12 gap-3 pb-2 border-b border-slate-100">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-mono font-bold text-slate-700">
                03/2022 – heute
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-1">
                <div className="font-bold text-slate-900 text-xs">
                  Senior {field} | Muster-IT Systems Co.
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  {experience}
                </div>
                <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5 pt-0.5">
                  <li>Architektur skalierbarer Applikationen und Microservices</li>
                  <li>Leistungsoptimierung von Datenbanken und Reduzierung der Latenz</li>
                  <li>Fachliche Führung und Mentoring im agilen Team (Scrum)</li>
                </ul>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-mono font-bold text-slate-700">
                09/2018 – 02/2022
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-1">
                <div className="font-bold text-slate-900 text-xs">
                  Software Developer & Fachkraft | Persian Solutions LLC
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  Entwicklung responsiver Web-Oberflächen und API-Schnittstellen für Unternehmenskunden.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Schul- und Berufsbildung */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 border-b border-slate-300 pb-1 tracking-wider">
            SCHUL- UND BERUFSBILDUNG
          </h2>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-3 text-[11px] font-mono font-bold text-slate-700">
              09/2014 – 07/2018
            </div>
            <div className="col-span-12 sm:col-span-9 space-y-1">
              <div className="font-bold text-slate-900 text-xs">
                {education}
              </div>
              <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-medium">
                KMK / Anabin: Hochschule Status H+ (Volle Gleichwertigkeit mit deutschem Hochschulabschluss)
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Fachkenntnisse & Sprachen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-1">
              FACHKENNTNISSE & IT
            </h3>
            <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
              {skills}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-1">
              SPRACHKENNTNISSE (GER)
            </h3>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {languages}
            </p>
          </div>
        </div>

        {/* Signature & Date Box */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-600">
          <div>
            <span>Berlin / Teheran, den 16. Oktober 2026</span>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <span className="font-serif italic font-bold text-slate-800">{name}</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. EUROPASS-LEBENSLAUF
  // ---------------------------------------------------------------------------
  if (formatId === "europass") {
    return (
      <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-7 font-sans text-xs shadow-md border border-sky-300 space-y-5 select-text text-left" dir="ltr">
        {/* Europass Distinctive Blue Header */}
        <div className="flex items-center justify-between border-b-2 border-sky-600 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-sm">
              eu
            </div>
            <div>
              <div className="text-lg font-black text-sky-900 tracking-tight">
                europass
              </div>
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
                Curriculum Vitae
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-slate-900">{name}</div>
            <div className="text-[10px] text-slate-500 font-mono">Europäischer Qualifikationsrahmen (EQR 6)</div>
          </div>
        </div>

        {/* Europass Personal Information */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-sky-800 tracking-wider">
            ANGABEN ZUR PERSON
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-sky-50/50 p-3 rounded-lg border border-sky-100">
            <div><span className="text-slate-500 w-32 inline-block">Vorname / Nachname:</span> <strong>{name}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">E-Mail:</span> <span className="text-sky-700 font-mono">mustermann.europass@beispiel.de</span></div>
            <div><span className="text-slate-500 w-32 inline-block">Wohnsitz / Land:</span> <span>Teheran / Deutschland (Relocation)</span></div>
            <div><span className="text-slate-500 w-32 inline-block">Staatsangehörigkeit:</span> <span>Iranisch</span></div>
          </div>
        </div>

        {/* Desired Occupation */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">GEWÜNSCHTE BESCHÄFTIGUNG:</span>
          <span className="text-xs font-black text-sky-900">{field}</span>
        </div>

        {/* Work Experience */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-sky-800 tracking-wider">
            BERUFSERFAHRUNG
          </h2>
          <div className="border-l-2 border-sky-500 pl-3 space-y-1.5 py-1">
            <div className="text-[10px] font-mono text-sky-700 font-bold">03/2022 – LAUFEND</div>
            <div className="font-bold text-slate-900 text-xs">Senior {field}</div>
            <div className="text-[11px] text-slate-600">{experience}</div>
            <div className="text-[10px] text-slate-500 font-medium">Tätigkeitssektor: IT-Dienstleistungen & Softwareentwicklung</div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-sky-800 tracking-wider">
            SCHUL- UND BERUFSBILDUNG
          </h2>
          <div className="border-l-2 border-sky-500 pl-3 space-y-1 py-1">
            <div className="text-[10px] font-mono text-sky-700 font-bold">09/2014 – 07/2018</div>
            <div className="font-bold text-slate-900 text-xs">{education}</div>
            <div className="text-[10px] text-sky-800 font-semibold">Anabin H+ Gleichwertigkeit vorhanden</div>
          </div>
        </div>

        {/* Official CEFR Language Passport Table */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-sky-800 tracking-wider flex items-center justify-between">
            <span>SPRACHLICHE KOMPETENZEN (GEMEINSAMER EUROPÄISCHER REFERENZRAHMEN - GER)</span>
            <span className="text-[10px] text-slate-500 font-normal">CEFR A1–C2</span>
          </h2>
          <div className="overflow-x-auto border border-sky-200 rounded-lg">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-sky-100/70 text-sky-950 font-bold border-b border-sky-200">
                  <th className="p-2">Sprache</th>
                  <th className="p-2">Hören</th>
                  <th className="p-2">Lesen</th>
                  <th className="p-2">An Gesprächen teilnehmen</th>
                  <th className="p-2">Zusammenhängendes Sprechen</th>
                  <th className="p-2">Schreiben</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                <tr>
                  <td className="p-2 font-bold text-slate-900">Persisch</td>
                  <td colSpan={5} className="p-2 text-slate-600 font-medium bg-slate-50/50">Muttersprache (C2 Niveau)</td>
                </tr>
                <tr className="bg-sky-50/30">
                  <td className="p-2 font-bold text-sky-900">Englisch</td>
                  <td className="p-2 font-mono font-bold text-sky-700">C1</td>
                  <td className="p-2 font-mono font-bold text-sky-700">C1</td>
                  <td className="p-2 font-mono font-bold text-sky-700">C1</td>
                  <td className="p-2 font-mono font-bold text-sky-700">C1</td>
                  <td className="p-2 font-mono font-bold text-sky-700">C1</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-sky-900">Deutsch</td>
                  <td className="p-2 font-mono font-bold text-amber-700">B1</td>
                  <td className="p-2 font-mono font-bold text-amber-700">B1</td>
                  <td className="p-2 font-mono font-bold text-amber-700">B1</td>
                  <td className="p-2 font-mono font-bold text-amber-700">B1</td>
                  <td className="p-2 font-mono font-bold text-amber-700">B1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Digital Competences (DigComp 2.2) */}
        <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <h2 className="text-[11px] font-black uppercase text-slate-800">
            DIGITALE KOMPETENZEN (DIGCOMP 2.2)
          </h2>
          <div className="text-[11px] text-slate-700 leading-relaxed font-mono">
            {skills}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. MODERNES IT- & TECH-LAYOUT (2-Column with Sidebar)
  // ---------------------------------------------------------------------------
  if (formatId === "modern") {
    return (
      <div className="bg-slate-950 text-white rounded-xl overflow-hidden shadow-lg border border-slate-800 font-sans text-xs select-text text-left" dir="ltr">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          {/* Left Dark Modern Sidebar (Span 4) */}
          <div className="md:col-span-4 bg-slate-900 p-5 border-r border-slate-800 space-y-5">
            {/* Avatar Placeholder */}
            <div className="text-center space-y-2 pb-3 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white text-xl font-black shadow-md shadow-emerald-900/30">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="text-sm font-black text-white">{name}</h2>
              <p className="text-[10px] text-emerald-400 font-mono">{field}</p>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-[11px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">KONTAKT</span>
              <div className="text-slate-300 space-y-1 font-mono text-[10px]">
                <div className="truncate">📍 Berlin / Teheran</div>
                <div className="truncate">✉️ mustermann.dev@beispiel.de</div>
                <div className="truncate">🔗 github.com/maxmustermann</div>
              </div>
            </div>

            {/* Visual Skill Meters */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">TECH-STACK & SKILLS</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-mono">
                    <span className="text-slate-300">Frontend (React/TypeScript)</span>
                    <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-mono">
                    <span className="text-slate-300">Backend (Node.js/SQL)</span>
                    <span className="text-emerald-400">85%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 font-mono">
                    <span className="text-slate-300">DevOps & Cloud (Docker/AWS)</span>
                    <span className="text-emerald-400">78%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[78%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2 text-[11px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">SPRACHEN</span>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-300">Persisch</span> <span className="text-emerald-400 font-bold">C2 (Muttersprache)</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Englisch</span> <span className="text-emerald-400 font-bold">C1 (IELTS 7.5)</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Deutsch</span> <span className="text-amber-400 font-bold">B1 (Aktiv lernend)</span></div>
              </div>
            </div>
          </div>

          {/* Right Main Body (Span 8) */}
          <div className="md:col-span-8 p-5 sm:p-6 space-y-5 bg-slate-950">
            {/* Kurzprofil (Executive Summary) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                KURZPROFIL (EXECUTIVE SUMMARY)
              </span>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Ergebnisorientierter {field} mit nachweisbarer Praxiserfahrung in Konzeption und Skalierung moderner Webplattformen. Spezialisiert auf saubere Architekturen, hohe Performance und agiles Arbeiten in internationalen Teams. Voll berechtigt zur Blauen Karte EU.
              </p>
            </div>

            {/* Work Experience */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-slate-800 pb-1">
                BERUFLICHE ERFAHRUNG
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs">Senior Full-Stack Engineer</strong>
                    <span className="text-[10px] text-emerald-400 font-mono">03/2022 – HEUTE</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Muster IT-Solutions GmbH | Berlin / Remote</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed pt-0.5">{experience}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {["React 18", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"].map((tag, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-slate-800 pb-1">
                AUSBILDUNG & ANERKENNUNG
              </h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs">{education}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">2014 – 2018</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  Anabin H+ Akkreditiert | Volle Gleichwertigkeit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. AKADEMISCHER LEBENSLAUF
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-7 font-serif text-xs shadow-md border border-purple-200 space-y-5 select-text text-left" dir="ltr">
      {/* Academic Header */}
      <div className="border-b-2 border-purple-900 pb-3 flex justify-between items-start">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-sans">
            CURRICULUM VITAE
          </h1>
          <p className="text-xs font-bold text-purple-900 font-sans mt-0.5">
            Wissenschaftlicher Werdegang & Forschungsportfolio
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-700">
          <div className="font-bold text-slate-950 font-sans">{name}, B.Sc.</div>
          <div className="text-[10px] text-slate-500 font-mono">Berechtigt zu § 18d AufenthG (Forscher)</div>
        </div>
      </div>

      {/* Research Focus */}
      <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200 space-y-1">
        <h2 className="text-[11px] font-black uppercase text-purple-950 font-sans tracking-wider">
          FORSCHUNGSSCHWERPUNKTE (RESEARCH INTERESTS)
        </h2>
        <p className="text-[11px] text-purple-950 leading-relaxed font-sans">
          Verteilte Systeme, Skalierbarkeit cloudbasierter Datenstrukturen, Algorithmische Optimierung relationaler Datenbanken und angewandte künstliche Intelligenz in der Softwaretechnik.
        </p>
      </div>

      {/* Academic Education */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase text-slate-950 border-b border-slate-300 pb-1 font-sans">
          AKADEMISCHE AUSBILDUNG
        </h2>
        <div className="grid grid-cols-12 gap-3 text-[11px]">
          <div className="col-span-12 sm:col-span-3 font-mono font-bold text-slate-700">
            09/2014 – 07/2018
          </div>
          <div className="col-span-12 sm:col-span-9 space-y-1">
            <div className="font-bold text-slate-950">{education}</div>
            <div className="text-[10px] text-slate-600">
              Abschlussarbeit: "Optimierung von verteilten Caching-Strategien in hochfrequentierten Enterprise-Websystemen"
            </div>
            <div className="text-[10px] text-purple-800 font-sans font-bold">
              Betreuer: Prof. Dr. A. Rezaei | Anabin-Status: H+ (KMK ZAB anerkannt)
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Practice & Research */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase text-slate-950 border-b border-slate-300 pb-1 font-sans">
          WISSENSCHAFTLICHE & PRAKTISCHE ERFAHRUNG
        </h2>
        <div className="grid grid-cols-12 gap-3 text-[11px]">
          <div className="col-span-12 sm:col-span-3 font-mono font-bold text-slate-700">
            03/2022 – heute
          </div>
          <div className="col-span-12 sm:col-span-9 space-y-1">
            <div className="font-bold text-slate-950">Senior Research Engineer & Entwickler</div>
            <div className="text-[11px] text-slate-700 leading-relaxed">{experience}</div>
          </div>
        </div>
      </div>

      {/* Publications */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase text-slate-950 border-b border-slate-300 pb-1 font-sans">
          PUBLIKATIONEN & KONFERENZBEITRÄGE (AUSZUG)
        </h2>
        <ol className="list-decimal list-inside text-[10px] text-slate-800 space-y-1 pl-1 font-sans">
          <li>
            <strong className="text-slate-950">{name}</strong>, Rezaei, A. (2023): "Performance Benchmarking of Distributed Cache Algorithms in Cloud Environments". In: <em>International Journal of Software Engineering</em>, Vol. 14, Nr. 3, S. 112–128.
          </li>
          <li>
            <strong className="text-slate-950">{name}</strong>, Alavi, K. (2022): "Latency Reduction in Reactive Microservices Architecture". Vorgetragen auf der IEEE International Conference on Web Services.
          </li>
        </ol>
      </div>

      {/* Languages & Memberships */}
      <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
        <div>
          <span className="font-bold text-slate-900 block">Sprachkenntnisse:</span>
          <span className="text-slate-600">{languages}</span>
        </div>
        <div>
          <span className="font-bold text-slate-900 block">Mitgliedschaften:</span>
          <span className="text-slate-600">IEEE Computer Society, ACM</span>
        </div>
      </div>
    </div>
  );
};

export default GermanCvVisualPreview;
