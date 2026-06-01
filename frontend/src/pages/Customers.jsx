import { useEffect, useState } from 'react'
import { Plus, Trash2, Users, Search, Mail, Phone } from 'lucide-react'
import { getCustomers, createCustomer, deleteCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { useToast } from '../components/useToast'
import { PageLoader } from '../components/Spinner'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const load = () => getCustomers().then(setCustomers).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const handleCreate = async (data) => {
    setSubmitting(true)
    try {
      await createCustomer(data)
      addToast('Customer added successfully')
      setFormOpen(false)
      load()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await deleteCustomer(deleteTarget.id)
      addToast('Customer deleted')
      setDeleteTarget(null)
      load()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const avatarColor = (id) => {
    const colors = [
      'bg-indigo-500/20 text-indigo-400',
      'bg-emerald-500/20 text-emerald-400',
      'bg-amber-500/20 text-amber-400',
      'bg-pink-500/20 text-pink-400',
      'bg-cyan-500/20 text-cyan-400',
    ]
    return colors[id % colors.length]
  }

  if (loading) return <PageLoader />

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Customers</h2>
            <p className="section-subtitle">{customers.length} total customers</p>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            className="input pl-9"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Users}
              title="No customers found"
              description={search ? 'Try a different search term' : 'Add your first customer to get started'}
              action={
                !search && (
                  <button className="btn-primary flex items-center gap-2" onClick={() => setFormOpen(true)}>
                    <Plus size={14} /> Add Customer
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr>
                    <th className="table-header">Customer</th>
                    <th className="table-header hidden sm:table-cell">Email</th>
                    <th className="table-header hidden md:table-cell">Phone</th>
                    <th className="table-header w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${avatarColor(c.id)}`}>
                            {initials(c.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                            <p className="text-xs text-zinc-600 sm:hidden">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Mail size={12} />
                          <span className="text-xs">{c.email}</span>
                        </div>
                      </td>
                      <td className="table-cell hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Phone size={12} />
                          <span className="text-xs">{c.phone}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <button
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <CustomerForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This will permanently remove the customer record."
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}