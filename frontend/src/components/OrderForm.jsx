import { useState, useEffect } from 'react'
import Modal from './Modal'
import { Plus, Trash2 } from 'lucide-react'

export default function OrderForm({ isOpen, onClose, onSubmit, customers, products, loading }) {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setCustomerId('')
      setItems([{ product_id: '', quantity: 1 }])
      setErrors({})
    }
  }, [isOpen])

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }])

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

  const updateItem = (i, field, value) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    setItems(updated)
  }

  const getProduct = (id) => products.find(p => String(p.id) === String(id))

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      const p = getProduct(item.product_id)
      return sum + (p ? p.price * (parseInt(item.quantity) || 0) : 0)
    }, 0)
  }

  const validate = () => {
    const e = {}
    if (!customerId) e.customer = 'Select a customer'
    items.forEach((item, i) => {
      if (!item.product_id) e[`product_${i}`] = 'Select a product'
      if (!item.quantity || item.quantity < 1) e[`qty_${i}`] = 'Min qty is 1'
      const p = getProduct(item.product_id)
      if (p && parseInt(item.quantity) > p.quantity)
        e[`qty_${i}`] = `Only ${p.quantity} in stock`
    })
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({
      customer_id: parseInt(customerId),
      items: items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
      })),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer */}
        <div>
          <label className="label">Customer</label>
          <select
            className={`input ${errors.customer ? 'border-red-500' : ''}`}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Select customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
            ))}
          </select>
          {errors.customer && <p className="text-xs text-red-400 mt-1">{errors.customer}</p>}
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Order Items</label>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus size={13} /> Add item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => {
              const p = getProduct(item.product_id)
              return (
                <div key={i} className="bg-zinc-800/60 rounded-lg p-3 space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        className={`input text-xs ${errors[`product_${i}`] ? 'border-red-500' : ''}`}
                        value={item.product_id}
                        onChange={(e) => updateItem(i, 'product_id', e.target.value)}
                      >
                        <option value="">Select product...</option>
                        {products.map(pr => (
                          <option key={pr.id} value={pr.id} disabled={pr.quantity === 0}>
                            {pr.name} — ₹{pr.price} (stock: {pr.quantity})
                          </option>
                        ))}
                      </select>
                      {errors[`product_${i}`] && <p className="text-xs text-red-400 mt-1">{errors[`product_${i}`]}</p>}
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        className={`input text-xs ${errors[`qty_${i}`] ? 'border-red-500' : ''}`}
                        value={item.quantity}
                        onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                        placeholder="Qty"
                      />
                      {errors[`qty_${i}`] && <p className="text-xs text-red-400 mt-1">{errors[`qty_${i}`]}</p>}
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(i)} className="text-zinc-600 hover:text-red-400 pt-1">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  {p && (
                    <p className="text-xs text-zinc-500">
                      Subtotal: ₹{(p.price * (parseInt(item.quantity) || 0)).toFixed(2)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between bg-zinc-800/40 rounded-lg px-4 py-2.5 border border-zinc-700/50">
          <span className="text-sm text-zinc-400">Estimated Total</span>
          <span className="text-sm font-semibold text-indigo-400 font-mono">₹{calcTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </Modal>
  )
}