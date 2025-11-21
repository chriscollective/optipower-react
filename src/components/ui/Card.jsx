// 卡片元件 - 現代精緻風格

export function Card({ children, className = '', title, subtitle }) {
  return (
    <div
      className={`
        bg-white/90 backdrop-blur-sm rounded-2xl
        shadow-lg shadow-gray-200/50
        border border-gray-100
        hover:shadow-xl hover:shadow-gray-200/60
        transition-all duration-300
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-gray-100">
          {title && (
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export default Card;
