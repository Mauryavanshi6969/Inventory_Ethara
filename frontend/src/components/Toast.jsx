import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3500)
    return () => clearTimeout(timer)
  }, [])

  const isSuccess = toast.type !== 'error'

  return (
    <div
      className="animate-slide-right"
      style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 14px',
        borderRadius: '12px',
        minWidth: '280px', maxWidth: '360px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: isSuccess
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        border: isSuccess
          ? '1px solid rgba(16,185,129,0.25)'
          : '1px solid rgba(239,68,68,0.25)',
        boxShadow: isSuccess
          ? '0 8px 32px rgba(16,185,129,0.12), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(239,68,68,0.12), 0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        background: isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isSuccess
          ? <CheckCircle size={15} color="#34d399" />
          : <XCircle size={15} color="#f87171" />
        }
      </div>
      <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 500, color: '#f1f0ff' }}>
        {toast.message}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '2px',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f1f0ff'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={13} />
      </button>
    </div>
  )
}