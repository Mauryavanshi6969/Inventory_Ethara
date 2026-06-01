import { useState, useEffect } from 'react'
import Modal from './Modal'

const empty = { name: '', email: '', phone: '' }

export default function CustomerForm({ isOpen, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) { setForm(empty); setErrors({}) }
  }, [isOpen])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer">
      <form onSubmit={handleSubmit} className="space-y-4">
        {field('name', 'Full Name', 'text', 'e.g. Rahul Sharma')}
        {field('email', 'Email Address', 'email', 'rahul@example.com')}
        {field('phone', 'Phone Number', 'tel', '+91 98765 43210')}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}