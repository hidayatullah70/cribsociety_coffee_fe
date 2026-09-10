import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product, ProductVariant, ProductAddon } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatIDR } from '../../utils/currency';

export interface ItemConfigModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    variant: ProductVariant | null,
    addons: ProductAddon[],
    note?: string
  ) => void;
}

export const ItemConfigModal: React.FC<ItemConfigModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (product) {
      // Default to first variant if available
      setSelectedVariant(product.variants.length > 0 ? product.variants[0] : null);
      setSelectedAddons([]);
      setNote('');
    }
  }, [product, isOpen]);

  if (!product) return null;

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const variantDelta = selectedVariant?.priceDelta ?? 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const calculatedUnitPrice = product.price + variantDelta + addonsTotal;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, selectedAddons, note);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={product.description}
      size="md"
    >
      <div className="space-y-6 pt-2">
        {/* Base Price & Availability */}
        <div className="flex items-center justify-between p-3 bg-brand-cream rounded-xl border border-brand-cream-dark">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-black/70">
            Base Price
          </span>
          <span className="font-extrabold text-base text-brand-black">
            {formatIDR(product.price)}
          </span>
        </div>

        {/* Variants Selection */}
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-black">
              1. Choose Size / Serving Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold transition-all min-h-[48px] ${
                      isSelected
                        ? 'border-brand-red bg-brand-red-soft text-brand-red shadow-sm'
                        : 'border-brand-cream-dark bg-brand-white text-brand-black hover:border-brand-black/40'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="text-[11px] font-semibold text-brand-black/60">
                      {v.priceDelta > 0 ? `+${formatIDR(v.priceDelta)}` : 'Included'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons Selection */}
        {product.addons.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-black">
              2. Custom Add-ons & Modifiers
            </label>
            <div className="space-y-2">
              {product.addons.map((addon) => {
                const isChecked = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-brand-red bg-brand-red-soft text-brand-red'
                        : 'border-brand-cream-dark bg-brand-white text-brand-black hover:border-brand-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-brand-red border-brand-red text-white'
                            : 'border-brand-cream-dark bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{addon.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-black/60">
                      {addon.price > 0 ? `+${formatIDR(addon.price)}` : 'Free'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div className="space-y-2">
          <Input
            label="Barista Note (Optional)"
            placeholder="e.g. Extra hot, oat milk on side, less sweet..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Footer with calculated total & Add button */}
        <div className="pt-4 border-t border-brand-cream-dark flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-black/50 block">
              Calculated Item Price
            </span>
            <span className="text-xl font-extrabold text-brand-black">
              {formatIDR(calculatedUnitPrice)}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAdd}
            className="font-bold flex items-center gap-2 px-6 shadow-md shadow-brand-red/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
