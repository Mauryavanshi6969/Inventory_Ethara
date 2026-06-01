import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Menu,
  Boxes,
  Zap,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products',  label: 'Products',  icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders',    label: 'Orders',    icon: ShoppingCart },
]

const SIDEBAR_W = 240

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const location = useLocation()
  const currentPage = navItems.find(n => location.pathname.startsWith(n.to))?.label || 'Dashboard'

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 20,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100%', width: '240px',
        background: 'rgba(8, 5, 26, 0.92)',
        borderRight: '1px solid rgba(124, 58, 237, 0.12)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 30,
        display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease',
      }}
      className={`lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
            flexShrink: 0,
          }}>
            <Boxes size={18} color="#fff" />
          </div>
          <div>
            <span style={{
              fontWeight: 700, fontSize: '0.9375rem',
              color: '#f1f0ff', letterSpacing: '-0.02em',
            }}>Inventory</span>
            <span style={{
              fontWeight: 700, fontSize: '0.9375rem',
              background: 'linear-gradient(90deg, #a78bfa, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>Ethara</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                color: isActive ? '#a78bfa' : 'rgba(148,137,186,0.8)',
                border: isActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.1)' : 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '7px',
                    background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                  }}>
                    <Icon size={15} />
                  </div>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Zap size={11} color="rgba(124,58,237,0.6)" />
          <span style={{ fontSize: '0.7rem', color: 'rgba(78,72,112,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>
            v1.0.0
          </span>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: isDesktop ? `${SIDEBAR_W}px` : '0' }}>
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(8,5,26,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '0 24px',
          height: '56px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '6px 8px', cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 8px rgba(124,58,237,0.6)',
            }} />
            <h1 style={{
              fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.01em',
            }}>{currentPage}</h1>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '4px 10px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '99px',
              fontSize: '0.7rem', fontWeight: 600,
              color: '#34d399',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 6px #34d399',
              }} />
              Live
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px' }} className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}