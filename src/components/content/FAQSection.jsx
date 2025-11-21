// FAQ 常見問題區塊元件

import { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';

const faqs = [
  {
    question: 'Q1. OptiPower 支援哪些電價方案？',
    answer:
      '目前工具聚焦於台電的「低壓電力」、「非時間電價」且採用「非營業用」的方案。這類用戶通常包含中小型社區大樓、小型社區。若您使用的是高壓或時間電價方案，建議改用台電官方工具或諮詢能源顧問。',
  },
  {
    question: 'Q2. 契約容量調整需要多少時間？',
    answer:
      '若由高調降至低，通常申請後一週內台電人員即可到場調整電表；若未來可能擴增設備，建議保留安全餘裕，以免再度申請提高契約容量時耗費額外時間與手續費。',
  },
  {
    question: 'Q3. 試算結果能否下載？',
    answer:
      '目前版本尚未支援匯出報表，建議以截圖或複製節省金額的方式分享。如需新增 PDF／Excel 匯出功能，歡迎寫信至 justakiss918@gmail.com 提出需求。',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  // 根據開闔狀態調整高度以製造向下滑動動畫
  useEffect(() => {
    if (!contentRef.current) return;

    setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  // 開啟時監聽視窗尺寸，避免字體換行造成高度錯誤
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="font-medium text-gray-800">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-[height,opacity] duration-400 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ height }}
      >
        <div ref={contentRef} className="px-4 py-3 bg-white">
          <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
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
      <div>
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
