import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp, ArrowRight, Activity } from 'lucide-react'
import { getProducts } from '../api/products'
import { getCustomers } from '../api/customers'
import { getOrders } from '../api/orders'
import { PageLoader } from '../components/Spinner'

function StatCard({ label, value, icon: Icon, gradient, sublabel }) {
  const gradients = {
    purple: { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)', icon: 'rgba(124,58,237,0.2)', iconColor: '#a78bfa', glow: 'rgba(124,58,237,0.15)' },
    emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)', icon: 'rgba(16,185,129,0.15)', iconColor: '#34d399', glow: 'rgba(16,185,129,0.1)' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', icon: 'rgba(245,158,11,0.15)', iconColor: '#fbbf24', glow: 'rgba(245,158,11,0.1)' },
    cyan: { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.18)', icon: 'rgba(6,182,212,0.15)', iconColor: '#22d3ee', glow: 'rgba(6,182,212,0.1)' },
  }
  const g = gradients[gradient]

  return (
    <div style={{
      background: g.bg,
      border: `1px solid ${g.border}`,
      borderRadius: '16px',
      padding: '20px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 24px ${g.glow}`,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${g.glow}` }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${g.glow}` }}
    >
      {/* Shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${g.iconColor}40, transparent)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: g.icon, border: `1px solid ${g.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={g.iconColor} />
        </div>
        <Activity size={14} color={g.iconColor} style={{ opacity: 0.5 }} />
      </div>

      <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f1f0ff', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.8125rem', color: 'rgba(148,137,186,0.7)', marginTop: '4px' }}>{label}</p>
      {sublabel && (
        <p style={{ fontSize: '0.7rem', color: 'rgba(78,72,112,0.8)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>{sublabel}</p>
      )}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f0ff', letterSpacing: '-0.025em' }}>
          Welcome back 👋
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'rgba(148,137,186,0.6)', marginTop: '4px' }}>
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Products" value={products.length} icon={Package} gradient="purple" sublabel={`${outOfStock.length} out of stock`} />
        <StatCard label="Total Customers" value={customers.length} icon={Users} gradient="emerald" />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} gradient="amber" />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon={TrendingUp} gradient="cyan" />
      </div>

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>

        {/* Low Stock */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={13} color="#fbbf24" />
              </div>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f0ff' }}>Stock Alerts</h2>
              {(lowStock.length + outOfStock.length) > 0 && (
                <span style={{
                  background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '99px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700,
                }}>
                  {lowStock.length + outOfStock.length}
                </span>
              )}
            </div>
            <Link to="/products" style={{
              fontSize: '0.75rem', color: '#a78bfa',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
              opacity: 0.8, transition: 'opacity 0.2s',
            }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                fontSize: '1.5rem', marginBottom: '6px',
              }}>✅</div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(78,72,112,0.8)' }}>All products well stocked</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {outOfStock.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.08)',
                  marginBottom: '4px',
                }}>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#f1f0ff', fontWeight: 500 }}>{p.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(78,72,112,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>{p.sku}</p>
                  </div>
                  <span className="badge-danger">Out of stock</span>
                </div>
              ))}
              {lowStock.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.08)',
                  marginBottom: '4px',
                }}>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#f1f0ff', fontWeight: 500 }}>{p.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(78,72,112,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>{p.sku}</p>
                  </div>
                  <span className="badge-warning">{p.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingCart size={13} color="#a78bfa" />
              </div>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f0ff' }}>Recent Orders</h2>
            </div>
            <Link to="/orders" style={{
              fontSize: '0.75rem', color: '#a78bfa', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8,
            }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📦</div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(78,72,112,0.8)' }}>No orders yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid transparent',
                    textDecoration: 'none', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.07)'
                    e.currentTarget.style.border = '1px solid rgba(124,58,237,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.border = '1px solid transparent'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#f1f0ff', fontWeight: 500 }}>
                      Order <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#a78bfa', fontSize: '0.75rem' }}>#{String(order.id).padStart(4, '0')}</span>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(78,72,112,0.8)', marginTop: '1px' }}>
                      {order.customer?.name || `Customer #${order.customer_id}`}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8125rem', fontWeight: 600, color: '#22d3ee',
                  }}>
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