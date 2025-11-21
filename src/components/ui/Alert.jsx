// 提示訊息元件

const variants = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    text: 'text-green-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    text: 'text-red-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    text: 'text-blue-700',
  },
};

export function Alert({ variant = 'info', title, children, className = '' }) {
  const styles = variants[variant];

  return (
    <div className={`rounded-lg border p-4 ${styles.container} ${className}`}>
      {title && <h4 className={`font-medium mb-1 ${styles.title}`}>{title}</h4>}
      <div className={`text-sm ${styles.text}`}>{children}</div>
    </div>
  );
}

export default Alert;
