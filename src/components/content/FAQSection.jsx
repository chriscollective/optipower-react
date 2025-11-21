// FAQ 常見問題區塊元件

import { useState } from 'react';
import { Card } from '../ui/Card';

const faqs = [
  {
    question: 'OptiPower 支援哪些電價方案？',
    answer:
      '目前工具聚焦於台電的「低壓電力」且採用「非時間電價」的方案，這類用戶通常包含中小企業、社區大樓與商辦空間。若您使用的是高壓或時間電價方案，建議改用台電官方工具或諮詢能源顧問。',
  },
  {
    question: '契約容量調整需要多少時間？',
    answer:
      '若由高調降至低，通常申請後一週內台電人員即可到場調整電表；若未來可能擴增設備，建議保留安全餘裕，以免再度申請提高契約容量時耗費額外時間與手續費。',
  },
  {
    question: '試算結果能否下載？',
    answer:
      '目前版本尚未支援匯出報表，建議以截圖或複製節省金額的方式分享。如需新增 PDF／Excel 匯出功能，歡迎寫信至 justakiss918@gmail.com 提出需求。',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-2 flex items-center justify-between text-left hover:bg-gray-50/80 rounded-lg transition-all duration-200"
      >
        <span className="font-medium text-gray-800 pr-4">{question}</span>
        <span
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {/* 滑動展開動畫容器 */}
      <div
        className={`
          grid transition-all duration-300 ease-out
          ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pr-12 pl-2">
            <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
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
