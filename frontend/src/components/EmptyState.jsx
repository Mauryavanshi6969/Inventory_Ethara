export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
        <Icon size={24} className="text-zinc-500" />
      </div>
      <p className="text-sm font-medium text-zinc-300 mb-1">{title}</p>
      <p className="text-sm text-zinc-600 mb-5 max-w-xs">{description}</p>
      {action && action}
    </div>
  )
}