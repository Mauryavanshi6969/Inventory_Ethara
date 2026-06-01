import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import { getProducts } from '../api/products'
import { getCustomers } from '../api/customers'
import { getOrders } from '../api/orders'
import { PageLoader } from '../components/Spinner'

function StatCard({ label, value, icon: Icon, color, sublabel }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-zinc-100 mb-0.5">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
      {sublabel && <p className="text-xs text-zinc-600 mt-1">{sublabel}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCustomers(), getOrders()])
      .then(([p, c, o]) => { setProducts(p); setCustomers(c); setOrders(o) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5)
  const outOfStock = products.filter(p => p.quantity === 0)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const recentOrders = [...orders].reverse().slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={products.length} icon={Package} color="indigo" sublabel={`${outOfStock.length} out of stock`} />
        <StatCard label="Total Customers" value={customers.length} icon={Users} color="emerald" />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} color="amber" />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon={TrendingUp} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Low stock */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400" />
              <h2 className="text-sm font-medium text-zinc-200">Low Stock Alerts</h2>
            </div>
            <Link to="/products" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">All products are well stocked</p>
          ) : (
            <div className="space-y-2">
              {outOfStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                  <div>
                    <p className="text-sm text-zinc-300">{p.name}</p>
                    <p className="text-xs text-zinc-600 font-mono">{p.sku}</p>
                  </div>
                  <span className="badge-danger">Out of stock</span>
                </div>
              ))}
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                  <div>
                    <p className="text-sm text-zinc-300">{p.name}</p>
                    <p className="text-xs text-zinc-600 font-mono">{p.sku}</p>
                  </div>
                  <span className="badge-warning">{p.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={15} className="text-indigo-400" />
              <h2 className="text-sm font-medium text-zinc-200">Recent Orders</h2>
            </div>
            <Link to="/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-0">
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between py-2.5 border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30 -mx-2 px-2 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm text-zinc-300">Order #{order.id}</p>
                    <p className="text-xs text-zinc-600">
                      {order.customer?.name || `Customer #${order.customer_id}`}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-indigo-400 font-mono">
                    ₹{(order.total_amount || 0).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}