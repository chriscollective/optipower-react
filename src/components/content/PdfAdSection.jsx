export function PdfAdSection() {
  return (
    <section data-pdf-section="support" className="mt-4 relative" style={{ zIndex: 1 }}>
      {/* 扁平化廣告卡片，避免 PDF 另起一頁 */}
      <div className="rounded-xl bg-white px-6 py-5 text-slate-800 shadow-sm">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl text-blue-500">社區節能實驗室</h1>
          <p className="text-sm text-slate-500 pt-1">
            有問題想問？需要專人協助？我們提供後續支援與完整代辦服務，協助您落實最佳化建議。
          </p>
        </header>

        {/* 三欄表單布局：左定位、中說明、右聯繫，確保資訊密集但高度受控 */}
        <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1.4fr_1.2fr]">
          {/* 左欄：服務定位 */}
          <div className="grid grid-rows-2 gap-3">
            <FormField label="服務項目" value="後續諮詢／契約容量代辦" className="h-full" />
            <FormField label="服務對象" value="低壓用電戶、社區" className="h-full" />
          </div>

          {/* 中欄：服務說明 */}
          <div className="grid grid-rows-2 gap-3">
            <FormField
              label="免費諮詢"
              value="加入 LINE 好友，即時獲得專人解答與節能建議。"
              className="h-full"
            />
            <FormField
              label="付費代辦"
              value="雙北提供現場勘查與文件代辦（ 不含三芝、石門、金山、萬里、貢寮、雙溪）。"
              className="h-full"
            />
          </div>

          {/* 右欄：聯繫資訊與 QRcode */}
          <div className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">LINE 官方帳號</p>
              <p className="mt-1 text-lg font-bold text-slate-900">@059ytmzu</p>
              <a
                href="https://lin.ee/31n6owT"
                className="text-xs font-medium text-blue-600 underline underline-offset-2"
              >
                https://lin.ee/31n6owT
              </a>
            </div>

            <div className="mt-auto flex flex-row items-center gap-1">
              <p className="text-[11px] font-semibold text-slate-600">掃描 QRcode 立即加入好友</p>
              <img
                src="/S_gainfriends_2dbarcodes_BW.png"
                alt="LINE QRcode"
                className="h-24 w-24 rounded-md border border-slate-200 bg-white p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, value, className = '' }) {
  return (
    <label
      className={`flex flex-col rounded-lg border border-slate-100 bg-white p-3 text-left ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="mt-1 text-sm font-semibold text-slate-900 leading-snug">{value}</span>
    </label>
  );
}
