import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getFullDocumentPrintStyles } from "./printStylesCss";

export interface PdfExportOptions {
  margin?: number | [number, number, number, number] | [number, number];
  orientation?: "portrait" | "landscape";
  unit?: "mm" | "pt" | "in";
  scale?: number;
  onProgress?: (percent: number, statusText: string) => void;
}

/**
 * Cleanly and reliably exports an HTMLElement or HTML string to a high-resolution,
 * multi-page PDF file using an isolated iframe, html2canvas, and jsPDF.
 * Configured specifically for German DIN A4 standards with clean typography,
 * seamless text-aware page slicing, and zero corrupt characters in footers.
 * Enforces all print styles defined in src/index.css.
 */
export async function exportToPdfWithHtml2Pdf(
  source: HTMLElement | string,
  filename: string,
  options?: PdfExportOptions
): Promise<void> {
  const isLandscape = options?.orientation === "landscape";
  const safeFilename = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;

  // Standard A4 width in px at 96 DPI: Portrait = 794px, Landscape = 1123px
  const renderWidthPx = isLandscape ? 1123 : 794;

  const officialPrintStyles = getFullDocumentPrintStyles();

  const hideFooterStyle = `<style>
    body.simulate-print-mode .jb-print-footer,
    .jb-print-footer {
      display: none !important;
    }
  </style>`;

  let fullHtml = "";
  if (typeof source === "string") {
    if (source.includes("<html") || source.includes("<!DOCTYPE")) {
      // Inject official index.css print styles before </head>
      if (source.includes("</head>")) {
        fullHtml = source.replace("</head>", `${officialPrintStyles}${hideFooterStyle}</head>`);
      } else {
        fullHtml = `${officialPrintStyles}${hideFooterStyle}${source}`;
      }
    } else {
      fullHtml = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap">
  ${officialPrintStyles}
  ${hideFooterStyle}
  <style>
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      direction: rtl;
      box-sizing: border-box;
      font-size: 10.5pt;
      line-height: 1.7;
    }
  </style>
</head>
<body class="simulate-print-mode print-document-sheet print-margin-compact">
  ${source}
</body>
</html>`;
    }
  } else {
    // source is an HTMLElement
    const headStyles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((el) => el.outerHTML)
      .join("\n");
    const dir = source.getAttribute("dir") || document.documentElement.getAttribute("dir") || "rtl";
    const lang = source.getAttribute("lang") || document.documentElement.getAttribute("lang") || "fa";

    fullHtml = `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap">
  ${headStyles}
  ${officialPrintStyles}
  ${hideFooterStyle}
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      box-sizing: border-box;
      font-size: 10.5pt;
      line-height: 1.7;
    }
  </style>
</head>
<body class="simulate-print-mode print-document-sheet print-margin-compact">
  ${source.outerHTML}
</body>
</html>`;
  }

  options?.onProgress?.(15, "در حال ایجاد محیط رندرینگ ایزوله...");

  // Create an isolated hidden rendering iframe to prevent any main-window scroll or CSS interference
  const iframe = document.createElement("iframe");
  iframe.id = "pdf-render-engine-iframe";
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.width = `${renderWidthPx}px`;
  iframe.style.height = "4000px";
  iframe.style.border = "none";
  iframe.style.margin = "0";
  iframe.style.padding = "0";
  iframe.style.opacity = "1";
  iframe.style.visibility = "hidden";
  iframe.style.zIndex = "-9999";
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Could not initialize isolated rendering document for PDF generation");
    }

    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();

    options?.onProgress?.(30, "بارگذاری تایپوگرافی فارسی (وزیرمتن) و المان‌های گرافیکی...");

    // 1. Wait for web fonts
    if (iframeDoc.fonts) {
      try {
        await iframeDoc.fonts.load("bold 14px 'Vazirmatn'");
        await iframeDoc.fonts.load("14px 'Vazirmatn'");
        if (iframeDoc.fonts.ready) {
          await iframeDoc.fonts.ready;
        }
      } catch {
        // Continue if font readiness times out
      }
    }

    // 2. Wait for any embedded images (logos, stamps, watermarks)
    const images = Array.from(iframeDoc.images);
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );
    }

    // 3. Brief layout reflow tick
    await new Promise((resolve) => setTimeout(resolve, 250));

    // 4. Compute true natural document scroll height
    const bodyEl = iframeDoc.body;
    const docEl = iframeDoc.documentElement;
    const naturalHeight = Math.max(
      bodyEl.scrollHeight,
      bodyEl.offsetHeight,
      docEl.scrollHeight,
      docEl.offsetHeight,
      1123
    );

    // Ensure iframe height comfortably encloses the document content so html2canvas never clips
    iframe.style.height = `${naturalHeight + 120}px`;

    options?.onProgress?.(55, "تبدیل چیدمان سند به وکتور با کیفیت بالا (html2canvas)...");

    // 5. Render to high-resolution canvas with html2canvas
    const canvas = await html2canvas(bodyEl, {
      scale: options?.scale || 2, // 2 = 192 DPI crisp output
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: renderWidthPx,
      windowHeight: naturalHeight + 120
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas rendering produced an empty canvas");
    }

    options?.onProgress?.(75, "ایجاد فایل استاندارد PDF و قطعه‌بندی صفحات (jsPDF)...");

    // 6. Generate multi-page PDF with jsPDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: isLandscape ? "landscape" : "portrait",
      compress: true
    });

    // Set PDF document properties
    pdf.setProperties({
      title: safeFilename.replace(/\.pdf$/i, ""),
      subject: "Jahanban German Career & Immigration Document",
      author: "Jahanban Migration Group",
      keywords: "Germany, Lebenslauf, Roadmap, Immigration, Chancenkarte, DIN5008",
      creator: "Jahanban jsPDF & html2canvas Engine"
    });

    const pageWidthMm = isLandscape ? 297 : 210;
    const pageHeightMm = isLandscape ? 210 : 297;

    // Calibrated DIN A4 margins: Top: 8mm, Right: 6mm, Bottom: 12mm, Left: 6mm
    // Dedicated 12mm bottom clearance guarantees crisp running footer and roller safety
    let mTop = 8, mRight = 6, mBottom = 12, mLeft = 6;
    if (typeof options?.margin === "number") {
      mTop = mRight = mLeft = mBottom = options.margin;
    } else if (Array.isArray(options?.margin)) {
      if (options.margin.length === 4) {
        [mTop, mRight, mBottom, mLeft] = options.margin;
      } else if (options.margin.length === 2) {
        [mTop, mRight] = options.margin;
        mBottom = mTop;
        mLeft = mRight;
      }
    }

    const printWidthMm = pageWidthMm - mLeft - mRight;
    const printHeightMm = pageHeightMm - mTop - mBottom;

    // Scale ratio: Canvas pixels per printable millimeter
    const pxPerMm = canvas.width / printWidthMm;
    const standardPageCanvasHeight = Math.floor(printHeightMm * pxPerMm);

    // Reserve 12mm on canvas for clean running footer
    const footerZoneCanvasHeight = Math.floor(12 * pxPerMm);
    const contentPageCanvasHeight = standardPageCanvasHeight - footerZoneCanvasHeight;

    // 1. Collect Atomic Blocks from the rendered DOM that must NEVER be cut horizontally
    interface AtomicBlock {
      top: number;
      bottom: number;
      isHeading: boolean;
      isTableRow: boolean;
    }
    const atomicBlocks: AtomicBlock[] = [];

    // 2. Collect Individual Text Line Rectangles to prevent cutting glyphs in half
    interface TextLineRect {
      top: number;
      bottom: number;
    }
    const textLines: TextLineRect[] = [];

    try {
      const iframeScale = canvas.width / renderWidthPx;
      const iframeScrollY = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop || 0;

      // Detect table rows, headings, list items, quotes
      const atomicEls = iframeDoc.querySelectorAll(
        "tr, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, pre, #jb-print-candidate-profile, .jb-print-header, .jb-print-meta, [class*='print-break-inside-avoid'], [class*='break-inside-avoid']"
      );

      atomicEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Skip huge wrapper containers that span multiple pages
        if (rect.height > 0 && rect.height < standardPageCanvasHeight * 0.75) {
          const top = Math.floor((rect.top + iframeScrollY) * iframeScale);
          const bottom = Math.floor((rect.bottom + iframeScrollY) * iframeScale);
          const tag = el.tagName.toLowerCase();
          const isHeading = tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6";
          const isTableRow = tag === "tr";
          atomicBlocks.push({ top, bottom, isHeading, isTableRow });
        }
      });

      // Extract precise line-level bounding rects from text nodes
      const textContainers = iframeDoc.querySelectorAll("p, li, td, th, div, blockquote");
      textContainers.forEach((container) => {
        const walker = iframeDoc.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (!node.nodeValue || !node.nodeValue.trim()) continue;
          const range = iframeDoc.createRange();
          range.selectNodeContents(node);
          const clientRects = range.getClientRects();
          for (let k = 0; k < clientRects.length; k++) {
            const cr = clientRects[k];
            if (cr.height >= 4) {
              textLines.push({
                top: Math.floor((cr.top + iframeScrollY) * iframeScale),
                bottom: Math.floor((cr.bottom + iframeScrollY) * iframeScale)
              });
            }
          }
        }
      });
    } catch {
      // Non-critical layout inspection
    }

    // Sort atomic blocks and text lines by vertical position
    atomicBlocks.sort((a, b) => a.top - b.top);
    textLines.sort((a, b) => a.top - b.top);

    const totalCanvasHeight = canvas.height;

    // 3. Calculate all page slice boundaries upfront
    interface PageSlice {
      startY: number;
      height: number;
    }
    const slices: PageSlice[] = [];
    let currentY = 0;

    while (currentY < totalCanvasHeight) {
      const remainingHeight = totalCanvasHeight - currentY;
      if (remainingHeight <= 30 && slices.length > 0) {
        break;
      }

      let currentSliceHeight = Math.min(remainingHeight, contentPageCanvasHeight);

      // Smart page break detection if content extends beyond current page
      if (currentSliceHeight === contentPageCanvasHeight && currentY + currentSliceHeight < totalCanvasHeight) {
        const candidateBoundary = currentY + currentSliceHeight;
        let bestCutPoint = candidateBoundary;

        // A. Check atomic blocks (table rows, headings, cards)
        for (const block of atomicBlocks) {
          // If boundary cuts inside this atomic block
          if (block.top < candidateBoundary && block.bottom > candidateBoundary) {
            if (block.top - currentY >= contentPageCanvasHeight * 0.35) {
              bestCutPoint = Math.min(bestCutPoint, block.top - 4);
              break;
            }
          }

          // If a heading is placed too close to the page bottom (orphan heading prevention)
          if (block.isHeading && block.top < candidateBoundary && block.bottom + 75 > candidateBoundary) {
            if (block.top - currentY >= contentPageCanvasHeight * 0.3) {
              bestCutPoint = Math.min(bestCutPoint, block.top - 6);
              break;
            }
          }
        }

        // B. Check text lines: NEVER cut horizontally through letters/numbers
        for (const line of textLines) {
          // If candidate cut slices directly through this text line
          if (line.top - 2 < bestCutPoint && line.bottom + 2 > bestCutPoint) {
            // Cut in the whitespace gap above this line
            if (line.top - 4 - currentY >= contentPageCanvasHeight * 0.3) {
              bestCutPoint = line.top - 4;
              break;
            }
          }
        }

        currentSliceHeight = Math.max(Math.floor(contentPageCanvasHeight * 0.35), bestCutPoint - currentY);
      }

      slices.push({ startY: currentY, height: currentSliceHeight });
      currentY += currentSliceHeight;
    }

    const totalPages = slices.length;

    // 4. Render each page canvas with crisp Persian Vazirmatn typography and running footer
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const slice = slices[pageIndex];

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = standardPageCanvasHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        // Pure crisp white page background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw document slice content
        ctx.drawImage(
          canvas,
          0, slice.startY, canvas.width, slice.height,
          0, 0, canvas.width, slice.height
        );

        // ====================================================================
        // Official Persian Running Footer Stamped on Canvas with Vazirmatn Font
        // ====================================================================
        const footerDividerY = standardPageCanvasHeight - Math.floor(pxPerMm * 5.5);
        const footerTextY = standardPageCanvasHeight - Math.floor(pxPerMm * 1.8);

        // High-contrast thin navy divider line
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = Math.max(1, Math.round(pxPerMm * 0.25));
        ctx.beginPath();
        ctx.moveTo(14, footerDividerY);
        ctx.lineTo(canvas.width - 14, footerDividerY);
        ctx.stroke();

        // Footer typography in Persian Vazirmatn font
        const footerFontSize = Math.max(11, Math.round(pxPerMm * 2.8));
        ctx.font = `bold ${footerFontSize}px 'Vazirmatn', -apple-system, BlinkMacSystemFont, Tahoma, sans-serif`;
        ctx.fillStyle = "#0f172a";

        // Convert digits to Persian numerals
        const toPersianDigits = (num: number) => String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
        const curPageFa = toPersianDigits(pageIndex + 1);
        const totPagesFa = toPersianDigits(totalPages);

        // Right side: Official Company & Legal Reference (RTL)
        ctx.textAlign = "right";
        ctx.fillText(
          "گروه شرکت‌های جهانبان  •  استناد قانونی: قانون مهاجرت نیروی متخصص آلمان (FEG 2026)",
          canvas.width - 18,
          footerTextY
        );

        // Left side: Persian Page Numbering
        ctx.textAlign = "left";
        ctx.fillText(
          `صفحه ${curPageFa} از ${totPagesFa}`,
          18,
          footerTextY
        );
      }

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);

      if (pageIndex > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "JPEG",
        mLeft,
        mTop,
        printWidthMm,
        printHeightMm,
        undefined,
        "FAST"
      );
    }

    pdf.save(safeFilename);
  } finally {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }
}

/**
 * Convenience helper to export any live DOM HTMLElement to a PDF file.
 */
export async function exportHtmlElementToPdf(
  element: HTMLElement,
  filename: string,
  options?: PdfExportOptions
): Promise<void> {
  return exportToPdfWithHtml2Pdf(element, filename, options);
}
