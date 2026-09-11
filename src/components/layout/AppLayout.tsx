import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  UserCheck,
  Store,
  Shield,
  ArrowRightLeft,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOwner = user?.role === 'owner';
  const isGuest = user?.role === 'guest';

  const navItems = isGuest
    ? [
        {
          label: 'Live Order Board',
          path: '/dashboard/guest',
          icon: <LayoutDashboard className="w-5 h-5" />,
          badge: 'Live',
        },
        {
          label: 'POS Counter',
          path: '/pos',
          icon: <ShoppingCart className="w-5 h-5" />,
          badge: 'Order',
        },
      ]
    : [
        {
          label: 'POS Counter',
          path: '/pos',
          icon: <ShoppingCart className="w-5 h-5" />,
          badge: 'Fast',
        },
        {
          label: isOwner ? 'Owner Dashboard' : 'Staff Operations',
          path: isOwner ? '/dashboard/owner' : '/dashboard/staff',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: 'Active Orders',
          path: '/orders',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: 'Inventory',
          path: '/inventory',
          icon: <Package className="w-5 h-5" />,
        },
        {
          label: 'Products & Menu',
          path: '/products',
          icon: <Coffee className="w-5 h-5" />,
          badge: isOwner ? 'CRUD' : undefined,
        },
        ...(isOwner
          ? [
              {
                label: 'Staff Roster',
                path: '/staff',
                icon: <Users className="w-5 h-5" />,
              },
            ]
          : []),
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleRole = () => {
    if (user?.role === 'owner') {
      switchRole('staff');
      navigate('/dashboard/staff');
    } else if (user?.role === 'staff') {
      switchRole('guest');
      navigate('/dashboard/guest');
    } else {
      switchRole('owner');
      navigate('/dashboard/owner');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row text-brand-white">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-brand-black-soft text-brand-white px-4 py-3 flex items-center justify-between border-b border-brand-black-muted sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="cribsociety_coffee" className="h-7 w-auto object-contain" />
          <span className="font-extrabold tracking-tight text-sm text-white lowercase">cribsociety_coffee</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant={isOwner ? 'brand' : 'neutral'} size="sm">
            {user?.role || 'Guest'}
          </Badge>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-brand-red hover:bg-brand-black-card"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-black text-brand-white border-r border-brand-black-muted shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-black-muted flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="cribsociety_coffee" className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-sm tracking-tight text-white lowercase">
              cribsociety_coffee
            </span>
          </Link>
        </div>

        {/* User Context & Role Switcher */}
        <div className="px-4 py-3 bg-brand-black-soft border-b border-brand-black-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-red-soft text-brand-red border border-brand-red/30 flex items-center justify-center font-bold text-xs shrink-0">
                <UserCheck className="w-4 h-4 text-brand-red" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold truncate text-white">{user?.name}</div>
                <div className="text-[10px] text-brand-white/60 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-brand-red" />
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleRole}
              title="Dev Role Switcher (Owner <-> Staff <-> Guest)"
              className="p-1.5 rounded-lg text-brand-red hover:text-white hover:bg-brand-black-card transition-colors text-xs flex items-center gap-1 border border-brand-black-muted"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-white/40 px-3 py-1">
            Operations
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150',
                  isActive
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25 font-bold'
                    : 'text-brand-white/70 hover:text-white hover:bg-brand-black-soft'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-brand-red'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide',
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-red-soft text-brand-red border border-brand-red/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-brand-white/40 px-3 py-1">
            Public Storefront
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-brand-white/70 hover:text-white hover:bg-brand-black-soft transition-colors"
          >
            <Store className="w-5 h-5 text-brand-red" />
            <span>Store Landing Page</span>
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-black-muted flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-brand-white/80 hover:text-white hover:bg-brand-black-soft flex items-center justify-center gap-2 border-brand-black-muted"
          >
            <LogOut className="w-4 h-4 text-brand-red" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-brand-black text-brand-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-brand-black-muted">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="cribsociety_coffee" className="h-8 w-auto object-contain" />
                <span className="font-bold text-base text-white lowercase">cribsociety_coffee</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-brand-red hover:bg-brand-black-card"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4">
              <div className="text-xs text-brand-white/50 mb-2 font-semibold uppercase">Active Session</div>
              <div className="p-3 bg-brand-black-card rounded-xl border border-brand-black-muted flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-brand-red uppercase font-bold">{user?.role}</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleToggleRole} className="text-xs text-white border-brand-black-muted">
                  Switch Role
                </Button>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-black-card text-brand-white font-medium border border-brand-black-muted"
                >
                  <span className="text-brand-red">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-black-card text-brand-white font-medium border border-brand-black-muted"
              >
                <Store className="w-5 h-5 text-brand-red" />
                <span>Visit Landing Page</span>
              </Link>
            </nav>
          </div>

          <div className="pt-6">
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 font-bold"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen bg-brand-black text-brand-white">
        {children}
      </main>
    </div>
  );
};
