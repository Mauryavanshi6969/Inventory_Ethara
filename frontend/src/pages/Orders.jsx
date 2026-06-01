import { useEffect, useState } from 'react'
import { Plus, Trash2, ShoppingCart, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getOrders, createOrder, deleteOrder } from '../api/orders'
import { getCustomers } from '../api/customers'
import { getProducts } from '../api/products'
import OrderForm from '../components/OrderForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { useToast } from '../components/useToast'
import { PageLoader } from '../components/Spinner'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const load = () =>
    Promise.all([getOrders(), getCustomers(), getProducts()])
      .then(([o, c, p]) => { setOrders(o); setCustomers(c); setProducts(p) })
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async (data) => {
    setSubmitting(true)
    try {
      await createOrder(data)
      addToast('Order placed successfully')
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
      await deleteOrder(deleteTarget.id)
      addToast('Order cancelled')
      setDeleteTarget(null)
      load()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const getCustomerName = (order) =>
    order.customer?.name || customers.find(c => c.id === order.customer_id)?.name || `#${order.customer_id}`

  const formatDate = (str) => {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) return <PageLoader />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 className="page-title">Orders</h2>
            <p className="section-subtitle">{orders.length} total orders</p>
          </div>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Create Order
          </button>
        </div>

        {/* Table */}
        {orders.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="No orders yet"
              description="Create your first order to get started"
              action={
                <button className="btn-primary" onClick={() => setFormOpen(true)}>
                  <Plus size={14} /> Create Order
                </button>
              }
            />
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th className="table-header">Order ID</th>
                    <th className="table-header">Customer</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Total</th>
                    <th className="table-header" style={{ width: '90px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders].reverse().map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-cell">
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.8rem', fontWeight: 600,
                          color: '#a78bfa',
                          background: 'rgba(124,58,237,0.1)',
                          border: '1px solid rgba(124,58,237,0.18)',
                          padding: '3px 8px', borderRadius: '6px',
                        }}>
                          #{String(order.id).padStart(4, '0')}
                        </span>
                      </td>
                      <td className="table-cell" style={{ color: '#f1f0ff', fontWeight: 500 }}>
                        {getCustomerName(order)}
                      </td>
                      <td className="table-cell" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(order.created_at)}
                      </td>
                      <td className="table-cell">
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 600, color: '#22d3ee', fontSize: '0.875rem',
                        }}>
                          ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Link
                            to={`/orders/${order.id}`}
                            style={{
                              padding: '6px', borderRadius: '8px',
                              color: 'var(--text-muted)', textDecoration: 'none',
                              display: 'flex', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            style={{
                              padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            onClick={() => setDeleteTarget(order)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <OrderForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        customers={customers}
        products={products}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title={`Cancel Order #${deleteTarget?.id}?`}
        message="This will permanently cancel and remove the order. Stock will not be automatically restored."
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}