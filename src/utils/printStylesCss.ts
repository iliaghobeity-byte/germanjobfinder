/**
 * Official Print Stylesheet Extracted & Unwrapped from src/index.css
 * Guaranteed DIN 5008 & FEG 2026 Legal Formatting Standards.
 *
 * Used by jsPDF and html2canvas to ensure that ALL print styles defined
 * in src/index.css are fully applied inside the rendering canvas.
 */

export const INDEX_CSS_PRINT_STYLES = `
/* ==========================================================================
   1. Universal High-Contrast Print & Color Reset (DIN 5008 & index.css)
   ========================================================================== */
*, *::before, *::after {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  text-shadow: none !important;
  box-shadow: none !important;
  animation: none !important;
  transition: none !important;
  box-sizing: border-box !important;
}

html, body {
  background-color: #ffffff !important;
  color: #0f172a !important;
  font-family: var(--font-sans), "Vazirmatn", "Shabnam", Tahoma, sans-serif !important;
  font-size: 10pt !important;
  line-height: 1.55 !important;
  direction: rtl !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}

/* Paragraph, text blocks & list items: never cut across page boundaries */
p, li, tr, td, th, dt, dd, blockquote,
.report-section, .report-item, .summary-box, .evaluation-card,
.print-card, .print-box, .profile-card, .milestone-card, .roadmap-step,
.budget-card, .avoid-break, .break-inside-avoid, [class*="break-inside-avoid"] {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
  -webkit-column-break-inside: avoid !important;
  orphans: 3 !important;
  widows: 3 !important;
}

h1, h2, h3, h4, h5, h6 {
  break-after: avoid !important;
  page-break-after: avoid !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

/* Visibility Control: strictly show print elements, hide screen controls */
.no-print,
.dashboard-screen-only,
.screen-only,
[data-no-print="true"],
header:not(.jb-print-header),
footer:not(.jb-print-footer),
nav,
button,
input,
select,
textarea,
.scrollbar-thin,
.print-simulation-toolbar,
.simulation-action-btn,
#embassy-alerts-banner,
.tab-navigation,
[role="status"],
.toast-container {
  display: none !important;
}

.print-only,
[data-print-only="true"] {
  display: block !important;
}

/* Containers and overflow resets */
html, body, #root, main,
#dashboard-tab,
.print-document-sheet,
.print-page-wrapper,
.print-container,
div[class*="overflow-hidden"],
div[class*="overflow-y-auto"] {
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
  min-height: 0 !important;
}

/* ==========================================================================
   2. Official Jahanban Print Header (.jb-print-header)
   ========================================================================== */
.jb-print-header {
  display: flex !important;
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  box-sizing: border-box !important;
  border-bottom: 2px solid #0f172a !important;
  padding-bottom: 3.5mm !important;
  margin-bottom: 6mm !important;
  background: #ffffff !important;
  z-index: 50 !important;
  justify-content: space-between !important;
  align-items: center !important;
  direction: rtl !important;
  page-break-after: avoid !important;
  break-after: avoid !important;
}

.jb-print-brand {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  min-width: 170px !important;
}

.jb-print-logo {
  width: 38px !important;
  height: 38px !important;
  object-fit: contain !important;
  border-radius: 6px !important;
  border: 1.5px solid #d97706 !important;
  padding: 1px !important;
  background: #ffffff !important;
}

.jb-print-brand-text {
  display: flex !important;
  flex-direction: column !important;
  text-align: right !important;
}

.jb-print-brand-title {
  font-size: 10pt !important;
  font-weight: 900 !important;
  color: #0f172a !important;
  margin: 0 !important;
  line-height: 1.2 !important;
}

.jb-print-brand-sub {
  font-size: 7pt !important;
  font-weight: 700 !important;
  color: #b45309 !important;
  margin: 2px 0 0 0 !important;
  line-height: 1.2 !important;
}

.jb-print-brand-system {
  font-size: 6.2pt !important;
  color: #475569 !important;
  margin: 1px 0 0 0 !important;
  line-height: 1.2 !important;
}

.jb-print-subject-box {
  text-align: center !important;
  padding: 0 10px !important;
  flex: 1 !important;
  max-width: 44% !important;
}

.jb-print-badge {
  display: inline-block !important;
  font-size: 6.5pt !important;
  font-weight: 800 !important;
  color: #1e3a8a !important;
  background-color: #eff6ff !important;
  border: 1px solid #bfdbfe !important;
  border-radius: 4px !important;
  padding: 1px 8px !important;
  margin-bottom: 2px !important;
}

.jb-print-subject {
  font-size: 9.5pt !important;
  font-weight: 900 !important;
  color: #0f172a !important;
  margin: 0 !important;
  line-height: 1.35 !important;
}

.jb-print-meta {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  text-align: left !important;
  direction: ltr !important;
  font-size: 7pt !important;
  min-width: 155px !important;
}

.jb-print-meta-item {
  display: flex !important;
  justify-content: space-between !important;
  gap: 8px !important;
  border-bottom: 1px dashed #e2e8f0 !important;
  padding-bottom: 1px !important;
}

.jb-print-meta-item:last-child {
  border-bottom: none !important;
}

.jb-print-meta-label {
  color: #64748b !important;
  font-weight: 700 !important;
}

.jb-print-meta-val {
  color: #0f172a !important;
  font-weight: 800 !important;
}

/* ==========================================================================
   3. Official Watermark (.jb-print-watermark)
   ========================================================================== */
.jb-print-watermark {
  display: flex !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 440px !important;
  max-width: 80% !important;
  align-items: center !important;
  justify-content: center !important;
  flex-direction: column !important;
  pointer-events: none !important;
  user-select: none !important;
  z-index: 0 !important;
  opacity: 0.042 !important;
  text-align: center !important;
  mix-blend-mode: multiply !important;
}

.jb-print-watermark-logo {
  width: 220px !important;
  height: 220px !important;
  object-fit: contain !important;
  filter: grayscale(100%) contrast(105%) !important;
  margin-bottom: 12px !important;
  pointer-events: none !important;
  user-select: none !important;
  mix-blend-mode: multiply !important;
}

.watermark-text-fa {
  font-size: 24pt !important;
  font-weight: 900 !important;
  color: #0f172a !important;
  letter-spacing: 1.5px !important;
  direction: rtl !important;
  text-align: center !important;
  line-height: 1.2 !important;
}

.watermark-text-sub {
  font-size: 12pt !important;
  font-weight: 800 !important;
  color: #334155 !important;
  letter-spacing: 3.5px !important;
  margin-top: 5px !important;
  text-align: center !important;
  direction: ltr !important;
}

.watermark-text-legal {
  font-size: 8.5pt !important;
  font-weight: 700 !important;
  color: #475569 !important;
  margin-top: 6px !important;
  direction: rtl !important;
}

body.hide-watermark .jb-print-watermark,
.hide-watermark .jb-print-watermark {
  display: none !important;
}

/* ==========================================================================
   4. Running Footer (.jb-print-footer & .simulated-page-footer)
   Official Company Address and Contact Information of 'Jahanban Creative House'
   ========================================================================== */
.jb-print-footer {
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  width: 100% !important;
  min-height: 12mm !important;
  box-sizing: border-box !important;
  border-top: 2px solid #0f172a !important;
  padding-top: 2.5mm !important;
  padding-bottom: 2.5mm !important;
  background: #ffffff !important;
  font-size: 8pt !important;
  line-height: 1.35 !important;
  color: #0f172a !important;
  direction: rtl !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  margin-top: 14px !important;
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif !important;
}

.jb-print-footer-top {
  display: flex !important;
  width: 100% !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-bottom: 1px solid #cbd5e1 !important;
  padding-bottom: 1.5mm !important;
  margin-bottom: 1.5mm !important;
}

.jb-print-footer-legal {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 7.5pt !important;
  color: #0f172a !important;
  font-weight: 600 !important;
}

.jb-print-footer-brand {
  font-weight: 800 !important;
  color: #0f172a !important;
}

.jb-print-footer-sep {
  color: #94a3b8 !important;
}

.jb-print-footer-law {
  color: #1e293b !important;
  font-weight: 600 !important;
}

.jb-print-footer-date {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  font-size: 7.5pt !important;
  color: #0f172a !important;
  font-weight: 600 !important;
}

.jb-print-footer-label {
  color: #334155 !important;
  font-weight: 700 !important;
}

.jb-print-footer-date-val {
  font-weight: 800 !important;
  color: #0f172a !important;
}

.jb-print-footer-meta {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.jb-print-pagination {
  display: inline-flex !important;
  align-items: center !important;
  gap: 2px !important;
  background: #f1f5f9 !important;
  border: 1px solid #475569 !important;
  border-radius: 4px !important;
  padding: 1.5px 6px !important;
  font-size: 7.5pt !important;
  font-weight: 800 !important;
  color: #0f172a !important;
}

.jb-print-ref {
  font-family: monospace, 'JetBrains Mono', Tahoma !important;
  font-weight: 800 !important;
  font-size: 7.5pt !important;
  color: #0f172a !important;
}

/* Official Address and Contact details row for Jahanban Creative House */
.jb-print-footer-contact-row {
  display: flex !important;
  width: 100% !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 6.8pt !important;
  color: #334155 !important;
  line-height: 1.3 !important;
}

.jb-print-footer-address {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  color: #1e293b !important;
}

.jb-print-footer-address-label {
  font-weight: 800 !important;
  color: #0f172a !important;
}

.jb-print-footer-contacts {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  color: #0f172a !important;
  font-weight: 700 !important;
}

/* Simulated Page Footer */
.simulated-page-footer {
  position: absolute !important;
  left: 16mm !important;
  right: 16mm !important;
  box-sizing: border-box !important;
  background: #ffffff !important;
  border-top: 1.5px solid #0f172a !important;
  padding: 5px 8px 3px 8px !important;
  z-index: 55 !important;
  display: flex !important;
  flex-direction: column !important;
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif !important;
  font-size: 7.5pt !important;
  color: #0f172a !important;
  direction: rtl !important;
  pointer-events: none !important;
  user-select: none !important;
}

/* ==========================================================================
   5. Dashboard Evaluation & Dossier View (#dashboard-tab / .print-document-sheet)
   ========================================================================== */
#dashboard-tab,
.print-document-sheet {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  background: #ffffff !important;
  color: #0f172a !important;
  padding: 0 !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  font-family: var(--font-sans), "Vazirmatn", "Shabnam", Tahoma, sans-serif !important;
  font-feature-settings: "liga" 1, "calt" 1 !important;
}

/* Light background override for dark elements */
#dashboard-tab .bg-slate-900,
#dashboard-tab .bg-slate-950,
#dashboard-tab [class*="bg-slate-"],
.print-document-sheet .bg-slate-900,
.print-document-sheet .bg-slate-950,
.print-document-sheet [class*="bg-slate-"] {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #0f172a !important;
  box-shadow: none !important;
}

#dashboard-tab .text-white,
#dashboard-tab .text-slate-100,
#dashboard-tab .text-slate-200,
#dashboard-tab .text-slate-300,
.print-document-sheet .text-white,
.print-document-sheet .text-slate-100,
.print-document-sheet .text-slate-200,
.print-document-sheet .text-slate-300 {
  color: #0f172a !important;
}

#dashboard-tab .text-slate-400,
#dashboard-tab .text-slate-500,
.print-document-sheet .text-slate-400,
.print-document-sheet .text-slate-500 {
  color: #475569 !important;
}

/* Applicant Dossier Box */
#jb-print-candidate-profile {
  display: block !important;
  background: #f8fafc !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  margin-bottom: 14px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* 4-Card Evaluation Grid */
#dashboard-evaluation-cards-section,
#dashboard-evaluation-cards {
  display: block !important;
  margin-bottom: 16px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

#dashboard-evaluation-cards-section .grid,
#dashboard-evaluation-cards {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 12px !important;
}

#dashboard-evaluation-cards-section .grid > div,
#dashboard-evaluation-cards > div {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Competency Radar & Match Insights Card */
#dashboard-radar-card {
  display: block !important;
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 8px !important;
  padding: 16px 20px !important;
  margin-bottom: 16px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Multi-Page AI Evaluation Report Card */
#dashboard-ai-report-card,
.ai-report-content,
.report-page-container {
  display: block !important;
  background: #ffffff !important;
  border: 1.5px solid #1e3a8a !important;
  border-radius: 8px !important;
  padding: 14px 20px !important;
  margin-bottom: 14px !important;
  page-break-inside: auto !important;
  break-inside: auto !important;
  max-height: none !important;
  overflow: visible !important;
  height: auto !important;
}

/* Typography & Markdown Structure */
#dashboard-tab h1, #dashboard-tab h2, #dashboard-tab h3, #dashboard-tab h4,
.ai-report-content h1, .ai-report-content h2, .ai-report-content h3, .ai-report-content h4 {
  color: #1e3a8a !important;
  font-weight: 800 !important;
  page-break-after: avoid !important;
  break-after: avoid !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

#dashboard-tab h1, .ai-report-content h1 {
  font-size: 13.5pt !important;
  border-bottom: 2px solid #0f172a !important;
  padding-bottom: 4px !important;
  margin-top: 14px !important;
  margin-bottom: 8px !important;
}

#dashboard-tab h2, .ai-report-content h2 {
  font-size: 12pt !important;
  border-bottom: 1.5px solid #cbd5e1 !important;
  padding-bottom: 3px !important;
  margin-top: 12px !important;
  margin-bottom: 6px !important;
}

#dashboard-tab h3, .ai-report-content h3 {
  font-size: 10.5pt !important;
  margin-top: 10px !important;
  margin-bottom: 4px !important;
}

#dashboard-tab p, .ai-report-content p, .report-page-container p {
  font-size: 10.5pt !important;
  line-height: 1.75 !important;
  color: #0f172a !important;
  text-align: justify !important;
  margin: 0 0 8px 0 !important;
  padding: 0 !important;
  orphans: 3 !important;
  widows: 3 !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

#dashboard-tab ul, #dashboard-tab ol,
.ai-report-content ul, .ai-report-content ol {
  padding-right: 18px !important;
  padding-left: 0 !important;
  margin-top: 4px !important;
  margin-bottom: 6px !important;
}

#dashboard-tab li, .ai-report-content li {
  font-size: 10pt !important;
  line-height: 1.7 !important;
  color: #0f172a !important;
  margin-bottom: 4px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  orphans: 2 !important;
  widows: 2 !important;
}

/* Tables in Print */
#dashboard-tab table, .ai-report-content table, .report-page-container table {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 12px 0 !important;
  font-size: 9.5pt !important;
  color: #0f172a !important;
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif !important;
  page-break-inside: auto !important;
  break-inside: auto !important;
}

#dashboard-tab table thead, .ai-report-content table thead {
  display: table-header-group !important;
  page-break-after: avoid !important;
  break-after: avoid !important;
}

#dashboard-tab table tr, .ai-report-content table tr, .report-page-container table tr {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

#dashboard-tab table th, #dashboard-tab table td,
.ai-report-content table th, .ai-report-content table td {
  border: 1px solid #475569 !important;
  padding: 8px 10px !important;
  text-align: right !important;
  box-sizing: border-box !important;
}

#dashboard-tab table th, .ai-report-content table th {
  background-color: #0f172a !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  border: 1.5px solid #334155 !important;
}

#dashboard-tab table td, .ai-report-content table td {
  color: #0f172a !important;
  font-weight: 600 !important;
  line-height: 1.55 !important;
}

#dashboard-tab table tr:nth-child(even) td, .ai-report-content table tr:nth-child(even) td {
  background-color: #f8fafc !important;
}

/* Blockquotes & Callout Highlights */
#dashboard-tab blockquote,
.ai-report-content blockquote,
.ai-report-content > div[style*="border-right"] {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  padding: 10px 14px !important;
  margin: 10px 0 !important;
  border-radius: 4px !important;
  background-color: #eff6ff !important;
  border-right: 4.5px solid #2563eb !important;
  font-size: 10pt !important;
  line-height: 1.7 !important;
  color: #0f172a !important;
  font-weight: 500 !important;
}

/* Preformatted and Code Blocks */
#dashboard-tab pre, .ai-report-content pre {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  padding: 8px 10px !important;
  margin: 8px 0 !important;
  font-size: 7.5pt !important;
  line-height: 1.5 !important;
  border-radius: 6px !important;
  background-color: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
}

/* Avoid page breaks inside cards */
.print-break-inside-avoid,
.break-inside-avoid {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}
`;

/**
 * Dynamically scans the document's stylesheets and unwraps any media print blocks
 * so that html2canvas can evaluate them in an iframe screen context.
 */
export function extractAndUnwrapPrintStyles(): string {
  let unwrappedCss = "";
  if (typeof document === "undefined") return unwrappedCss;

  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;

        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule instanceof CSSMediaRule && rule.conditionText.includes("print")) {
            for (let k = 0; k < rule.cssRules.length; k++) {
              unwrappedCss += rule.cssRules[k].cssText + "\n";
            }
          } else if (
            rule.cssText &&
            (rule.cssText.includes("simulate-print-mode") ||
             rule.cssText.includes("print-document-sheet") ||
             rule.cssText.includes("jb-print-"))
          ) {
            unwrappedCss += rule.cssText + "\n";
          }
        }
      } catch {
        // Cross-origin stylesheet access restriction - ignored
      }
    }
  } catch (err) {
    console.warn("Notice: Could not inspect some document stylesheets:", err);
  }

  return unwrappedCss;
}

/**
 * Returns the complete combined print stylesheet with highest priority.
 */
export function getFullDocumentPrintStyles(): string {
  const dynamicRules = extractAndUnwrapPrintStyles();
  return `
    <style id="official-index-css-print-styles">
      ${INDEX_CSS_PRINT_STYLES}
      ${dynamicRules}
    </style>
  `;
}
