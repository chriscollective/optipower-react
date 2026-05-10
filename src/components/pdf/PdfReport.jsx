// PDF 報表包裝：兩頁版面，offscreen 隱藏渲染
// DownloadButton 觸發時才會被 html2canvas 抓兩頁分別截圖
import { PdfPageOne } from './PdfPageOne';
import { PdfPageTwo } from './PdfPageTwo';

const HIDDEN_WRAP = {
  position: 'absolute',
  left: '-99999px',
  top: '0',
  pointerEvents: 'none',
};

export function PdfReport({ results, dateLabel }) {
  if (!results) return null;
  return (
    <div id="pdf-report-root" style={HIDDEN_WRAP} aria-hidden="true">
      <PdfPageOne results={results} dateLabel={dateLabel} />
      <PdfPageTwo results={results} dateLabel={dateLabel} />
    </div>
  );
}

export default PdfReport;
