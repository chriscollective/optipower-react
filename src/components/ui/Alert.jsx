// 提示訊息元件 - 現代精緻風格

const variants = {
  success: {
    container: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/60',
    icon: 'text-emerald-500',
    title: 'text-emerald-800',
    text: 'text-emerald-700',
  },
  warning: {
    container: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/60',
    icon: 'text-amber-500',
    title: 'text-amber-800',
    text: 'text-amber-700',
  },
  error: {
    container: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/60',
    icon: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
  },
  info: {
    container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    text: 'text-blue-700',
  },
};

export function Alert({ variant = 'info', title, children, className = '' }) {
  const styles = variants[variant];

  return (
    <div
      className={`
        rounded-xl border p-4
        backdrop-blur-sm
        shadow-sm
        ${styles.container}
        ${className}
      `}
    >
      {title && (
        <h4 className={`font-semibold mb-1 ${styles.title}`}>{title}</h4>
      )}
      <div className={`text-sm leading-relaxed ${styles.text}`}>{children}</div>
    </div>
  );
}

export default Alert;
