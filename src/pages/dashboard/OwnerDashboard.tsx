import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShoppingCart,
  Package,
  FileText,
} from 'lucide-react';
import { apiClient } from '../../api';
import { DashboardSummary, Order, InventoryItem } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatIDR } from '../../utils/currency';

export const OwnerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sum, orders, inv] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getOrders(),
        apiClient.getInventory(),
      ]);
      setSummary(sum);
      setRecentOrders(orders.slice(0, 5));
      setLowStockItems(
        inv.filter((i) => i.quantity <= i.lowStockThreshold || !i.available)
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-brand-cream overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">Owner Scope</Badge>
            <span className="text-xs text-brand-black/60 font-medium">Daily Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight mt-1">
            EXECUTIVE DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/pos">
            <Button size="sm" variant="primary" className="flex items-center gap-2 font-bold">
              <ShoppingCart className="w-4 h-4" />
              <span>Launch POS</span>
            </Button>
          </Link>
          <Link to="/inventory">
            <Button size="sm" variant="outline" className="border-brand-cream-dark">
              <Package className="w-4 h-4 mr-1.5" />
              <span>Manage Stock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Alert Strip */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-utility-warning-soft border border-utility-warning/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-utility-warning text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-brand-black uppercase tracking-wider">
                Inventory Alert: {lowStockItems.length} Products Require Attention
              </h4>
              <p className="text-xs text-brand-black/70 mt-0.5">
                {lowStockItems.map((i) => `${i.productName} (${i.quantity} left)`).join(' • ')}
              </p>
            </div>
          </div>
          <Link to="/inventory">
            <Button size="sm" variant="outline" className="text-xs border-utility-warning/40 bg-white hover:bg-brand-cream whitespace-nowrap">
              Restock Now
            </Button>
          </Link>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-1/3 h-3" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          type="error"
          title="Dashboard unavailable"
          description={error}
          actionLabel="Retry Loading Metrics"
          onAction={loadData}
        />
      ) : summary ? (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Today's Revenue"
              value={formatIDR(summary.revenue)}
              icon={<DollarSign className="w-5 h-5 text-brand-red" />}
              trend={{ value: '+14.2%', isPositive: true }}
              subtitle="vs. yesterday"
            />
            <StatCard
              title="Completed Orders"
              value={summary.orders}
              icon={<ShoppingBag className="w-5 h-5 text-brand-black" />}
              trend={{ value: '+8 orders', isPositive: true }}
              subtitle="active flow"
            />
            <StatCard
              title="Avg Order Value (AOV)"
              value={formatIDR(summary.averageOrderValue)}
              icon={<TrendingUp className="w-5 h-5 text-utility-success" />}
              subtitle="healthy basket size"
            />
            <StatCard
              title="Stock Attention"
              value={`${summary.lowStockCount} items`}
              icon={<AlertTriangle className="w-5 h-5 text-utility-warning" />}
              subtitle="low or zero stock"
            />
          </div>

          {/* Section: Hourly Sales Visualizer + Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hourly Sales Rhythm */}
            <Card className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark/60">
                <div>
                  <h3 className="font-extrabold text-base text-brand-black">Hourly Sales Cadence</h3>
                  <p className="text-xs text-brand-black/60">Today's hourly transaction volume</p>
                </div>
                <Badge variant="neutral" size="sm">Peak: 12:00 PM</Badge>
              </div>

              <div className="space-y-3 pt-2">
                {summary.hourlySales?.map((h, idx) => {
                  const maxVal = 1000000;
                  const pct = Math.min(100, Math.round((h.total / maxVal) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-brand-black">
                        <span className="font-mono text-brand-black/70">{h.hour}</span>
                        <span>{formatIDR(h.total)}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-brand-cream-dark/50 overflow-hidden">
                        <div
                          className="h-full bg-brand-red rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick Actions & Staff Snapshot */}
            <Card className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark/60">
                <div>
                  <h3 className="font-extrabold text-base text-brand-black">Operations Control</h3>
                  <p className="text-xs text-brand-black/60">Quick system shortcuts</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-brand-cream-dark hover:border-brand-black/40 hover:bg-brand-cream transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-red-soft text-brand-red flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-brand-black group-hover:text-brand-red">
                        Order Kitchen Queue
                      </h4>
                      <p className="text-[11px] text-brand-black/60">View pending, preparing & completed</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black" />
                </Link>

                <Link
                  to="/inventory"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-brand-cream-dark hover:border-brand-black/40 hover:bg-brand-cream transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-cream text-brand-black flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-brand-black group-hover:text-brand-red">
                        Inventory & Catalog Matrix
                      </h4>
                      <p className="text-[11px] text-brand-black/60">Adjust beans, cups & pastry stocks</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-black/40 group-hover:text-brand-black" />
                </Link>
              </div>

              {/* Active Baristas */}
              <div className="pt-2 border-t border-brand-cream-dark/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-black/60 mb-2">
                  Active Staff On Duty
                </h4>
                <div className="p-3 rounded-xl bg-brand-cream-light border border-brand-cream-dark flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-bold text-xs">
                      FB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-black">Farhan (Head Barista)</div>
                      <div className="text-[10px] text-utility-success font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-utility-success" />
                        <span>Shift Active (Counter Station)</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">Staff</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark/60">
              <div>
                <h3 className="font-extrabold text-base text-brand-black">Latest Counter Transactions</h3>
                <p className="text-xs text-brand-black/60">Live orders captured through POS</p>
              </div>
              <Link to="/orders">
                <Button variant="outline" size="sm" className="text-xs border-brand-cream-dark">
                  View All Orders
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-cream-dark text-brand-black/60 uppercase font-bold text-[10px] tracking-wider">
                    <th className="pb-3 pr-4">Order #</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Items</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-dark/60 font-medium">
                  {recentOrders.map((order) => {
                    const statusColors: Record<string, 'brand' | 'success' | 'warning' | 'info' | 'neutral'> = {
                      PENDING: 'warning',
                      PAID: 'info',
                      PREPARING: 'brand',
                      READY: 'success',
                      COMPLETED: 'neutral',
                      CANCELLED: 'danger' as any,
                    };

                    return (
                      <tr key={order.id} className="hover:bg-brand-cream/40 transition-colors">
                        <td className="py-3 pr-4 font-mono font-bold text-brand-black">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-brand-black">
                          {order.customerName || 'Counter Customer'}
                        </td>
                        <td className="py-3 pr-4 text-brand-black/70">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-3 pr-4 font-extrabold text-brand-black font-mono">
                          {formatIDR(order.total)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant={statusColors[order.orderStatus] || 'neutral'} size="sm">
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-brand-black/50">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
