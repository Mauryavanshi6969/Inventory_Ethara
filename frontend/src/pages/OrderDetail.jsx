import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Package, User, Calendar, Receipt } from 'lucide-react'
import { getOrder, deleteOrder } from '../api/orders'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { useToast } from '../components/useToast'
import { PageLoader } from '../components/Spinner'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(() => addToast('Failed to load order', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await deleteOrder(id)
      navigate('/orders')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (str) => {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) return <PageLoader />

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-zinc-500 mb-4">Order not found</p>
      <Link to="/orders" className="btn-secondary inline-flex items-center gap-2">
        <ArrowLeft size={14} /> Back to Orders
      </Link>
    </div>
  )

  const items = order.items || order.order_items || []

  return (
    <>
      <div className="max-w-2xl space-y-4">
        {/* Back + header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/orders" className="text-zinc-500 hover:text-zinc-200 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="page-title">
                Order <span className="font-mono text-indigo-400">#{String(order.id).padStart(4, '0')}</span>
              </h2>
              <p className="section-subtitle">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <button
            className="btn-danger flex items-center gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={14} /> Cancel Order
          </button>
        </div>

        {/* Customer info */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-zinc-500" />
            <h3 className="text-sm font-medium text-zinc-400">Customer</h3>
          </div>
          {order.customer ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">{order.customer.name}</p>
              <p className="text-xs text-zinc-500">{order.customer.email}</p>
              <p className="text-xs text-zinc-500">{order.customer.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Customer #{order.customer_id}</p>
          )}
        </div>

        {/* Order items */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <Package size={14} className="text-zinc-500" />
            <h3 className="text-sm font-medium text-zinc-400">Items</h3>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600 px-5 py-4">No items found</p>
          ) : (
            <table className="w-full">
              <thead className="border-b border-zinc-800">
                <tr>
                  <th className="table-header">Product</th>
                  <th className="table-header">Qty</th>
                  <th className="table-header">Unit Price</th>
                  <th className="table-header">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell">
                      <p className="text-sm text-zinc-200">{item.product?.name || `Product #${item.product_id}`}</p>
                      {item.product?.sku && (
                        <p className="text-xs font-mono text-zinc-600">{item.product.sku}</p>
                      )}
                    </td>
                    <td className="table-cell font-mono">{item.quantity}</td>
                    <td className="table-cell font-mono">₹{parseFloat(item.unit_price || item.product?.price || 0).toFixed(2)}</td>
                    <td className="table-cell font-mono">
                      ₹{((item.unit_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Total */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 bg-zinc-800/30">
            <div className="flex items-center gap-2">
              <Receipt size={14} className="text-zinc-500" />
              <span className="text-sm font-medium text-zinc-300">Total Amount</span>
            </div>
            <span className="text-base font-semibold font-mono text-indigo-400">
              ₹{parseFloat(order.total_amount || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={submitting}
        title={`Cancel Order #${order.id}?`}
        message="This will permanently remove the order. You will be redirected back to orders."
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}