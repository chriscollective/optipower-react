// PDF 第 2 頁：12 個月「目前 vs 建議」逐月對照表（7 欄、雙列表頭）
// 把基本電費與罰款拆開顯示，讓使用者能看到「某幾個月被罰也仍划算」的真相
import { MONTH_NAMES } from '../../utils/constants';

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
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '12px',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    marginBottom: '20px',
  },
  thGroup: {
    backgroundColor: 'rgb(226, 232, 240)',
    color: 'rgb(15, 23, 42)',
    fontWeight: '700',
    padding: '8px 6px',
    textAlign: 'center',
    borderTop: '1px solid rgb(15, 23, 42)',
    borderBottom: '1px solid rgb(148, 163, 184)',
  },
  thGroupCurrent: {
    borderRight: '2px solid rgb(148, 163, 184)',
  },
  thGroupOptimal: {
    borderRight: '2px solid rgb(148, 163, 184)',
  },
  thLeaf: {
    backgroundColor: 'rgb(241, 245, 249)',
    color: 'rgb(15, 23, 42)',
    fontWeight: '600',
    padding: '8px 6px',
    textAlign: 'right',
    borderBottom: '2px solid rgb(15, 23, 42)',
  },
  thLeafLeft: {
    textAlign: 'left',
  },
  thLeafCenter: {
    textAlign: 'center',
  },
  td: {
    padding: '7px 6px',
    textAlign: 'right',
    borderBottom: '1px solid rgb(226, 232, 240)',
    color: 'rgb(15, 23, 42)',
  },
  tdLeft: {
    textAlign: 'left',
  },
  tdCenter: {
    textAlign: 'center',
  },
  tdMonth: {
    fontWeight: '600',
  },
  tdGroupBorder: {
    borderRight: '2px solid rgb(148, 163, 184)',
  },
  rowOver: {
    backgroundColor: 'rgb(254, 242, 242)',
  },
  penaltyText: {
    color: 'rgb(220, 38, 38)',
    fontWeight: '600',
  },
  zeroText: {
    color: 'rgb(148, 163, 184)',
  },
  totalRow: {
    fontWeight: '700',
    backgroundColor: 'rgb(241, 245, 249)',
    borderTop: '2px solid rgb(15, 23, 42)',
  },
  summary: {
    backgroundColor: 'rgb(248, 250, 252)',
    border: '1px solid rgb(226, 232, 240)',
    borderRadius: '8px',
    padding: '14px 18px',
    fontSize: '12px',
    color: 'rgb(71, 85, 105)',
    lineHeight: '1.8',
    marginBottom: '20px',
  },
  summaryHighlight: {
    fontWeight: '600',
    color: 'rgb(15, 23, 42)',
  },
  summaryGreen: {
    fontWeight: '600',
    color: 'rgb(21, 128, 61)',
  },
  summaryRed: {
    fontWeight: '600',
    color: 'rgb(220, 38, 38)',
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

const fmt = (value) => Math.round(value).toLocaleString('zh-TW');

const renderMoney = (value, isPenalty) => {
  if (value <= 0) {
    return <span style={STYLES.zeroText}>—</span>;
  }
  return isPenalty ? <span style={STYLES.penaltyText}>{fmt(value)}</span> : fmt(value);
};

export function PdfPageTwo({ results, dateLabel }) {
  if (!results) return null;

  const { currentMonthlyDetails, optimalMonthlyDetails, currentCapacity, optimalCapacity } =
    results;

  // 預先聚合（避免 render 階段 mutate 變數）
  const sums = {
    currentBase: currentMonthlyDetails.reduce((s, m) => s + m.baseFee, 0),
    currentPenalty: currentMonthlyDetails.reduce((s, m) => s + m.penaltyFee, 0),
    optimalBase: optimalMonthlyDetails.reduce((s, m) => s + m.baseFee, 0),
    optimalPenalty: optimalMonthlyDetails.reduce((s, m) => s + m.penaltyFee, 0),
  };
  const totalCurrent = sums.currentBase + sums.currentPenalty;
  const totalOptimal = sums.optimalBase + sums.optimalPenalty;
  const totalDiff = totalCurrent - totalOptimal;

  const overMonthsOptimal = optimalMonthlyDetails.filter((m) => m.penaltyFee > 0).length;
  const overMonthsCurrent = currentMonthlyDetails.filter((m) => m.penaltyFee > 0).length;

  return (
    <div id="pdf-page-two" style={STYLES.page}>
      <div style={STYLES.header}>
        <h1 style={STYLES.title}>逐月費用對照</h1>
        <p style={STYLES.subtitle}>
          目前契約 {currentCapacity} kW &nbsp;vs&nbsp; 建議契約 {optimalCapacity} kW &nbsp;·&nbsp;{' '}
          {dateLabel}
        </p>
      </div>

      <h2 style={STYLES.sectionLabel}>12 個月明細（基本電費 + 罰款分列）</h2>
      <table style={STYLES.table}>
        <colgroup>
          <col style={{ width: '8%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '16%' }} />
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2} style={{ ...STYLES.thLeaf, ...STYLES.thLeafLeft }}>
              月份
            </th>
            <th rowSpan={2} style={{ ...STYLES.thLeaf, ...STYLES.thLeafCenter }}>
              最高需量
              <br />
              (kW)
            </th>
            <th colSpan={2} style={{ ...STYLES.thGroup, ...STYLES.thGroupCurrent }}>
              目前 ({currentCapacity} kW)
            </th>
            <th colSpan={2} style={{ ...STYLES.thGroup, ...STYLES.thGroupOptimal }}>
              建議 ({optimalCapacity} kW)
            </th>
            <th rowSpan={2} style={STYLES.thLeaf}>
              月差額
            </th>
          </tr>
          <tr>
            <th style={STYLES.thLeaf}>基本電費</th>
            <th style={{ ...STYLES.thLeaf, ...STYLES.tdGroupBorder }}>罰款</th>
            <th style={STYLES.thLeaf}>基本電費</th>
            <th style={{ ...STYLES.thLeaf, ...STYLES.tdGroupBorder }}>罰款</th>
          </tr>
        </thead>
        <tbody>
          {currentMonthlyDetails.map((cur, i) => {
            const opt = optimalMonthlyDetails[i];
            const diff = cur.totalFee - opt.totalFee;
            const isOverOptimal = opt.penaltyFee > 0;
            const rowStyle = isOverOptimal ? STYLES.rowOver : {};
            const diffStyle =
              diff > 0
                ? { color: 'rgb(21, 128, 61)', fontWeight: '600' }
                : diff < 0
                  ? { color: 'rgb(220, 38, 38)', fontWeight: '600' }
                  : { color: 'rgb(148, 163, 184)' };
            const diffText = diff > 0 ? `−${fmt(diff)}` : diff < 0 ? `+${fmt(-diff)}` : '0';

            return (
              <tr key={cur.month} style={rowStyle}>
                <td style={{ ...STYLES.td, ...STYLES.tdLeft, ...STYLES.tdMonth }}>
                  {MONTH_NAMES[i]}
                </td>
                <td style={{ ...STYLES.td, ...STYLES.tdCenter }}>{fmt(cur.demand)}</td>
                <td style={STYLES.td}>{renderMoney(cur.baseFee, false)}</td>
                <td style={{ ...STYLES.td, ...STYLES.tdGroupBorder }}>
                  {renderMoney(cur.penaltyFee, true)}
                </td>
                <td style={STYLES.td}>{renderMoney(opt.baseFee, false)}</td>
                <td style={{ ...STYLES.td, ...STYLES.tdGroupBorder }}>
                  {renderMoney(opt.penaltyFee, true)}
                </td>
                <td style={{ ...STYLES.td, ...diffStyle }}>{diffText}</td>
              </tr>
            );
          })}
          <tr style={STYLES.totalRow}>
            <td style={{ ...STYLES.td, ...STYLES.tdLeft, ...STYLES.tdCenter }} colSpan={2}>
              年度合計
            </td>
            <td style={STYLES.td}>{fmt(sums.currentBase)}</td>
            <td style={{ ...STYLES.td, ...STYLES.tdGroupBorder }}>
              {sums.currentPenalty > 0 ? (
                <span style={STYLES.penaltyText}>{fmt(sums.currentPenalty)}</span>
              ) : (
                <span style={STYLES.zeroText}>—</span>
              )}
            </td>
            <td style={STYLES.td}>{fmt(sums.optimalBase)}</td>
            <td style={{ ...STYLES.td, ...STYLES.tdGroupBorder }}>
              {sums.optimalPenalty > 0 ? (
                <span style={STYLES.penaltyText}>{fmt(sums.optimalPenalty)}</span>
              ) : (
                <span style={STYLES.zeroText}>—</span>
              )}
            </td>
            <td
              style={{
                ...STYLES.td,
                color: 'rgb(21, 128, 61)',
                fontWeight: '700',
              }}
            >
              −{fmt(totalDiff)}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={STYLES.summary}>
        <div>
          <span style={STYLES.summaryHighlight}>全年總節省：</span>
          <span style={STYLES.summaryGreen}>NT$ {fmt(totalDiff)} 元</span>
          <span> （平均每月 NT$ {fmt(totalDiff / 12)} 元）</span>
        </div>
        <div>
          <span style={STYLES.summaryHighlight}>目前 {currentCapacity} kW：</span>
          基本電費 NT$ {fmt(sums.currentBase)}
          {sums.currentPenalty > 0 ? (
            <>
              {' + 罰款 '}
              <span style={STYLES.summaryRed}>NT$ {fmt(sums.currentPenalty)}</span>
              {`（${overMonthsCurrent} 個月）`}
            </>
          ) : (
            <>（無罰款）</>
          )}
          {' ＝ '}
          <span style={STYLES.summaryHighlight}>NT$ {fmt(totalCurrent)}</span>
        </div>
        <div>
          <span style={STYLES.summaryHighlight}>建議 {optimalCapacity} kW：</span>
          基本電費 NT$ {fmt(sums.optimalBase)}
          {sums.optimalPenalty > 0 ? (
            <>
              {' + 罰款 '}
              <span style={STYLES.summaryRed}>NT$ {fmt(sums.optimalPenalty)}</span>
              {`（${overMonthsOptimal} 個月，紅底列）`}
            </>
          ) : (
            <>（無罰款）</>
          )}
          {' ＝ '}
          <span style={STYLES.summaryHighlight}>NT$ {fmt(totalOptimal)}</span>
        </div>
        {sums.optimalPenalty > 0 && (
          <div style={{ marginTop: '6px', fontStyle: 'italic' }}>
            ※ 建議方案會在 {overMonthsOptimal} 個月被罰款共 NT$ {fmt(sums.optimalPenalty)}，
            但因為基本電費省下 NT$ {fmt(sums.currentBase - sums.optimalBase)}，整體仍划算。
          </div>
        )}
      </div>

      <div style={STYLES.footnote}>
        欄位說明：「基本電費」＝契約容量 × 費率（夏月 236.2、非夏月 173.2
        元/kW）。「罰款」＝超過契約容量部分加倍計算（10% 內 2 倍、10% 外 3 倍）。
        「月差額」正值（綠）＝建議方案該月較省；負值（紅）＝建議方案該月反而較貴。紅底列＝建議契約下會超約並產生罰款的月份。
      </div>
      <div style={STYLES.pageNumber}>第 2 頁 / 共 2 頁 · OptiPower www.optipower.tw</div>
    </div>
  );
}

export default PdfPageTwo;
