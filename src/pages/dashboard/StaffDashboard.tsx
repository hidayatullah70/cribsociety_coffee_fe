import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Flame,
} from 'lucide-react';
import { apiClient } from '../../api';
import { Order, Product, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatIDR } from '../../utils/currency';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orderList, prodList] = await Promise.all([
        apiClient.getOrders(),
        apiClient.getProducts(),
      ]);
      setOrders(orderList);
      setProducts(prodList);
    } catch (err: any) {
      setError(err?.message || 'Failed to load shift information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, nextStatus);
      showToast('success', 'Status Updated', `Order #${orderId} changed to ${nextStatus}`);
      loadData();
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to update order status');
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      await apiClient.updateProduct(product.id, { available: !product.available });
      showToast(
        'info',
        'Catalog Updated',
        `${product.name} is now ${!product.available ? 'Available' : 'Unavailable'}`
      );
      loadData();
    } catch (err: any) {
      showToast('error', 'Failed', err?.message || 'Failed to toggle availability');
    }
  };

  const activeOrders = orders.filter(
    (o) => o.orderStatus === 'PAID' || o.orderStatus === 'PREPARING' || o.orderStatus === 'PENDING'
  );

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-brand-cream overflow-y-auto">
      {/* Header with Shift Snapshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">Staff Shift Station</Badge>
            <span className="text-xs text-utility-success font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-utility-success" />
              Active Shift
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight mt-1">
            COUNTER OPERATIONS
          </h1>
          <p className="text-xs text-brand-black/60">
            Welcome on bar, <span className="font-bold text-brand-black">{user?.name}</span>. Fast lane to POS and order preparation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/pos">
            <Button size="lg" variant="primary" className="font-bold flex items-center gap-2 shadow-lg shadow-brand-red/20">
              <ShoppingCart className="w-5 h-5" />
              <span>Open POS Cashier</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Shift Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red-soft text-brand-red flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-black/60 uppercase font-bold">Active Queue</span>
            <div className="text-2xl font-black text-brand-black">{activeOrders.length} orders</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-utility-success-soft text-utility-success flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-black/60 uppercase font-bold">Completed Today</span>
            <div className="text-2xl font-black text-brand-black">
              {orders.filter((o) => o.orderStatus === 'COMPLETED').length} orders
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-cream-dark text-brand-black flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-brand-black/60 uppercase font-bold">Shift Clock</span>
            <div className="text-2xl font-black text-brand-black">07:00 – 15:00</div>
          </div>
        </Card>
      </div>

      {/* Active Orders Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-brand-black tracking-tight">Active Prep Queue</h2>
            <Badge variant="brand" size="sm">{activeOrders.length}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} className="text-xs border-brand-cream-dark">
            Refresh Queue
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 space-y-3">
                <Skeleton className="w-1/2 h-5" />
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-1/3 h-8" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            type="error"
            title="Queue unavailable"
            description={error}
            actionLabel="Retry"
            onAction={loadData}
          />
        ) : activeOrders.length === 0 ? (
          <EmptyState
            type="empty"
            title="Prep queue is clear!"
            description="No active pending orders. All orders completed."
            actionLabel="Start New Sale in POS"
            onAction={() => (window.location.href = '/pos')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="p-5 flex flex-col justify-between space-y-4 border-2 border-brand-black/10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-brand-black font-mono">
                      #{order.orderNumber}
                    </span>
                    <Badge
                      variant={
                        order.orderStatus === 'PREPARING'
                          ? 'brand'
                          : order.orderStatus === 'PAID'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {order.orderStatus}
                    </Badge>
                  </div>

                  <div className="text-xs font-semibold text-brand-black">
                    Customer: {order.customerName || 'Counter'}
                  </div>

                  {/* Order items */}
                  <div className="space-y-1.5 pt-2 border-t border-brand-cream-dark/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs text-brand-black flex justify-between">
                        <span className="font-bold">
                          {item.quantity}x {item.name}
                          {item.variantName && (
                            <span className="font-normal text-brand-black/60"> ({item.variantName})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transition Action Buttons */}
                <div className="pt-3 border-t border-brand-cream-dark/60 flex items-center gap-2">
                  {order.orderStatus === 'PAID' || order.orderStatus === 'PENDING' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      className="w-full text-xs font-bold"
                    >
                      Start Brewing
                    </Button>
                  ) : order.orderStatus === 'PREPARING' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(order.id, 'READY')}
                      className="w-full text-xs font-bold bg-utility-success hover:bg-green-700"
                    >
                      Mark Ready for Counter
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Item Availability Controls */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark/60">
          <div>
            <h3 className="font-extrabold text-base text-brand-black">Quick Item Stock & Out-Of-Stock Switch</h3>
            <p className="text-xs text-brand-black/60">Toggle product availability immediately for POS</p>
          </div>
          <Link to="/inventory">
            <Button variant="outline" size="sm" className="text-xs border-brand-cream-dark">
              Full Inventory Table
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="p-3 rounded-xl border border-brand-cream-dark flex items-center justify-between bg-brand-cream-light"
            >
              <div className="min-w-0 pr-2">
                <h4 className="font-bold text-xs text-brand-black truncate">{prod.name}</h4>
                <span className="text-[10px] text-brand-black/60 font-mono">
                  {formatIDR(prod.price)}
                </span>
              </div>
              <button
                onClick={() => handleToggleProductAvailability(prod)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all min-h-[36px] ${
                  prod.available
                    ? 'bg-utility-success-soft text-utility-success border border-utility-success/30'
                    : 'bg-utility-danger-soft text-utility-danger border border-utility-danger/30'
                }`}
              >
                {prod.available ? 'In Stock' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
