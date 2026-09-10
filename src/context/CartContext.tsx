import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { OrderItem, Product, ProductVariant, ProductAddon, PaymentMethod, Order } from '../types';

interface CartContextValue {
  items: OrderItem[];
  customerName: string;
  discount: number;
  paymentMethod: PaymentMethod;
  subtotal: number;
  total: number;
  itemCount: number;
  addItem: (product: Product, variant?: ProductVariant | null, addons?: ProductAddon[], note?: string) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  setCustomerName: (name: string) => void;
  setDiscount: (discount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const addItem = useCallback(
    (product: Product, variant?: ProductVariant | null, addons: ProductAddon[] = [], note?: string) => {
      const variantDelta = variant?.priceDelta ?? 0;
      const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = product.price + variantDelta + addonsTotal;

      const addonIds = addons.map((a) => a.id).sort();
      const addonNames = addons.map((a) => a.name);

      setItems((prev) => {
        // Find if identical item + variant + addons already exists in cart
        const existingIdx = prev.findIndex(
          (item) =>
            item.productId === product.id &&
            item.variantId === (variant?.id ?? null) &&
            JSON.stringify(item.addonIds?.sort() || []) === JSON.stringify(addonIds) &&
            (item.note || '') === (note || '')
        );

        if (existingIdx > -1) {
          const updated = [...prev];
          const current = updated[existingIdx];
          const newQty = current.quantity + 1;
          updated[existingIdx] = {
            ...current,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
          return updated;
        }

        const newItem: OrderItem = {
          id: `item_${Date.now()}_${Math.random()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          variantId: variant?.id ?? null,
          variantName: variant?.name ?? null,
          variantPriceDelta: variantDelta,
          addonIds,
          addonNames,
          addonPriceTotal: addonsTotal,
          itemTotal: unitPrice,
          note,
        };
        return [...prev, newItem];
      });
    },
    []
  );

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, idx) => idx !== index);
      }
      const updated = [...prev];
      const item = updated[index];
      const unitPrice = (item.price + (item.variantPriceDelta || 0) + (item.addonPriceTotal || 0));
      updated[index] = {
        ...item,
        quantity,
        itemTotal: unitPrice * quantity,
      };
      return updated;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerName('');
    setDiscount(0);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [items]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        customerName,
        discount,
        paymentMethod,
        subtotal,
        total,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        setCustomerName,
        setDiscount,
        setPaymentMethod,
        clearCart,
        lastCompletedOrder,
        setLastCompletedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
