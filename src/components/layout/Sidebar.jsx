// 側邊欄元件

import { useState } from 'react';

function SidebarSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm">{title}</span>
        <span
          className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && <div className="px-4 pb-4 text-sm text-gray-600">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="bg-white rounded-lg shadow sticky top-4">
        {/* 側邊欄標題 */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h2 className="font-semibold text-gray-900">🔖 網站說明</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {/* 什麼是契約容量 */}
          <SidebarSection title="什麼是契約容量？" defaultOpen={true}>
            <p className="mb-3">
              契約容量是指台電與用戶之間約定的最高用電需求量(平均15分鐘內)，以千瓦(kW)為單位，超過會加倍收取費用。
            </p>
            <p className="mb-3">
              你可以想像契約容量像是手機的月租費，不管用電量多或少，都是固定的支出費用。
              另一種比喻是契約容量就像水管的粗細大小，如果你同時間需要的水量(電量)越大，
              那你的水管直徑大小(契約容量)也要越大，這個與你的總用水量(總用電量)沒關係，而是與你的瞬間需求量有關。
            </p>
            <p>
              舉例來說，同一時間公設區域用的電量越多(照明、冷氣、電梯、抽水馬達等等)，那你也需要更高的契約容量。
            </p>
          </SidebarSection>

          {/* 誰適合使用 */}
          <SidebarSection title="👤 誰適合使用本網站？">
            <p className="mb-3">
              這個網站適用於使用「低壓電力」方案的用戶，特別適合台灣中小型社區。
            </p>
            <p className="mb-2">拿起你收到的電費帳單，看一下用戶資訊：</p>
            <ul className="list-disc list-inside mb-3 space-y-1">
              <li>
                <strong>電價種類</strong>：電力需量非營業用
              </li>
              <li>
                <strong>時間種類</strong>：非時間電價
              </li>
            </ul>
            <p className="mb-2">接著看下方資訊是否有：</p>
            <ul className="list-disc list-inside mb-3 space-y-1">
              <li>契約容量</li>
              <li>最高需量</li>
              <li>計費度數</li>
            </ul>
            <p>如果以上條件都符合，那麼你就非常適合使用這個網站！一起省錢吧٩(๑•̀ω•́๑)۶!</p>
          </SidebarSection>

          {/* 電費計算方式 */}
          <SidebarSection title="電費的計算方式">
            <p className="mb-3">
              電費 = 契約容量 × 基本電費 + 用電量 × 流動電費，依夏月（6~9月）與非夏月不同計價。
            </p>
            <p className="mb-3 text-orange-600 font-medium">
              {'<<此網站只計算基本電費總額>>'}，因為流動電費與契約容量無關。
            </p>
            <div className="bg-gray-50 rounded p-3 mb-3 text-xs space-y-1">
              <p>
                <strong>夏月:</strong> 基本電費 236.2 元/千瓦，流動電費 3.44/度
              </p>
              <p>
                <strong>非夏月:</strong> 基本電費 173.2 元/千瓦，流動電費 3.26/度
              </p>
              <p>
                <strong>超額罰款:</strong> 超出 10% 以內為 2 倍電價，10% 以上為 3 倍電價
              </p>
            </div>
            <p className="text-xs text-gray-500">
              P.S.如果社區每月用電需求量差異很大(夏天與非夏天)，那麼很有可能偶爾被罰錢還會比較便宜。
              (因為基本費用省下的金額{'>'}罰款的金額)
            </p>
          </SidebarSection>

          {/* 注意事項 */}
          <SidebarSection title="⚠️ 注意事項">
            <p className="mb-3">
              契約容量由高改成低不用額外的變更費用，但是若為由低改高則需額外的變更費用。
            </p>
            <p className="mb-3">
              如果確定社區內短期間不會再新增任何的公共設備，那麼由高改低不會有太大的問題。
              反之，如果社區未來可能會新增設備，用電量可能會上升，那麼建議是可以預留多一點的空間，
              不用一次調得太低。
            </p>
            <p className="text-xs text-gray-500">
              不過站主認為省下來的錢都可以申請好幾次了
              (依站主自身社區的例子是這樣，但每個社區狀況不一樣，請各主委自行判斷。)
            </p>
          </SidebarSection>

          {/* 申請變更方式 */}
          <SidebarSection title="📝 申請變更方式">
            <p>
              主委帶著大小章（社區大章、主委個人章）、身分證、區公所公文（申報公文，證明主委身份），
              到台電服務處臨櫃申請契約容量變更，直接告訴櫃檯人員說你要改為多少千瓦
              (其實你也可以請台電人員幫你計算改為多少最合理，他可以查閱歷年資料來計算，但是你看不到他是怎麼算的)，
              通過後大約一周內，會有台電人員到社區內調整電表。
            </p>
          </SidebarSection>

          {/* 為什麼站主要寫這個網站 */}
          <SidebarSection title="為什麼站主要寫這個網站">
            <p>
              因為站主接任了30年的老社區主委，發現電費頗高，花了很多時間研究，才明白其中原因。
              (如果當初社區管理人員早一點調整，30年的時間至少可以省下將近90萬的電費!)
              希望藉由這個網站幫助更多人省錢!也練習與AI溝通的能力!
            </p>
          </SidebarSection>

          {/* 贊助與支持 */}
          <SidebarSection title="🙌 贊助與支持">
            <p className="mb-3">
              如果你覺得這個網站對你有幫助，歡迎透過以下LINE Pay QR code自由樂捐給站主，感謝你的支持！
            </p>
            <div className="flex justify-center">
              <img
                src="/linepay_qrcode.jpg"
                alt="LINE Pay QR Code－贊助 OptiPower"
                className="w-32 h-32 object-contain"
              />
            </div>
          </SidebarSection>

          {/* 聯繫與反饋 */}
          <SidebarSection title="📬 聯繫與反饋">
            <p className="mb-2">如果有任何網站相關的問題，歡迎寄信到以下信箱聯繫站主：</p>
            <p className="mb-3">
              <a href="mailto:justakiss918@gmail.com" className="text-blue-600 hover:underline">
                justakiss918@gmail.com
              </a>
            </p>
            <p className="text-xs text-gray-500">網站最新更新日期: 2025/01/21</p>
          </SidebarSection>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
