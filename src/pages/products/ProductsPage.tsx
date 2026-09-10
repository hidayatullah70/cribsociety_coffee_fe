import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { apiClient } from '../../api';
import { Product, ProductCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProductFormModal } from './ProductFormModal';
import { formatIDR } from '../../utils/currency';
import { cn } from '../../utils/cn';

export const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const isOwner = user?.role === 'owner';

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
      setError(err?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      await apiClient.updateProduct(id, productData);
      showToast('success', 'Product Updated', `${productData.name} saved successfully.`);
    } else {
      await apiClient.createProduct(productData);
      showToast('success', 'Product Created', `${productData.name} added to catalog.`);
    }
    loadCatalog();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu catalog?`)) {
      return;
    }
    setDeletingProductId(id);
    try {
      await apiClient.deleteProduct(id);
      showToast('success', 'Product Deleted', `${name} was removed from the catalog.`);
      loadCatalog();
    } catch (err: any) {
      showToast('error', 'Delete Failed', err?.message || 'Could not delete product');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const updated = await apiClient.updateProduct(product.id, {
        available: !product.available,
      });
      showToast(
        'info',
        'Status Updated',
        `${product.name} is now ${updated.available ? 'In Stock' : 'Sold Out'}`
      );
      loadCatalog();
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to toggle availability');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-brand-black text-brand-white overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">Menu & Catalog</Badge>
            <span className="text-xs text-brand-white/60 font-semibold">{products.length} products total</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            PRODUCT & MENU MANAGEMENT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCatalog}
            className="flex items-center gap-2 border-brand-black-muted hover:border-brand-red text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-red" />
            <span>Refresh</span>
          </Button>

          {isOwner && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 font-bold shadow-md shadow-brand-red/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          )}
        </div>
      </div>

      {/* Permission Scope Notice */}
      {!isOwner && (
        <div className="p-3.5 rounded-xl bg-brand-black-card border border-brand-black-muted flex items-center justify-between text-xs text-brand-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>Staff scope: You have permission to toggle in/out-of-stock items. Product creation and pricing edits are reserved for Owner.</span>
          </div>
          <Badge variant="brand" size="sm">Staff Scope</Badge>
        </div>
      )}

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="w-4 h-4 text-brand-red" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] border',
              selectedCategory === 'all'
                ? 'bg-brand-red text-white border-brand-red shadow-sm shadow-brand-red/20'
                : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
            )}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] border',
                selectedCategory === c.id
                  ? 'bg-brand-red text-white border-brand-red shadow-sm shadow-brand-red/20'
                  : 'bg-brand-black-card border-brand-black-muted text-brand-white/80 hover:bg-brand-black-soft hover:text-white'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table */}
      {isLoading ? (
        <Card className="p-4 space-y-3 bg-brand-black-card border-brand-black-muted">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </Card>
      ) : error ? (
        <EmptyState
          type="error"
          title="Failed to load products"
          description={error}
          actionLabel="Try Again"
          onAction={loadCatalog}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          type="empty"
          title="No products found"
          description="No products match your search query."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <Card className="p-0 overflow-hidden border-brand-black-muted bg-brand-black-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-black-soft border-b border-brand-black-muted text-brand-white/70 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Options</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Availability</th>
                  {isOwner && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black-muted font-medium">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-brand-black-soft transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-brand-black-soft shrink-0 border border-brand-black-muted"
                          />
                          <div>
                            <div className="font-extrabold text-sm text-white">{p.name}</div>
                            <div className="text-[11px] text-brand-white/60 line-clamp-1 max-w-xs">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-brand-white/80 font-semibold">
                        {cat?.name || 'Coffee'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-white">
                        {formatIDR(p.price)}
                      </td>
                      <td className="py-3.5 px-4 text-brand-white/70">
                        <div className="space-y-0.5 text-[11px]">
                          <div>{p.variants.length} Sizes</div>
                          {p.addons.length > 0 && <div className="text-brand-red font-semibold">+{p.addons.length} Add-ons</div>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white">
                          {p.stockQuantity ?? 20}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(p)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            p.available
                              ? 'bg-utility-success-soft text-utility-success border border-utility-success/40'
                              : 'bg-utility-danger-soft text-utility-danger border border-utility-danger/40'
                          }`}
                        >
                          {p.available ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      {isOwner && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsModalOpen(true);
                              }}
                              className="h-8 px-2.5 text-xs border-brand-black-muted hover:border-brand-red"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1 text-brand-red" />
                              <span>Edit</span>
                            </Button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              disabled={deletingProductId === p.id}
                              className="p-1.5 rounded-lg text-brand-red/70 hover:text-brand-red hover:bg-brand-black-soft transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
