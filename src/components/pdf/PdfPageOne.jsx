// PDF 第 1 頁：摘要頁
// 全部用 inline style + rgb() 色彩，避免 html2canvas 對 Tailwind v4 的 oklab/oklch 解析問題
import { PdfFeeChart } from './PdfFeeChart';

const STYLES = {
  page: {
    width: '794px',
    minHeight: '1100px',
    padding: '48px 56px',
    boxSizing: 'border-box',
    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    color: 'rgb(15, 23, 42)',
  },
  header: {
    borderBottom: '2px solid rgb(15, 23, 42)',
    paddingBottom: '16px',
    marginBottom: '32px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgb(71, 85, 105)',
    margin: '0',
  },
  sectionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgb(71, 85, 105)',
    margin: '0 0 12px 0',
    paddingLeft: '12px',
    borderLeft: '4px solid rgb(59, 130, 246)',
    lineHeight: '1.4',
  },
  hero: {
    backgroundColor: 'rgb(240, 253, 244)',
    border: '1.5px solid rgb(34, 197, 94)',
    borderRadius: '12px',
    padding: '28px 24px',
    textAlign: 'center',
    marginBottom: '32px',
  },
  heroLabel: {
    fontSize: '14px',
    color: 'rgb(22, 101, 52)',
    fontWeight: '500',
    margin: '0 0 8px 0',
  },
  heroAmount: {
    fontSize: '42px',
    fontWeight: '700',
    color: 'rgb(21, 128, 61)',
    margin: '0 0 12px 0',
    lineHeight: '1.1',
  },
  heroMeta: {
    fontSize: '13px',
    color: 'rgb(15, 118, 70)',
    margin: '4px 0',
  },
  compareRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '32px',
  },
  compareCard: {
    flex: '1',
    border: '1px solid rgb(226, 232, 240)',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'rgb(248, 250, 252)',
  },
  compareCardOptimal: {
    flex: '1',
    border: '1.5px solid rgb(59, 130, 246)',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'rgb(239, 246, 255)',
  },
  compareTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgb(71, 85, 105)',
    margin: '0 0 16px 0',
    textTransform: 'none',
  },
  compareTitleOptimal: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgb(29, 78, 216)',
    margin: '0 0 16px 0',
  },
  compareLabel: {
    fontSize: '12px',
    color: 'rgb(100, 116, 139)',
    margin: '12px 0 4px 0',
  },
  compareCapacity: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'rgb(15, 23, 42)',
    margin: '0',
    lineHeight: '1.2',
  },
  compareFee: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'rgb(15, 23, 42)',
    margin: '0',
    lineHeight: '1.2',
  },
  chartWrap: {
    border: '1px solid rgb(226, 232, 240)',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: 'rgb(255, 255, 255)',
    marginBottom: '24px',
  },
  footnote: {
    borderTop: '1px solid rgb(226, 232, 240)',
    paddingTop: '12px',
    fontSize: '11px',
    color: 'rgb(100, 116, 139)',
    lineHeight: '1.6',
  },
  pageNumber: {
    textAlign: 'center',
    fontSize: '10px',
    color: 'rgb(148, 163, 184)',
    marginTop: '8px',
  },
};

const formatNTD = (value) => `NT$ ${Math.round(value).toLocaleString('zh-TW')} 元`;

export function PdfPageOne({ results, dateLabel }) {
  if (!results) return null;

  return (
    <div id="pdf-page-one" style={STYLES.page}>
      <div style={STYLES.header}>
        <h1 style={STYLES.title}>OptiPower 契約容量最佳化分析報告</h1>
        <p style={STYLES.subtitle}>製作日期：{dateLabel}</p>
      </div>

      <h2 style={STYLES.sectionLabel}>電費節省評估</h2>
      <div style={STYLES.hero}>
        <p style={STYLES.heroLabel}>每年可節省</p>
        <p style={STYLES.heroAmount}>{formatNTD(results.savings)}</p>
        <p style={STYLES.heroMeta}>平均每月省 {formatNTD(results.savings / 12)}</p>
        <p style={STYLES.heroMeta}>節省比例：{results.savingsRate.toFixed(1)} %</p>
      </div>

      <h2 style={STYLES.sectionLabel}>現況與建議對照</h2>
      <div style={STYLES.compareRow}>
        <div style={STYLES.compareCard}>
          <p style={STYLES.compareTitle}>目前狀況</p>
          <p style={STYLES.compareLabel}>契約容量</p>
          <p style={STYLES.compareCapacity}>{results.currentCapacity} kW</p>
          <p style={STYLES.compareLabel}>年度基本電費</p>
          <p style={STYLES.compareFee}>{formatNTD(results.currentFee)}</p>
        </div>
        <div style={STYLES.compareCardOptimal}>
          <p style={STYLES.compareTitleOptimal}>建議調整</p>
          <p style={STYLES.compareLabel}>契約容量</p>
          <p style={STYLES.compareCapacity}>{results.optimalCapacity} kW</p>
          <p style={STYLES.compareLabel}>年度基本電費</p>
          <p style={STYLES.compareFee}>{formatNTD(results.optimalFee)}</p>
        </div>
      </div>

      <h2 style={STYLES.sectionLabel}>不同契約容量的年度電費走勢</h2>
      <div style={STYLES.chartWrap}>
        <PdfFeeChart
          chartData={results.chartData}
          currentCapacity={results.currentCapacity}
          optimalCapacity={results.optimalCapacity}
        />
      </div>

      <div style={STYLES.footnote}>
        本計算依據台電「低壓電力 · 非時間電價」費率：非夏月 173.2 元/kW、夏月（6–9 月）236.2 元/kW；
        超約罰款 10% 以內 2 倍、10% 以上 3 倍。試算結果僅供參考，實際以台電帳單為準。
      </div>
      <div style={STYLES.pageNumber}>第 1 頁 / 共 2 頁 · OptiPower www.optipower.tw</div>
    </div>
  );
}

export default PdfPageOne;
