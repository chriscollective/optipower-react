// FAQ 常見問題區塊元件

import { useState } from 'react';
import { Card } from '../ui/Card';

const faqs = [
  {
    question: '最高需量要從哪裡查詢？',
    answer:
      '您可以登入台電公司網站的「電子帳單服務系統」查詢，或查看每月電費帳單上的「最高需量」欄位。也可以撥打台電客服專線 1911 查詢。',
  },
  {
    question: '契約容量多久可以調整一次？',
    answer:
      '依台電規定，契約容量調整後需維持至少 1 年才能再次調整。因此建議您審慎評估後再申請調整。',
  },
  {
    question: '調整契約容量需要費用嗎？',
    answer:
      '調整契約容量本身不收費，但若需要變更供電設備（如增加變壓器容量），可能需要負擔相關工程費用。',
  },
  {
    question: '計算結果準確嗎？',
    answer:
      '本工具依據台電公告的電價表計算基本電費部分。實際電費還包含流動電費（依用電度數計算）及其他附加費用，建議以台電帳單為準。',
  },
  {
    question: '為什麼有時候提高契約容量反而更省錢？',
    answer:
      '當您的用電經常超出契約容量時，超約罰款會非常高昂（2-3 倍費率）。適度提高契約容量雖然基本電費增加，但可以避免更高的超約罰款，整體費用反而降低。',
  },
  {
    question: '夏月費率為什麼比較高？',
    answer:
      '夏季（6-9月）是用電高峰期，電力系統負載較重，因此台電採用較高的夏月費率來反映供電成本並鼓勵節約用電。',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <span
          className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pr-12">
          <p className="text-sm text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card title="常見問題" className="mt-8">
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </Card>
  );
}

export default FAQSection;
