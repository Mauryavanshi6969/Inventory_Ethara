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

  const avatarStyle = (id) => {
    const styles = [
      { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: 'rgba(124,58,237,0.25)' },
      { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
      { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
      { bg: 'rgba(236,72,153,0.15)', color: '#f472b6', border: 'rgba(236,72,153,0.25)' },
      { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
    ]
    return styles[id % styles.length]
  }

  if (loading) return <PageLoader />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 className="page-title">Customers</h2>
            <p className="section-subtitle">{customers.length} registered customers</p>
          </div>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Add Customer
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
          <input
            className="input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table / Empty */}
        {filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Users}
              title="No customers found"
              description={search ? 'Try a different search term' : 'Add your first customer to get started'}
              action={
                !search && (
                  <button className="btn-primary" onClick={() => setFormOpen(true)}>
                    <Plus size={14} /> Add Customer
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th className="table-header">Customer</th>
                    <th className="table-header" style={{ display: 'none' }} className="sm:table-cell table-header">Email</th>
                    <th className="table-header" style={{ display: 'none' }} className="md:table-cell table-header">Phone</th>
                    <th className="table-header" style={{ width: '60px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const av = avatarStyle(c.id)
                    return (
                      <tr key={c.id} className="table-row">
                        <td className="table-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                              background: av.bg, border: `1px solid ${av.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: 700, color: av.color,
                              letterSpacing: '0.02em',
                            }}>
                              {initials(c.name)}
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f1f0ff' }}>{c.name}</p>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell hidden sm:table-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={12} color="var(--text-muted)" />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.email}</span>
                          </div>
                        </td>
                        <td className="table-cell hidden md:table-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={12} color="var(--text-muted)" />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.phone}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <button
                            style={{
                              padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            onClick={() => setDeleteTarget(c)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
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