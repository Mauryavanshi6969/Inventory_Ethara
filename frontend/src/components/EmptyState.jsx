export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(124,58,237,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: '0 0 24px rgba(124,58,237,0.08)',
      }}>
        <Icon size={22} color="rgba(124,58,237,0.6)" />
      </div>
      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f1f0ff', marginBottom: '6px' }}>{title}</p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '280px', lineHeight: 1.6 }}>
        {description}
      </p>
      {action && action}
    </div>
  )
}