import {
  User,
  AuthResponse,
  ProductCategory,
  Product,
  Order,
  CreateOrderPayload,
  PaymentRequest,
  PaymentResponse,
  InventoryItem,
  DashboardSummary,
  StaffMember,
  OrderStatus,
  ApiErrorResponse,
} from '../types';
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_INVENTORY,
  MOCK_STAFF,
  MOCK_DASHBOARD_SUMMARY,
} from '../mock/seedData';

// API Client stateful mock storage (in-memory persistent during browser session)
class MockDatabase {
  private categories: ProductCategory[] = [...MOCK_CATEGORIES];
  private products: Product[] = [...MOCK_PRODUCTS];
  private orders: Order[] = [...MOCK_ORDERS];
  private inventory: InventoryItem[] = [...MOCK_INVENTORY];
  private staff: StaffMember[] = [...MOCK_STAFF];
  private summary: DashboardSummary = { ...MOCK_DASHBOARD_SUMMARY };

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      sessionStorage.setItem('csc_orders_v3', JSON.stringify(this.orders));
      sessionStorage.setItem('csc_products_v3', JSON.stringify(this.products));
      sessionStorage.setItem('csc_inventory_v3', JSON.stringify(this.inventory));
    } catch {
      // ignore storage errors
    }
  }

  private loadFromStorage() {
    try {
      const storedOrders = sessionStorage.getItem('csc_orders_v3');
      if (storedOrders) this.orders = JSON.parse(storedOrders);

      const storedProducts = sessionStorage.getItem('csc_products_v3');
      if (storedProducts) {
        const parsed: Product[] = JSON.parse(storedProducts);
        this.products = parsed.map((p) => {
          const defaultProd = MOCK_PRODUCTS.find((m) => m.id === p.id);
          if (defaultProd && (!p.imageUrl || p.imageUrl.includes('1572442388796'))) {
            return { ...p, imageUrl: defaultProd.imageUrl };
          }
          return p;
        });
      }

      const storedInv = sessionStorage.getItem('csc_inventory_v3');
      if (storedInv) this.inventory = JSON.parse(storedInv);
    } catch {
      // fallback to initial mock
    }
  }

  // Auth
  async login(email: string, roleInput?: 'owner' | 'staff' | 'guest'): Promise<AuthResponse> {
    await this.delay(350);
    const normalized = email.toLowerCase().trim();
    const isOwner = roleInput === 'owner' || normalized.includes('owner');
    const isGuest = roleInput === 'guest' || normalized.includes('guest');

    const role: 'owner' | 'staff' | 'guest' = isGuest ? 'guest' : isOwner ? 'owner' : 'staff';
    const user: User = {
      id: isGuest ? 'usr_guest_1' : isOwner ? 'usr_owner_1' : 'usr_barista_1',
      name: isGuest ? 'Guest Customer' : isOwner ? 'Levi (Owner)' : 'Farhan (Barista)',
      email: isGuest ? 'guest@cribsociety.coffee' : normalized || (isOwner ? 'owner@cribsociety.coffee' : 'staff@cribsociety.coffee'),
      role,
    };
    return {
      user,
      session: {
        token: `mock_jwt_${user.id}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  async register(name: string, email: string, roleInput?: 'owner' | 'staff' | 'guest'): Promise<AuthResponse> {
    await this.delay(400);
    const normalized = email.toLowerCase().trim();
    const role: 'owner' | 'staff' | 'guest' = roleInput || 'guest';
    const user: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalized,
      role,
    };
    return {
      user,
      session: {
        token: `mock_jwt_${user.id}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      },
    };
  }


  // Menu
  async getCategories(): Promise<ProductCategory[]> {
    await this.delay(200);
    return [...this.categories];
  }

  async getProducts(categoryId?: string, available?: boolean): Promise<Product[]> {
    await this.delay(250);
    let list = [...this.products];
    if (categoryId) {
      list = list.filter((p) => p.categoryId === categoryId);
    }
    if (available !== undefined) {
      list = list.filter((p) => p.available === available);
    }
    return list;
  }

  async getProductById(id: string): Promise<Product> {
    await this.delay(150);
    const item = this.products.find((p) => p.id === id);
    if (!item) {
      this.throwError('RESOURCE_NOT_FOUND', `Product with id ${id} not found.`);
    }
    return item!;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await this.delay(250);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Product with id ${id} not found.`);
    }
    this.products[idx] = { ...this.products[idx], ...updates };
    this.saveToStorage();
    return this.products[idx];
  }

  async createProduct(payload: Omit<Product, 'id'>): Promise<Product> {
    await this.delay(300);
    const newProduct: Product = {
      ...payload,
      id: `prod_${Date.now()}`,
    };
    this.products.unshift(newProduct);
    // Also add to inventory
    const cat = this.categories.find((c) => c.id === newProduct.categoryId);
    this.inventory.unshift({
      id: `inv_${newProduct.id}`,
      productId: newProduct.id,
      productName: newProduct.name,
      categoryName: cat?.name || 'General',
      quantity: newProduct.stockQuantity ?? 25,
      available: newProduct.available,
      lowStockThreshold: newProduct.lowStockThreshold ?? 10,
      unit: ['cat_food', 'cat_snack', 'cat_addon'].includes(newProduct.categoryId) ? 'pcs' : 'cups',
      lastUpdated: new Date().toISOString(),
    });
    this.saveToStorage();
    return newProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delay(250);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Product with id ${id} not found.`);
    }
    this.products = this.products.filter((p) => p.id !== id);
    this.inventory = this.inventory.filter((i) => i.productId !== id);
    this.saveToStorage();
  }

  // Orders
  async getOrders(status?: OrderStatus): Promise<Order[]> {
    await this.delay(300);
    if (status) {
      return this.orders.filter((o) => o.orderStatus === status);
    }
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order> {
    await this.delay(200);
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      this.throwError('RESOURCE_NOT_FOUND', `Order with id ${id} not found.`);
    }
    return order!;
  }

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    await this.delay(350);
    if (!payload.items || payload.items.length === 0) {
      this.throwError('INVALID_INPUT', 'Cart is empty. Cannot place empty order.');
    }

    // Check availability
    for (const item of payload.items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (!prod || !prod.available) {
        this.throwError(
          'PRODUCT_UNAVAILABLE',
          `Product "${prod?.name || item.productId}" is currently unavailable.`
        );
      }
    }

    const orderNumber = `CSC-${1000 + this.orders.length + 1}`;
    const orderItems = payload.items.map((item) => {
      const prod = this.products.find((p) => p.id === item.productId)!;
      const variant = prod.variants.find((v) => v.id === item.variantId);
      const variantDelta = variant?.priceDelta ?? 0;
      const addons = prod.addons.filter((a) => item.addonIds.includes(a.id));
      const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = prod.price + variantDelta + addonsTotal;

      return {
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: item.quantity,
        variantId: item.variantId,
        variantName: variant?.name,
        variantPriceDelta: variantDelta,
        addonIds: item.addonIds,
        addonNames: addons.map((a) => a.name),
        addonPriceTotal: addonsTotal,
        itemTotal: unitPrice * item.quantity,
        note: item.note,
      };
    });

    const subtotal = orderItems.reduce((acc, item) => acc + item.itemTotal, 0);
    const discount = payload.discount ?? null;
    const total = Math.max(0, subtotal - (discount ?? 0));

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName: payload.customerName?.trim() || 'Counter Customer',
      items: orderItems,
      subtotal,
      discount,
      total,
      paymentStatus: 'pending',
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.delay(200);
    const idx = this.orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Order with id ${id} not found.`);
    }
    this.orders[idx].orderStatus = status;
    this.orders[idx].updatedAt = new Date().toISOString();
    this.saveToStorage();
    return this.orders[idx];
  }

  // Payment
  async processPayment(orderId: string, req: PaymentRequest): Promise<PaymentResponse> {
    await this.delay(450);
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Order with id ${orderId} not found.`);
    }

    const order = this.orders[idx];
    if (req.amount < order.total) {
      this.throwError('INSUFFICIENT_PAYMENT', 'Tendered amount is less than total bill.');
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'PAID';
    order.paymentMethod = req.method;
    this.saveToStorage();

    return {
      paymentId: `pay_${Date.now()}`,
      status: 'paid',
      paidAt: new Date().toISOString(),
      method: req.method,
    };
  }

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    await this.delay(200);
    return [...this.inventory];
  }

  async updateInventory(productId: string, quantity: number, available: boolean): Promise<InventoryItem> {
    await this.delay(250);
    const idx = this.inventory.findIndex((i) => i.productId === productId);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Inventory item for ${productId} not found.`);
    }
    this.inventory[idx].quantity = quantity;
    this.inventory[idx].available = available;
    this.inventory[idx].lastUpdated = new Date().toISOString();

    // Sync product availability
    const prodIdx = this.products.findIndex((p) => p.id === productId);
    if (prodIdx !== -1) {
      this.products[prodIdx].available = available;
      this.products[prodIdx].stockQuantity = quantity;
    }

    this.saveToStorage();
    return this.inventory[idx];
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    await this.delay(300);
    const lowStockCount = this.inventory.filter(
      (item) => item.quantity <= item.lowStockThreshold || !item.available
    ).length;

    const completedOrders = this.orders.filter((o) => o.paymentStatus === 'paid');
    const totalRev = completedOrders.reduce((acc, o) => acc + o.total, 0) + 2850000;
    const count = completedOrders.length + 65;
    const aov = Math.round(totalRev / count);

    return {
      revenue: totalRev,
      orders: count,
      averageOrderValue: aov,
      lowStockCount,
      recentOrders: this.orders.slice(0, 5),
      hourlySales: this.summary.hourlySales,
    };
  }

  // Staff
  async getStaff(): Promise<StaffMember[]> {
    await this.delay(200);
    return [...this.staff];
  }

  async createStaff(payload: Omit<StaffMember, 'id' | 'lastActive'>): Promise<StaffMember> {
    await this.delay(300);
    const newStaff: StaffMember = {
      ...payload,
      id: `usr_staff_${Date.now()}`,
      lastActive: 'Just registered',
    };
    this.staff.unshift(newStaff);
    return newStaff;
  }

  async updateStaff(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
    await this.delay(250);
    const idx = this.staff.findIndex((s) => s.id === id);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Staff with id ${id} not found.`);
    }
    this.staff[idx] = { ...this.staff[idx], ...updates };
    return this.staff[idx];
  }

  async deleteStaff(id: string): Promise<void> {
    await this.delay(250);
    const idx = this.staff.findIndex((s) => s.id === id);
    if (idx === -1) {
      this.throwError('RESOURCE_NOT_FOUND', `Staff with id ${id} not found.`);
    }
    this.staff = this.staff.filter((s) => s.id !== id);
  }

  // Helper utils
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private throwError(code: string, message: string, details: Record<string, unknown> = {}): never {
    const errorPayload: ApiErrorResponse = {
      error: { code, message, details },
    };
    const err = new Error(message) as Error & { response?: ApiErrorResponse; code: string };
    err.response = errorPayload;
    err.code = code;
    throw err;
  }
}

export const apiClient = new MockDatabase();
