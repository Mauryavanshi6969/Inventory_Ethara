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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Products</h2>
            <p className="section-subtitle">{products.length} total products</p>
          </div>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => { setEditTarget(null); setFormOpen(true) }}
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            className="input pl-9"
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
                  <button className="btn-primary flex items-center gap-2" onClick={() => setFormOpen(true)}>
                    <Plus size={14} /> Add Product
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
                    <th className="table-header">Product</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Price</th>
                    <th className="table-header">Stock</th>
                    <th className="table-header w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="table-row">
                      <td className="table-cell font-medium text-zinc-200">{p.name}</td>
                      <td className="table-cell font-mono text-zinc-500 text-xs">{p.sku}</td>
                      <td className="table-cell font-mono">₹{parseFloat(p.price).toFixed(2)}</td>
                      <td className="table-cell">{stockBadge(p.quantity)}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            onClick={() => { setEditTarget(p); setFormOpen(true) }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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