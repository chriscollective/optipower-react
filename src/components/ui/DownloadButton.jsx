// PDF 下載按鈕：抓 #pdf-page-one + #pdf-page-two，各自截圖各一頁
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 12;
const DRAWABLE_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const DRAWABLE_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SCALE = 2; // html2canvas 解析度倍數
const PDF_PAGE_IDS = ['pdf-page-one', 'pdf-page-two'];

async function captureElementAsImage(element) {
  const canvas = await html2canvas(element, {
    scale: SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    onclone: (clonedDoc) => {
      // 移除全站 stylesheet 避免 Tailwind v4 oklab/oklch 進入 html2canvas 解析器
      // 我們的 PDF 元件全部用 inline style + rgb()，移掉外部 css 反而更乾淨
      const sheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
      sheets.forEach((s) => s.remove());

      // 把 hidden wrapper 從 -99999px 拉回畫面內，否則 html2canvas 抓不到內容
      const wrap = clonedDoc.getElementById('pdf-report-root');
      if (wrap) {
        wrap.style.position = 'static';
        wrap.style.left = 'auto';
        wrap.style.top = 'auto';
      }
    },
  });
  return canvas.toDataURL('image/jpeg', 0.95);
}

export function DownloadButton({ onDownload }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const today = new Date();
      const fileDateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

      const pdf = new jsPDF('p', 'mm', 'a4');

      for (let i = 0; i < PDF_PAGE_IDS.length; i++) {
        const el = document.getElementById(PDF_PAGE_IDS[i]);
        if (!el) {
          throw new Error(`找不到 #${PDF_PAGE_IDS[i]}，PDF 元件可能尚未掛載`);
        }

        const imgData = await captureElementAsImage(el);

        // 計算縮放：以寬度為準，等比例縮放
        const elWidthPx = el.offsetWidth;
        const elHeightPx = el.offsetHeight;
        const aspectRatio = elHeightPx / elWidthPx;
        const renderWidth = DRAWABLE_WIDTH_MM;
        const renderHeight = renderWidth * aspectRatio;

        // 高度若超過可繪區，等比例縮小
        const finalHeight = Math.min(renderHeight, DRAWABLE_HEIGHT_MM);
        const finalWidth = finalHeight === renderHeight ? renderWidth : finalHeight / aspectRatio;
        const xOffset = MARGIN_MM + (DRAWABLE_WIDTH_MM - finalWidth) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          'JPEG',
          xOffset,
          MARGIN_MM,
          finalWidth,
          finalHeight,
          undefined,
          'FAST'
        );
      }

      pdf.save(`OptiPower_契約容量最佳化報告_${fileDateStr}.pdf`);
      onDownload?.();
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
