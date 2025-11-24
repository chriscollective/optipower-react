// PDF 下載按鈕元件
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PDF_FONT_SCALE = 1.15;
const PDF_SPACING_SCALE = 0.05;
const PDF_PAGE_WIDTH = 210; // A4 width (mm)
const PDF_PAGE_HEIGHT = 297; // A4 height (mm)
const PDF_PAGE_MARGIN = 12; // 左右上下預留些空間
const PDF_SECTION_PADDING = 16; // 每個區塊上下額外空白 (px)
const PDF_IMAGE_TYPE = 'JPEG';
const PDF_IMAGE_QUALITY = 1.2;

export function DownloadButton({ targetId }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const today = new Date();
      const fileDateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      const displayDateStr = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`;
      const sectionMeta = [];
      let headerHeightPx = 0;
      let clonedHeight = 1;

      // 取得要截圖的元素
      const element = document.getElementById(targetId);
      if (!element) {
        alert('找不到要下載的內容');
        setIsGenerating(false);
        return;
      }

      // 使用 html2canvas 將元素轉換為圖片
      const canvas = await html2canvas(element, {
        scale: 2, // 解析度
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        // 在克隆後處理色彩轉換
        onclone: (clonedDoc) => {
          // 移除所有樣式表，避免 oklab/oklch 解析錯誤
          const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styleSheets.forEach((sheet) => sheet.remove());

          const ensureOptimizationStyle = () => {
            if (clonedDoc.getElementById('pdf-optimization-style')) return;
            const styleEl = clonedDoc.createElement('style');
            styleEl.id = 'pdf-optimization-style';
            styleEl.textContent = `
              body {
                background: #ffffff !important;
              }
              body::before {
                display: none !important;
              }

              [data-pdf-section="optimization"],
              [data-pdf-section="optimization"] * {
                border: none !important;
                border-color: transparent !important;
                box-shadow: none !important;
                outline: none !important;
              }
            `;
            clonedDoc.head.appendChild(styleEl);
          };

          ensureOptimizationStyle();

          // 為克隆文檔中的所有元素應用內聯計算樣式
          const applyComputedStyles = (clonedEl, sourceEl) => {
            if (clonedEl.nodeType !== 1) return; // 只處理元素節點

            const computedStyle = window.getComputedStyle(sourceEl);
            const importantProps = [
              'color',
              'backgroundColor',
              'borderColor',
              'borderTopColor',
              'borderRightColor',
              'borderBottomColor',
              'borderLeftColor',
              'borderWidth',
              'borderTopWidth',
              'borderRightWidth',
              'borderBottomWidth',
              'borderLeftWidth',
              'borderStyle',
              'borderRadius',
              'padding',
              'paddingTop',
              'paddingRight',
              'paddingBottom',
              'paddingLeft',
              'margin',
              'marginTop',
              'marginRight',
              'marginBottom',
              'marginLeft',
              'fontSize',
              'fontWeight',
              'fontFamily',
              'lineHeight',
              'textAlign',
              'display',
              'flexDirection',
              'justifyContent',
              'alignItems',
              'gap',
              'width',
              'height',
              'maxWidth',
              'minWidth',
              'position',
              'top',
              'right',
              'bottom',
              'left',
              'boxShadow',
              'opacity',
              'overflow',
              'textDecoration',
              'gridTemplateColumns',
              'gridTemplateRows',
            ];

            importantProps.forEach((prop) => {
              const cssName = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
              let value = computedStyle.getPropertyValue(cssName);

              // 轉換現代色彩函數為 RGB
              if (
                value &&
                (value.includes('oklab') || value.includes('oklch') || value.includes('color('))
              ) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 1;
                tempCanvas.height = 1;
                const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
                ctx.fillStyle = value;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
                value =
                  a < 255
                    ? `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
                    : `rgb(${r}, ${g}, ${b})`;
              }

              if (value) {
                clonedEl.style[prop] = value;
              }
            });

            // 處理背景圖片（漸層）
            const bgImage = computedStyle.getPropertyValue('background-image');
            if (bgImage && bgImage !== 'none') {
              if (bgImage.includes('oklab') || bgImage.includes('oklch')) {
                clonedEl.style.backgroundImage = 'none';
              } else {
                clonedEl.style.backgroundImage = bgImage;
              }
            }

            // 遞迴處理子元素
            const clonedChildren = Array.from(clonedEl.children);
            const sourceChildren = Array.from(sourceEl.children);
            clonedChildren.forEach((child, index) => {
              if (sourceChildren[index]) {
                applyComputedStyles(child, sourceChildren[index]);
              }
            });
          };

          const clonedElement = clonedDoc.getElementById(targetId);
          if (clonedElement) {
            // 設定 PDF 專用樣式
            clonedElement.style.padding = '4px';
            clonedElement.style.maxWidth = '75%';
            clonedElement.style.width = '75%';
            clonedElement.style.margin = '0 auto';
            clonedElement.style.boxSizing = 'border-box';
            clonedElement.style.backgroundColor = '#ffffff';

            applyComputedStyles(clonedElement, element);

            // 將 PDF 專用標題插入最前方
            if (!clonedElement.querySelector('[data-pdf-generated-header]')) {
              const header = clonedDoc.createElement('div');
              header.setAttribute('data-pdf-generated-header', 'true');
              header.style.textAlign = 'center';
              header.style.marginBottom = '24px';
              header.style.padding = '16px 0';
              header.style.borderBottom = '1px solid #e5e7eb';
              header.style.backgroundColor = '#ffffff';
              header.style.color = '#0f172a';
              header.style.fontFamily = 'sans-serif';

              const title = clonedDoc.createElement('p');
              title.textContent = '契約容量最佳化報告書';
              title.style.fontSize = '26px';
              title.style.fontWeight = '700';
              title.style.margin = '0 0 8px 0';

              const subtitle = clonedDoc.createElement('p');
              subtitle.textContent = `製作日期：${displayDateStr}`;
              subtitle.style.fontSize = '14px';
              subtitle.style.margin = '0';
              subtitle.style.color = '#475569';

              header.appendChild(title);
              header.appendChild(subtitle);

              clonedElement.insertBefore(header, clonedElement.firstChild);

              const headerRect = header.getBoundingClientRect();
              headerHeightPx = headerRect.height + PDF_SECTION_PADDING;
            }

            // 調整字體與間距，放大 PDF 呈現
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const computedStyle = window.getComputedStyle(el);

              // 放大字體
              const fontSize = parseFloat(computedStyle.fontSize);
              if (!Number.isNaN(fontSize) && fontSize) {
                el.style.fontSize = `${fontSize * PDF_FONT_SCALE}px`;
              }

              const lineHeight = parseFloat(computedStyle.lineHeight);
              if (!Number.isNaN(lineHeight) && lineHeight) {
                el.style.lineHeight = `${lineHeight * PDF_FONT_SCALE}px`;
              }

              // 依比例縮小 padding，降低邊界
              const paddingTop = parseFloat(computedStyle.paddingTop);
              const paddingRight = parseFloat(computedStyle.paddingRight);
              const paddingBottom = parseFloat(computedStyle.paddingBottom);
              const paddingLeft = parseFloat(computedStyle.paddingLeft);
              if (
                ![paddingTop, paddingRight, paddingBottom, paddingLeft].every(
                  (value) => Number.isNaN(value) || value === 0
                )
              ) {
                el.style.padding = `${(paddingTop || 0) * PDF_SPACING_SCALE}px ${(paddingRight || 0) * PDF_SPACING_SCALE}px ${(paddingBottom || 0) * PDF_SPACING_SCALE}px ${(paddingLeft || 0) * PDF_SPACING_SCALE}px`;
              }

              // 依比例縮小 margin
              const marginTop = parseFloat(computedStyle.marginTop);
              const marginRight = parseFloat(computedStyle.marginRight);
              const marginBottom = parseFloat(computedStyle.marginBottom);
              const marginLeft = parseFloat(computedStyle.marginLeft);
              if (
                ![marginTop, marginRight, marginBottom, marginLeft].every(
                  (value) => Number.isNaN(value) || value === 0
                )
              ) {
                el.style.margin = `${(marginTop || 0) * PDF_SPACING_SCALE}px ${(marginRight || 0) * PDF_SPACING_SCALE}px ${(marginBottom || 0) * PDF_SPACING_SCALE}px ${(marginLeft || 0) * PDF_SPACING_SCALE}px`;
              }

              // 依比例縮小 gap
              const gap = parseFloat(computedStyle.gap);
              if (!Number.isNaN(gap) && gap) {
                el.style.gap = `${gap * PDF_SPACING_SCALE}px`;
              }

              // 依比例縮小 border-radius
              const borderRadius = parseFloat(computedStyle.borderRadius);
              if (!Number.isNaN(borderRadius) && borderRadius) {
                el.style.borderRadius = `${borderRadius * PDF_SPACING_SCALE}px`;
              }
            });

            // 為平均節省文字額外增加與上方數字的間距
            const monthlySpacingEls = clonedElement.querySelectorAll(
              '[data-pdf-spacing=\"monthly-savings\"]'
            );
            monthlySpacingEls.forEach((el) => {
              el.style.marginTop = '24px';
              el.style.display = 'block';
            });

            const parentRect = clonedElement.getBoundingClientRect();
            clonedHeight = parentRect.height || 1;
            const pdfSections = clonedElement.querySelectorAll('[data-pdf-section]');
            sectionMeta.length = 0;

            if (pdfSections.length === 0) {
              sectionMeta.push({ start: 0, height: clonedHeight });
            } else {
              pdfSections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const relativeTop = Math.max(0, rect.top - parentRect.top - PDF_SECTION_PADDING);
                const paddedHeight = rect.height + PDF_SECTION_PADDING * 2;
                sectionMeta.push({
                  start: relativeTop,
                  height: Math.min(paddedHeight, clonedHeight - relativeTop),
                });
              });
            }

            if (headerHeightPx > 0) {
              sectionMeta.unshift({
                start: 0,
                height: Math.min(headerHeightPx, clonedHeight),
              });
            }
          }
        },
      });

      // 計算 PDF 尺寸，保留頁面邊距
      const drawableWidth = PDF_PAGE_WIDTH - PDF_PAGE_MARGIN * 2;
      const drawableHeight = PDF_PAGE_HEIGHT - PDF_PAGE_MARGIN * 2;
      const pxToMm = drawableWidth / canvas.width;
      const pagePixelCapacity = drawableHeight / pxToMm;
      const pxScale = canvas.height / clonedHeight;

      const scaledSections =
        sectionMeta.length > 0
          ? sectionMeta.map((section) => {
              const startPx = Math.max(0, section.start * pxScale);
              const heightPx = Math.max(1, section.height * pxScale);
              return { startPx, heightPx, endPx: startPx + heightPx };
            })
          : [{ startPx: 0, heightPx: canvas.height, endPx: canvas.height }];

      const pages = [];
      let currentStart = scaledSections[0]?.startPx ?? 0;
      let currentEnd = currentStart;

      const flushPage = () => {
        if (currentEnd > currentStart) {
          pages.push({ startPx: currentStart, heightPx: currentEnd - currentStart });
        }
      };

      scaledSections.forEach((section) => {
        const { startPx, endPx, heightPx } = section;

        // 若單一區塊就超出一頁，拆成多個連續片段
        if (heightPx >= pagePixelCapacity) {
          flushPage();
          let chunkStart = startPx;
          let remaining = heightPx;
          while (remaining > 0) {
            const chunkHeight = Math.min(pagePixelCapacity, remaining);
            pages.push({ startPx: chunkStart, heightPx: chunkHeight });
            chunkStart += chunkHeight;
            remaining -= chunkHeight;
          }
          currentStart = endPx;
          currentEnd = currentStart;
          return;
        }

        if (currentEnd === currentStart) {
          currentStart = startPx;
          currentEnd = endPx;
          return;
        }

        if (endPx - currentStart > pagePixelCapacity) {
          flushPage();
          currentStart = startPx;
          currentEnd = endPx;
        } else {
          currentEnd = Math.max(currentEnd, endPx);
        }
      });

      flushPage();

      if (pages.length === 0) {
        pages.push({ startPx: 0, heightPx: canvas.height });
      }

      // 建立 PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      pages.forEach((page, index) => {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        const clippedHeight = Math.max(1, Math.min(page.heightPx, canvas.height - page.startPx));
        pageCanvas.height = clippedHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          page.startPx,
          canvas.width,
          clippedHeight,
          0,
          0,
          canvas.width,
          clippedHeight
        );

        const imgData = pageCanvas.toDataURL(
          `image/${PDF_IMAGE_TYPE.toLowerCase()}`,
          PDF_IMAGE_QUALITY
        );
        const renderHeight = (clippedHeight * drawableWidth) / canvas.width;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          PDF_IMAGE_TYPE,
          PDF_PAGE_MARGIN,
          PDF_PAGE_MARGIN,
          drawableWidth,
          renderHeight,
          undefined,
          'FAST'
        );
      });

      // 下載 PDF
      pdf.save(`OptiPower_契約容量最佳化報告_${fileDateStr}.pdf`);
    } catch (error) {
      console.error('PDF 生成失敗:', error);
      alert('PDF 生成失敗，請稍後再試');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-5 py-3
        bg-gradient-to-r from-blue-500 to-blue-600
        hover:from-blue-600 hover:to-blue-700
        text-white font-semibold
        rounded-full
        shadow-lg shadow-blue-500/30
        hover:shadow-xl hover:shadow-blue-500/40
        transform hover:-translate-y-0.5
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:transform-none
      `}
      title="下載 PDF 報告"
    >
      {isGenerating ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>生成中...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>下載報告</span>
        </>
      )}
    </button>
  );
}

export default DownloadButton;
