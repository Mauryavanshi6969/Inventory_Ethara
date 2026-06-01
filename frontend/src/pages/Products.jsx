import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products'
import ProductForm from '../components/ProductForm'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { useToast } from '../components/useToast'
import { PageLoader } from '../components/Spinner'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const load = () => getProducts().then(setProducts).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editTarget) {
        await updateProduct(editTarget.id, data)
        addToast('Product updated successfully')
      } else {
        await createProduct(data)
        addToast('Product added successfully')
      }
      setFormOpen(false)
      setEditTarget(null)
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
      await deleteProduct(deleteTarget.id)
      addToast('Product deleted')
      setDeleteTarget(null)
      load()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="badge-danger">Out of stock</span>
    if (qty <= 5) return <span className="badge-warning">{qty} left</span>
    return <span className="badge-success">{qty} in stock</span>
  }

  if (loading) return <PageLoader />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 className="page-title">Products</h2>
            <p className="section-subtitle">{products.length} products in inventory</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => { setEditTarget(null); setFormOpen(true) }}
          >
            <Plus size={15} /> Add Product
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
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Package}
              title="No products found"
              description={search ? 'Try a different search term' : 'Add your first product to get started'}
              action={
                !search && (
                  <button className="btn-primary" onClick={() => setFormOpen(true)}>
                    <Plus size={14} /> Add Product
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
                    <th className="table-header">Product</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Stock</th>
                    <th className="table-header" style={{ width: '90px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell" style={{ fontWeight: 500, color: '#f1f0ff' }}>{p.name}</td>
                      <td className="table-cell">
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.sku}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#22d3ee', fontWeight: 500 }}>
                          ₹{parseFloat(p.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">{stockBadge(p.quantity)}</td>
                      <td className="table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            style={{
                              padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: 'var(--text-muted)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            onClick={() => { setEditTarget(p); setFormOpen(true) }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            style={{
                              padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              background: 'transparent', color: 'var(--text-muted)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                            onClick={() => setDeleteTarget(p)}
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

      <ProductForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSubmit}
        initial={editTarget}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={submitting}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action cannot be undone. The product will be permanently removed."
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}