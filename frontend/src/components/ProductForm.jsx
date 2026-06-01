import { useState, useEffect } from 'react'
import Modal from './Modal'

const empty = { name: '', sku: '', price: '', quantity: '' }

export default function ProductForm({ isOpen, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        sku: initial.sku || '',
        price: initial.price ?? '',
        quantity: initial.quantity ?? '',
      })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [initial, isOpen])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required'
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = 'Valid quantity required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
    })
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className={`input ${errors[key] ? 'border-red-500 focus:ring-red-500' : ''}`}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
      />
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {field('name', 'Product Name', 'text', 'e.g. Wireless Headphones')}
        {field('sku', 'SKU / Code', 'text', 'e.g. WH-001')}
        <div className="grid grid-cols-2 gap-3">
          {field('price', 'Price (₹)', 'number', '0.00')}
          {field('quantity', 'Quantity in Stock', 'number', '0')}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : initial ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}