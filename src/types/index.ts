export type UserRole = 'owner' | 'staff' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Session {
  token: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  variants: ProductVariant[];
  addons: ProductAddon[];
  stockQuantity?: number;
  lowStockThreshold?: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type PaymentMethod = 'cash' | 'qris' | 'card' | 'other';

export interface OrderItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variantId?: string | null;
  variantName?: string | null;
  variantPriceDelta?: number;
  addonIds?: string[];
  addonNames?: string[];
  addonPriceTotal?: number;
  itemTotal: number;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number | null;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod?: PaymentMethod;
  customerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  items: {
    productId: string;
    quantity: number;
    variantId: string | null;
    addonIds: string[];
    note?: string;
  }[];
  discount: number | null;
  customerName?: string;
}

export interface PaymentRequest {
  method: PaymentMethod;
  amount: number;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'paid' | 'failed' | 'cancelled';
  paidAt: string;
  method?: PaymentMethod;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  available: boolean;
  lowStockThreshold: number;
  unit: string;
  lastUpdated: string;
}

export interface DashboardSummary {
  revenue: number;
  orders: number;
  averageOrderValue: number;
  lowStockCount: number;
  recentOrders?: Order[];
  hourlySales?: { hour: string; total: number }[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  activeShift: boolean;
  lastActive: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}
