import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
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

  const isSuccess = toast.type === 'success'

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium min-w-[260px] max-w-sm animate-slide-up
        ${isSuccess
          ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400'
          : 'bg-zinc-900 border-red-500/30 text-red-400'
        }`}
      style={{ animation: 'slideUp 0.2s ease-out' }}
    >
      {isSuccess
        ? <CheckCircle size={16} className="flex-shrink-0" />
        : <XCircle size={16} className="flex-shrink-0" />
      }
      <span className="flex-1 text-zinc-200">{toast.message}</span>
      <button onClick={onRemove} className="text-zinc-600 hover:text-zinc-400 ml-1">
        <X size={14} />
      </button>
    </div>
  )
}