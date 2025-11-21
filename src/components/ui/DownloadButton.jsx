// PDF 下載按鈕元件
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function DownloadButton({ targetId }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // 取得要截圖的元素
      const element = document.getElementById(targetId);
      if (!element) {
        alert('找不到要下載的內容');
        setIsGenerating(false);
        return;
      }

      // 使用 html2canvas 將元素轉換為圖片
      const canvas = await html2canvas(element, {
        scale: 2, // 提高解析度
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        // 在克隆後處理色彩轉換
        onclone: (clonedDoc) => {
          // 移除所有樣式表，避免 oklab/oklch 解析錯誤
          const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styleSheets.forEach(sheet => sheet.remove());

          // 為克隆文檔中的所有元素應用內聯計算樣式
          const applyComputedStyles = (clonedEl, sourceEl) => {
            if (clonedEl.nodeType !== 1) return; // 只處理元素節點

            const computedStyle = window.getComputedStyle(sourceEl);
            const importantProps = [
              'color', 'backgroundColor', 'borderColor',
              'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
              'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
              'borderStyle', 'borderRadius',
              'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
              'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
              'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'textAlign',
              'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
              'width', 'height', 'maxWidth', 'minWidth',
              'position', 'top', 'right', 'bottom', 'left',
              'boxShadow', 'opacity', 'overflow', 'textDecoration',
              'gridTemplateColumns', 'gridTemplateRows'
            ];

            importantProps.forEach(prop => {
              const cssName = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
              let value = computedStyle.getPropertyValue(cssName);

              // 轉換現代色彩函數為 RGB
              if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('color('))) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 1;
                tempCanvas.height = 1;
                const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
                ctx.fillStyle = value;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
                value = a < 255 ? `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
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
            clonedElement.style.padding = '20px';
            clonedElement.style.maxWidth = '100%';
            clonedElement.style.boxSizing = 'border-box';

            applyComputedStyles(clonedElement, element);

            // 調整表格樣式以適應 PDF - 縮小至少兩倍
            const tables = clonedElement.querySelectorAll('table');
            tables.forEach(table => {
              table.style.width = '100%';
              table.style.tableLayout = 'fixed';
              table.style.borderCollapse = 'collapse';
              table.style.fontSize = '8px';
            });

            // 調整表格儲存格內間距
            const cells = clonedElement.querySelectorAll('th, td');
            cells.forEach(cell => {
              cell.style.padding = '2px 1px';
              cell.style.fontSize = '8px';
              cell.style.wordBreak = 'break-word';
            });

            // 縮小表格容器的圓角和間距
            const tableContainers = clonedElement.querySelectorAll('.overflow-x-auto');
            tableContainers.forEach(container => {
              container.style.borderRadius = '4px';
            });

            // 調整卡片間距
            const cards = clonedElement.querySelectorAll('[class*="mb-6"]');
            cards.forEach(card => {
              card.style.marginBottom = '16px';
            });

            // 調整 grid 佈局
            const grids = clonedElement.querySelectorAll('[class*="grid"]');
            grids.forEach(grid => {
              grid.style.gap = '8px';
            });
          }
        },
      });

      // 計算 PDF 尺寸
      const imgWidth = 210; // A4 寬度 (mm)
      const pageHeight = 297; // A4 高度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // 建立 PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // 將圖片加入 PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果內容超過一頁，新增更多頁面
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 下載 PDF
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      pdf.save(`OptiPower_契約容量最佳化報告_${dateStr}.pdf`);
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
