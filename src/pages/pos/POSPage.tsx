import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  QrCode,
  CreditCard,
  Banknote,
  MoreHorizontal,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../api';
import { Product, ProductCategory, PaymentMethod } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ItemConfigModal } from './ItemConfigModal';
import { ReceiptModal } from './ReceiptModal';
import { formatIDR } from '../../utils/currency';
import { cn } from '../../utils/cn';

export const POSPage: React.FC = () => {
  const {
    items,
    customerName,
    discount,
    paymentMethod,
    subtotal,
    total,
    itemCount,
    addItem,
    updateQuantity,
    setCustomerName,
    setDiscount,
    setPaymentMethod,
    clearCart,
    lastCompletedOrder,
    setLastCompletedOrder,
  } = useCart();

  const { showToast } = useToast();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & UI States
  const [configuringProduct, setConfiguringProduct] = useState<Product | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  const loadCatalog = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err: any) {
      setError(err?.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (!product.available) {
      showToast('warning', 'Product Unavailable', `${product.name} is currently out of stock.`);
      return;
    }

    if (product.variants.length > 0 || product.addons.length > 0) {
      setConfiguringProduct(product);
    } else {
      addItem(product, null, []);
      showToast('success', 'Added to Order', product.name);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutError('Cart is empty. Please select products to begin.');
      return;
    }

    setCheckoutError(null);
    setIsProcessingCheckout(true);

    try {
      // 1. Create order
      const createdOrder = await apiClient.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variantId: i.variantId ?? null,
          addonIds: i.addonIds ?? [],
          note: i.note,
        })),
        discount: discount > 0 ? discount : null,
        customerName: customerName.trim() || 'Counter Customer',
      });

      // 2. Process simulated payment
      await apiClient.processPayment(createdOrder.id, {
        method: paymentMethod,
        amount: createdOrder.total,
      });

      // 3. Mark completed in state
      const finalOrder = {
        ...createdOrder,
        paymentStatus: 'paid' as const,
        orderStatus: 'PAID' as const,
        paymentMethod,
      };

      setLastCompletedOrder(finalOrder);
      setIsReceiptOpen(true);
      clearCart();
      setMobileCartOpen(false);
      showToast('success', 'Payment Successful', `Order #${finalOrder.orderNumber} completed.`);
    } catch (err: any) {
      const msg = err?.response?.error?.message || err?.message || 'Payment processing failed.';
      setCheckoutError(msg);
      showToast('error', 'Checkout Failed', msg);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'qris', label: 'QRIS QuickPay', icon: <QrCode className="w-4 h-4 text-brand-red" /> },
    { id: 'cash', label: 'Cash Tender', icon: <Banknote className="w-4 h-4 text-brand-red" /> },
    { id: 'card', label: 'Debit / Card', icon: <CreditCard className="w-4 h-4 text-brand-red" /> },
    { id: 'other', label: 'Other', icon: <MoreHorizontal className="w-4 h-4 text-brand-white/60" /> },
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-brand-black text-brand-white">
      {/* LEFT COLUMN: Catalog + Search */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top bar with search & quick title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-utility-success animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-brand-white/60">
                Live POS Counter
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              POINT OF SALE
            </h1>
          </div>

          {/* Search input */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search items by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="w-4 h-4 text-brand-red" />}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] border',
              selectedCategory === 'all'
                ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20'
                : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
            )}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] border',
                selectedCategory === cat.id
                  ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20'
                  : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-3 space-y-3">
                <Skeleton className="w-full h-28 rounded-lg" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            type="error"
            title="Failed to load items"
            description={error}
            actionLabel="Retry Loading"
            onAction={loadCatalog}
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            type="empty"
            title="No items found"
            description="Try changing category or searching for a different keyword."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-6">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                disabled={!product.available}
                className={cn(
                  'group flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-150 relative min-h-[140px] justify-between',
                  product.available
                    ? 'bg-brand-black-card border-brand-black-muted hover:border-brand-red hover:shadow-xl active:scale-[0.98]'
                    : 'bg-brand-black-soft/50 border-brand-black-muted opacity-50 cursor-not-allowed'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <Badge
                      variant={product.available ? 'brand' : 'danger'}
                      size="sm"
                      className="text-[9px]"
                    >
                      {product.available ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    {(product.variants.length > 0 || product.addons.length > 0) && (
                      <span className="text-[10px] font-bold text-brand-red flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-brand-red" />
                        <span>Options</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm text-white group-hover:text-brand-red transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-brand-black-muted flex items-center justify-between mt-3">
                  <span className="font-extrabold text-sm text-white font-mono">
                    {formatIDR(product.price)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-brand-black-soft border border-brand-black-muted group-hover:bg-brand-red group-hover:text-white flex items-center justify-center text-brand-red transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Persistent Desktop Cart & Drawer on Mobile */}
      <div
        className={cn(
          'w-full lg:w-96 xl:w-[420px] bg-brand-black-card border-l border-brand-black-muted flex flex-col justify-between shrink-0 shadow-2xl lg:shadow-none z-30',
          'fixed lg:static inset-y-0 right-0 transition-transform duration-300',
          mobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-brand-black-muted flex items-center justify-between bg-brand-black-card">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold shadow-md shadow-brand-red/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white leading-tight">Current Order</h2>
              <span className="text-xs text-brand-white/60 font-semibold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 rounded-lg text-brand-white/40 hover:text-brand-red hover:bg-brand-black-soft transition-colors text-xs font-semibold flex items-center gap-1"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4 text-brand-red" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={() => setMobileCartOpen(false)}
              className="lg:hidden p-2 rounded-lg text-brand-white/60 hover:bg-brand-black-soft text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>

        {/* Customer Name Input */}
        <div className="px-4 py-3 bg-brand-black-soft border-b border-brand-black-muted">
          <Input
            placeholder="Customer Name / Table (e.g. Rayhan)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-brand-black-card text-xs py-2"
          />
        </div>

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-brand-white/50">
              <div className="w-14 h-14 rounded-2xl bg-brand-black-soft flex items-center justify-center border border-brand-black-muted">
                <ShoppingCart className="w-7 h-7 text-brand-red" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Order Cart is Empty</p>
                <p className="text-xs text-brand-white/50 mt-1">
                  Tap any available product on the left catalog to start building the order.
                </p>
              </div>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3.5 rounded-xl bg-brand-black-soft border border-brand-black-muted flex flex-col gap-2 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-xs text-white leading-snug">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[10px] font-semibold text-brand-red block">
                        Size: {item.variantName}
                      </span>
                    )}
                    {item.addonNames && item.addonNames.length > 0 && (
                      <span className="text-[10px] text-brand-white/60 block">
                        +{item.addonNames.join(', ')}
                      </span>
                    )}
                    {item.note && (
                      <span className="text-[10px] italic text-brand-white/50 block">
                        Note: {item.note}
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-xs text-white whitespace-nowrap font-mono">
                    {formatIDR(item.itemTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-brand-black-muted">
                  <span className="text-[10px] text-brand-white/50 font-mono">
                    {formatIDR((item.itemTotal / item.quantity))} each
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-brand-black-card rounded-lg border border-brand-black-muted p-0.5">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-brand-red hover:bg-brand-black-elevate transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-brand-red hover:bg-brand-black-elevate transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary, Discounts, Payment Selector & Checkout Action */}
        <div className="p-4 sm:p-5 border-t border-brand-black-muted bg-brand-black-card space-y-4">
          {/* Quick Discount Presets */}
          {items.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-brand-white/60">
                <span>Discount / Voucher</span>
                {discount > 0 && (
                  <button
                    onClick={() => setDiscount(0)}
                    className="text-brand-red hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'None', val: 0 },
                  { label: 'Rp 5k', val: 5000 },
                  { label: 'Rp 10k', val: 10000 },
                  { label: '10%', val: Math.round(subtotal * 0.1) },
                ].map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDiscount(d.val)}
                    className={cn(
                      'py-1.5 rounded-lg text-[11px] font-bold border transition-all',
                      discount === d.val
                        ? 'border-brand-red bg-brand-red-soft text-brand-red shadow-sm shadow-brand-red/10'
                        : 'border-brand-black-muted bg-brand-black-soft text-brand-white/70 hover:bg-brand-black-elevate hover:text-white'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-white/60">
              Payment Method
            </span>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={cn(
                      'flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-bold transition-all min-h-[44px]',
                      isSelected
                        ? 'border-brand-red bg-brand-red-soft text-brand-red shadow-sm shadow-brand-red/20'
                        : 'border-brand-black-muted bg-brand-black-soft text-brand-white/80 hover:border-brand-red/50 hover:bg-brand-black-elevate'
                    )}
                  >
                    {pm.icon}
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-brand-black-muted text-xs">
            <div className="flex justify-between text-brand-white/70">
              <span>Subtotal:</span>
              <span className="font-semibold font-mono text-white">{formatIDR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-red font-semibold">
                <span>Discount Applied:</span>
                <span className="font-mono">-{formatIDR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline text-base sm:text-lg font-black text-white pt-1">
              <span>TOTAL DUE:</span>
              <span className="text-xl sm:text-2xl text-brand-red font-mono">{formatIDR(total)}</span>
            </div>
          </div>

          {checkoutError && (
            <div className="p-3 rounded-xl bg-utility-danger-soft border border-utility-danger/40 text-xs text-utility-danger flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-red" />
              <span className="font-semibold">{checkoutError}</span>
            </div>
          )}

          {/* Primary Checkout Button */}
          <Button
            variant="primary"
            size="lg"
            disabled={items.length === 0 || isProcessingCheckout}
            isLoading={isProcessingCheckout}
            onClick={handleCheckout}
            className="w-full font-bold text-base py-4 flex items-center justify-center gap-2 shadow-xl shadow-brand-red/25"
          >
            <span>Charge {formatIDR(total)}</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* MOBILE FLOATING CART BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-3 bg-brand-black-card text-brand-white border-t border-brand-black-muted z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center font-bold shadow-md shadow-brand-red/30">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-brand-white/80">{itemCount} items</div>
            <div className="text-base font-extrabold text-brand-red font-mono">{formatIDR(total)}</div>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setMobileCartOpen(true)}
          className="font-bold flex items-center gap-2 px-5 shadow-md shadow-brand-red/20"
        >
          <span>View Cart & Charge</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Item Customizer Modal */}
      <ItemConfigModal
        product={configuringProduct}
        isOpen={!!configuringProduct}
        onClose={() => setConfiguringProduct(null)}
        onAddToCart={(prod, variant, addons, note) => {
          addItem(prod, variant, addons, note);
          showToast('success', 'Added to Order', `${prod.name} customized.`);
        }}
      />

      {/* Receipt / Order Completed Modal */}
      <ReceiptModal
        order={lastCompletedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onNewOrder={() => {
          clearCart();
          setLastCompletedOrder(null);
        }}
      />
    </div>
  );
};
