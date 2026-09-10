import React, { useState, useEffect } from 'react';
import {
  Eye,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../api';
import { Order, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatIDR } from '../../utils/currency';
import { cn } from '../../utils/cn';

export const OrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, status);
      showToast('success', 'Order Status Updated', `Order marked as ${status}`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: status } : null);
      }
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to update order');
    }
  };

  const statusFilters = ['ALL', 'PENDING', 'PAID', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.orderStatus === selectedStatus);

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, { variant: 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'; label: string }> = {
      PENDING: { variant: 'warning', label: 'Pending Payment' },
      PAID: { variant: 'info', label: 'Paid / Queue' },
      PREPARING: { variant: 'brand', label: 'Preparing' },
      READY: { variant: 'success', label: 'Ready for Pickup' },
      COMPLETED: { variant: 'neutral', label: 'Completed' },
      CANCELLED: { variant: 'danger', label: 'Cancelled' },
    };
    const conf = map[status] || { variant: 'neutral', label: status };
    return <Badge variant={conf.variant} size="sm">{conf.label}</Badge>;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-brand-cream overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">Order Stream</Badge>
            <span className="text-xs text-brand-black/60 font-semibold">{orders.length} total orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight mt-1">
            KITCHEN & COUNTER ORDERS
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOrders}
          className="flex items-center gap-2 border-brand-cream-dark self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px]',
              selectedStatus === s
                ? 'bg-brand-black text-brand-white shadow-sm'
                : 'bg-brand-white border border-brand-cream-dark text-brand-black hover:bg-brand-cream'
            )}
          >
            {s === 'ALL' ? 'All Orders' : s} (
            {s === 'ALL' ? orders.length : orders.filter((o) => o.orderStatus === s).length})
          </button>
        ))}
      </div>

      {/* Content Table / Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="w-full h-8" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          type="error"
          title="Failed to load orders"
          description={error}
          actionLabel="Try Again"
          onAction={loadOrders}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          type="empty"
          title="No orders found"
          description={`No orders matching "${selectedStatus}" filter.`}
          actionLabel="Show All Orders"
          onAction={() => setSelectedStatus('ALL')}
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-black/40 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-extrabold text-base text-brand-black">
                    #{order.orderNumber}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                  <span className="text-xs text-brand-black/50 font-medium">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs font-semibold text-brand-black">
                  Customer: <span className="font-bold">{order.customerName || 'Counter Customer'}</span>
                </div>

                <div className="text-xs text-brand-black/70">
                  {order.items.map((i) => `${i.quantity}x ${i.name}${i.variantName ? ` (${i.variantName})` : ''}`).join(' • ')}
                </div>
              </div>

              {/* Order total & actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-brand-cream-dark">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-brand-black/50 block">Amount</span>
                  <span className="font-extrabold text-base text-brand-black font-mono">
                    {formatIDR(order.total)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                    className="text-xs font-bold border-brand-cream-dark flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </Button>

                  {/* Contextual fast status action */}
                  {order.orderStatus === 'PAID' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      className="text-xs font-bold"
                    >
                      Start Prep
                    </Button>
                  )}
                  {order.orderStatus === 'PREPARING' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      className="text-xs font-bold bg-utility-success hover:bg-green-700"
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.orderStatus === 'READY' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="text-xs font-bold"
                    >
                      Complete Handout
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          description={`Placed on ${new Date(selectedOrder.createdAt).toLocaleString()}`}
          size="md"
        >
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between p-3 bg-brand-cream rounded-xl border border-brand-cream-dark">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-black/50 block">Current Status</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-black/50 block">Payment</span>
                <span className="text-xs font-bold uppercase text-brand-black">
                  {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod || 'QRIS'})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-black">
                Ordered Items Breakdown
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-brand-cream-light border border-brand-cream-dark flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-brand-black">
                        {item.quantity}x {item.name}
                      </div>
                      {item.variantName && (
                        <div className="text-[11px] text-brand-red">Size: {item.variantName}</div>
                      )}
                      {item.addonNames && item.addonNames.length > 0 && (
                        <div className="text-[11px] text-brand-black/60">
                          Addons: {item.addonNames.join(', ')}
                        </div>
                      )}
                      {item.note && (
                        <div className="text-[11px] italic text-brand-black/50">Note: {item.note}</div>
                      )}
                    </div>
                    <span className="font-extrabold text-brand-black">{formatIDR(item.itemTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="pt-3 border-t border-brand-cream-dark space-y-2">
              <span className="text-xs font-bold text-brand-black block">Change Order Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['PENDING', 'PAID', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                      selectedOrder.orderStatus === st
                        ? 'bg-brand-black text-white border-brand-black'
                        : 'bg-brand-white border-brand-cream-dark text-brand-black hover:bg-brand-cream'
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
