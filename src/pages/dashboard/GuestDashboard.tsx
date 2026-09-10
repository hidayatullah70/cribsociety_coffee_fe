import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  Search,
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { apiClient } from '../../api';
import { Order, Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatIDR } from '../../utils/currency';

export const GuestDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orderList, prodList] = await Promise.all([
        apiClient.getOrders(),
        apiClient.getProducts(),
      ]);
      setOrders(orderList);
      setProducts(prodList);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 10 seconds for live counter display
    const timer = setInterval(() => {
      apiClient.getOrders().then(setOrders).catch(() => {});
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const query = searchOrderNumber.trim().toUpperCase().replace('#', '');
    if (!query) {
      setTrackedOrder(null);
      return;
    }

    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase().includes(query) ||
        (o.customerName && o.customerName.toUpperCase().includes(query))
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackedOrder(null);
      setSearchError(`No order found matching "${searchOrderNumber}". Please verify your receipt order number.`);
    }
  };

  const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING' || o.orderStatus === 'PAID');
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 bg-brand-cream overflow-y-auto">
      {/* Top Banner / Customer Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">Guest / Customer Board</Badge>
            <span className="text-xs text-brand-black/60 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-utility-success animate-pulse" />
              Live Queue Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight mt-1">
            ORDER STATUS & QUEUE
          </h1>
          <p className="text-xs sm:text-sm text-brand-black/60">
            Real-time counter progress. Watch for your order number to collect at the bar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="flex items-center gap-2 border-brand-cream-dark"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live</span>
          </Button>
          <Link to="/pos">
            <Button size="sm" variant="primary" className="font-bold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Order at Counter</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Order Lookup Form */}
      <Card className="p-5 sm:p-6 bg-brand-white border-2 border-brand-black shadow-lg">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5 mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Find My Order Status</span>
          </span>
          <h3 className="font-extrabold text-lg text-brand-black">
            Track with your Receipt Number
          </h3>
          <p className="text-xs text-brand-black/60 mt-0.5">
            Enter your order number (e.g. <code>CSC-1001</code>) or your customer name.
          </p>

          <form onSubmit={handleTrackOrder} className="flex gap-2 mt-4">
            <div className="flex-1">
              <Input
                placeholder="e.g. CSC-1001 or Rayhan..."
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                className="font-mono text-sm py-2.5"
              />
            </div>
            <Button type="submit" variant="secondary" className="font-bold px-5">
              Track
            </Button>
          </form>

          {searchError && (
            <p className="text-xs font-semibold text-utility-danger mt-2">{searchError}</p>
          )}

          {/* Tracked Order Result Card */}
          {trackedOrder && (
            <div className="mt-4 p-4 rounded-xl bg-brand-cream-light border-2 border-brand-red/40 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-lg text-brand-black">
                    #{trackedOrder.orderNumber}
                  </span>
                  <span className="text-xs text-brand-black/70 ml-2 font-semibold">
                    ({trackedOrder.customerName || 'Counter Customer'})
                  </span>
                </div>
                <Badge
                  variant={
                    trackedOrder.orderStatus === 'READY'
                      ? 'success'
                      : trackedOrder.orderStatus === 'PREPARING'
                      ? 'brand'
                      : trackedOrder.orderStatus === 'COMPLETED'
                      ? 'neutral'
                      : 'warning'
                  }
                  size="md"
                >
                  {trackedOrder.orderStatus === 'READY' ? 'READY FOR PICKUP' : trackedOrder.orderStatus}
                </Badge>
              </div>

              <div className="mt-2 text-xs text-brand-black/80 space-y-1">
                {trackedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.quantity}x {i.name} {i.variantName ? `(${i.variantName})` : ''}
                    </span>
                    <span className="font-mono font-bold">{formatIDR(i.itemTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-brand-cream-dark/60 flex items-center justify-between text-xs">
                <span className="font-bold text-brand-black">Total Paid: {formatIDR(trackedOrder.total)}</span>
                <span className="text-brand-black/50">
                  {new Date(trackedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* LIVE QUEUE DISPLAY BOARD (Split into Preparing vs Ready) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Now Preparing / Brewing */}
        <Card className="p-6 border-2 border-brand-red/30 bg-brand-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-red-soft text-brand-red flex items-center justify-center font-bold">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-lg text-brand-black">NOW BREWING</h3>
                <span className="text-xs text-brand-black/60 font-semibold">In preparation by Baristas</span>
              </div>
            </div>
            <Badge variant="brand" size="md">{preparingOrders.length} In Queue</Badge>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : preparingOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-brand-black/50">
              No orders currently brewing. Baristas ready for new orders!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-brand-cream border border-brand-cream-dark flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono text-brand-black">
                      #{order.orderNumber}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                  </div>
                  <span className="text-xs font-bold text-brand-black/80 truncate mt-1">
                    {order.customerName || 'Counter'}
                  </span>
                  <span className="text-[11px] text-brand-black/60 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Column 2: Ready for Pickup */}
        <Card className="p-6 border-2 border-utility-success/40 bg-brand-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-cream-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-utility-success-soft text-utility-success flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-brand-black">READY FOR PICKUP</h3>
                <span className="text-xs text-brand-black/60 font-semibold">Please collect at the counter bar</span>
              </div>
            </div>
            <Badge variant="success" size="md">{readyOrders.length} Ready</Badge>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : readyOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-brand-black/50">
              No orders waiting for pickup right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-utility-success-soft border border-utility-success/30 flex flex-col justify-between animate-bounce-short"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-utility-success">
                      #{order.orderNumber}
                    </span>
                    <Badge variant="success" size="sm">PICKUP</Badge>
                  </div>
                  <span className="text-sm font-black text-brand-black truncate mt-1">
                    {order.customerName || 'Counter'}
                  </span>
                  <span className="text-[11px] text-utility-success font-semibold mt-1">
                    Ready at Counter Bar
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Live Digital Menu Spotlight */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-cream-dark gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5">
              <Coffee className="w-4 h-4" />
              <span>Live Menu Availability</span>
            </span>
            <h3 className="font-extrabold text-base text-brand-black mt-0.5">
              Today's Barista Catalog
            </h3>
          </div>
          <Link to="/" className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1">
            <span>Explore Full Story & Store Info</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-xl bg-brand-cream-light border border-brand-cream-dark flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant={product.available ? 'success' : 'danger'} size="sm">
                    {product.available ? 'Available' : 'Sold Out'}
                  </Badge>
                  <span className="font-mono font-bold text-xs text-brand-black">
                    {formatIDR(product.price)}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-brand-black">{product.name}</h4>
                <p className="text-[11px] text-brand-black/60 line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              <div className="pt-2 border-t border-brand-cream-dark/60 text-[10px] text-brand-black/50 flex justify-between items-center">
                <span>{product.variants.length > 0 ? `${product.variants.length} Sizes` : 'Single'}</span>
                <Link to="/pos" className="text-brand-red font-bold hover:underline">
                  Order in POS →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
