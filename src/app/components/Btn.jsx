export default function Btn({
  children,
  onClick,
  color = '#3b82f6',
  small,
  danger,
  full,
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-semibold transition
        ${small ? 'px-3 py-1 text-sm' : 'px-4 py-2'}
        ${full ? 'w-full' : ''}
      `}
      style={{
        background: danger ? '#ef4444' : color,
        color: '#fff',
      }}
    >
      {children}
    </button>
  )
}