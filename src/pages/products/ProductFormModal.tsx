import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Layers, Sparkles } from 'lucide-react';
import { Product, ProductCategory, ProductVariant, ProductAddon } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatIDR } from '../../utils/currency';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  editingProduct: Product | null;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  editingProduct,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(30000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [addons, setAddons] = useState<ProductAddon[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategoryId(editingProduct.categoryId);
      setPrice(editingProduct.price);
      setDescription(editingProduct.description);
      setImageUrl(editingProduct.imageUrl || '');
      setAvailable(editingProduct.available);
      setStockQuantity(editingProduct.stockQuantity ?? 30);
      setLowStockThreshold(editingProduct.lowStockThreshold ?? 10);
      setVariants(editingProduct.variants || []);
      setAddons(editingProduct.addons || []);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || 'cat_signature_coffee');
      setPrice(32000);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600');
      setAvailable(true);
      setStockQuantity(35);
      setLowStockThreshold(10);
      setVariants([
        { id: `var_reg_${Date.now()}`, name: 'Regular (16oz)', priceDelta: 0 },
        { id: `var_large_${Date.now()}`, name: 'Large (22oz)', priceDelta: 6000 },
      ]);
      setAddons([
        { id: `add_shot_${Date.now()}`, name: 'Extra Espresso Shot', price: 6000 },
      ]);
    }
    setError(null);
  }, [editingProduct, categories, isOpen]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: `var_${Date.now()}`, name: 'New Size/Variant', priceDelta: 0 },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAddon = () => {
    setAddons((prev) => [
      ...prev,
      { id: `add_${Date.now()}`, name: 'New Addon', price: 5000 },
    ]);
  };

  const handleUpdateAddon = (index: number, field: keyof ProductAddon, val: any) => {
    setAddons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveAddon = (index: number) => {
    setAddons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (price <= 0) {
      setError('Base price must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(
        {
          name: name.trim(),
          categoryId,
          price: Number(price),
          description: description.trim(),
          imageUrl: imageUrl.trim() || undefined,
          available,
          stockQuantity: Number(stockQuantity),
          lowStockThreshold: Number(lowStockThreshold),
          variants,
          addons,
        },
        editingProduct ? editingProduct.id : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Edit Product Catalog Item' : 'Create New Menu Product'}
      description="Configure menu item details, pricing, variants, and stock thresholds."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 max-h-[75vh] overflow-y-auto pr-1 text-white">
        {error && (
          <div className="p-3.5 bg-utility-danger-soft border border-utility-danger/40 rounded-xl text-xs font-semibold text-utility-danger">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            placeholder="e.g. Kyoto Uji Dirty Matcha"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-brand-black-soft border border-brand-black-muted text-white text-sm rounded-xl py-2.5 px-3.5 transition-colors focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-brand-black-card text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Base Price (IDR)"
            type="number"
            step="1000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            helperText={`Formatted: ${formatIDR(price || 0)}`}
          />

          <Input
            label="Initial Stock Quantity"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
            required
          />

          <Input
            label="Low Stock Warning Point"
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe bean notes, extraction profile, ingredients..."
            className="w-full bg-brand-black-soft border border-brand-black-muted text-white text-sm rounded-xl p-3 transition-colors focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red placeholder:text-brand-white/40"
          />
        </div>

        <Input
          label="Image URL"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          startIcon={<Image className="w-4 h-4 text-brand-red" />}
        />

        {/* Variants Builder */}
        <div className="space-y-3 pt-2 border-t border-brand-black-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-red" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Sizes & Serving Variants
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddVariant}
              className="text-xs font-bold border-brand-black-muted text-white hover:border-brand-red h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-brand-red" />
              <span>Add Size</span>
            </Button>
          </div>

          <div className="space-y-2">
            {variants.length === 0 ? (
              <p className="text-xs text-brand-white/50 italic">No variants defined (Single Standard Size).</p>
            ) : (
              variants.map((v, i) => (
                <div key={v.id || i} className="flex items-center gap-2">
                  <Input
                    placeholder="Variant name (e.g. Large 22oz)"
                    value={v.name}
                    onChange={(e) => handleUpdateVariant(i, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <div className="w-36">
                    <Input
                      type="number"
                      step="1000"
                      placeholder="+ Price (IDR)"
                      value={v.priceDelta}
                      onChange={(e) => handleUpdateVariant(i, 'priceDelta', Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(i)}
                    className="p-2.5 text-brand-red/70 hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Addons Builder */}
        <div className="space-y-3 pt-2 border-t border-brand-black-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-red" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Custom Add-ons & Modifiers
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAddon}
              className="text-xs font-bold border-brand-black-muted text-white hover:border-brand-red h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-brand-red" />
              <span>Add Modifier</span>
            </Button>
          </div>

          <div className="space-y-2">
            {addons.length === 0 ? (
              <p className="text-xs text-brand-white/50 italic">No custom add-ons defined.</p>
            ) : (
              addons.map((a, i) => (
                <div key={a.id || i} className="flex items-center gap-2">
                  <Input
                    placeholder="Add-on name (e.g. Oat Milk)"
                    value={a.name}
                    onChange={(e) => handleUpdateAddon(i, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <div className="w-36">
                    <Input
                      type="number"
                      step="1000"
                      placeholder="Price (IDR)"
                      value={a.price}
                      onChange={(e) => handleUpdateAddon(i, 'price', Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddon(i)}
                    className="p-2.5 text-brand-red/70 hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="pt-2 border-t border-brand-black-muted flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Available for Ordering</span>
            <span className="text-[11px] text-brand-white/60">If turned off, POS and public catalog will show Sold Out.</span>
          </div>
          <button
            type="button"
            onClick={() => setAvailable(!available)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              available
                ? 'bg-utility-success-soft text-utility-success border border-utility-success/40'
                : 'bg-utility-danger-soft text-utility-danger border border-utility-danger/40'
            }`}
          >
            {available ? 'In Stock / Active' : 'Sold Out / Inactive'}
          </button>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-brand-black-muted flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="border-brand-black-muted">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="font-bold px-6 shadow-md shadow-brand-red/20">
            {editingProduct ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
