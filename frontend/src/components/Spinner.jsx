export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 16, md: 24, lg: 40 }
  const px = sizes[size]
  return (
    <div style={{
      width: `${px}px`, height: `${px}px`,
      borderRadius: '50%',
      border: '2px solid rgba(124,58,237,0.15)',
      borderTopColor: '#7c3aed',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

export function PageLoader() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 0', gap: '16px',
    }}>
      <div style={{
        position: 'relative', width: '48px', height: '48px',
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(124,58,237,0.12)',
          borderTopColor: '#7c3aed',
          animation: 'spin 0.8s linear infinite',
        }} />
        {/* Inner ring */}
        <div style={{
          position: 'absolute', inset: '8px',
          borderRadius: '50%',
          border: '2px solid rgba(6,182,212,0.12)',
          borderBottomColor: '#06b6d4',
          animation: 'spin 0.6s linear infinite reverse',
        }} />
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Loading...</p>
    </div>
  )
}