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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Orders</h2>
            <p className="section-subtitle">{orders.length} total orders</p>
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Create Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="No orders yet"
              description="Create your first order to get started"
              action={
                <button className="btn-primary flex items-center gap-2" onClick={() => setFormOpen(true)}>
                  <Plus size={14} /> Create Order
                </button>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr>
                    <th className="table-header">Order</th>
                    <th className="table-header">Customer</th>
                    <th className="table-header hidden sm:table-cell">Date</th>
                    <th className="table-header">Total</th>
                    <th className="table-header w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders].reverse().map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-cell">
                        <span className="font-mono text-indigo-400 text-xs">#{String(order.id).padStart(4, '0')}</span>
                      </td>
                      <td className="table-cell text-zinc-200">{getCustomerName(order)}</td>
                      <td className="table-cell hidden sm:table-cell text-zinc-500 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="table-cell font-mono font-medium">
                        ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/orders/${order.id}`}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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