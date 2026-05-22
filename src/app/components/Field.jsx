export default function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  )
}