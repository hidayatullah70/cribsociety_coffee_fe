import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Minus,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { apiClient } from '../../api';
import { InventoryItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../utils/cn';

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.role === 'owner';

  const loadInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getInventory();
      setInventory(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustQuantity = async (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    const newAvailable = newQty > 0;
    try {
      await apiClient.updateInventory(item.productId, newQty, newAvailable);
      showToast('success', 'Stock Adjusted', `${item.productName}: ${newQty} ${item.unit}`);
      loadInventory();
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to adjust stock');
    }
  };

  const handleToggleAvailability = async (item: InventoryItem) => {
    try {
      const newAvail = !item.available;
      await apiClient.updateInventory(item.productId, item.quantity, newAvail);
      showToast('info', 'Status Updated', `${item.productName} is now ${newAvail ? 'Available' : 'Unavailable'}`);
      loadInventory();
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to toggle availability');
    }
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStock === 'low') {
      return matchesSearch && item.quantity <= item.lowStockThreshold && item.quantity > 0;
    }
    if (filterStock === 'out') {
      return matchesSearch && (item.quantity === 0 || !item.available);
    }
    return matchesSearch;
  });

  const lowStockCount = inventory.filter(
    (i) => i.quantity <= i.lowStockThreshold || !i.available
  ).length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-brand-cream overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">Stock & Ingredients</Badge>
            <span className="text-xs text-brand-black/60 font-semibold">
              {inventory.length} total SKUs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight mt-1">
            INVENTORY MANAGEMENT
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadInventory}
          className="flex items-center gap-2 border-brand-cream-dark self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </Button>
      </div>

      {/* Role Permission Banner */}
      {!isOwner && (
        <div className="p-3.5 rounded-xl bg-brand-cream-dark/60 border border-brand-cream-dark flex items-center justify-between text-xs text-brand-black">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-black/60" />
            <span>Staff access: You can toggle product in/out-of-stock status. Quantity restock is managed by owner.</span>
          </div>
          <Badge variant="neutral" size="sm">Staff Scope</Badge>
        </div>
      )}

      {/* Low Stock Warning Alert */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-utility-warning-soft border border-utility-warning/30 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-utility-warning shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-brand-black">
              {lowStockCount} items have reached low-stock threshold or are unavailable.
            </span>
            <p className="text-brand-black/70 mt-0.5">
              Review highlighted products below to prevent out-of-stock interruptions at POS.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search SKU or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStock('all')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px]',
              filterStock === 'all'
                ? 'bg-brand-black text-brand-white shadow-sm'
                : 'bg-brand-white border border-brand-cream-dark text-brand-black hover:bg-brand-cream'
            )}
          >
            All ({inventory.length})
          </button>
          <button
            onClick={() => setFilterStock('low')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px]',
              filterStock === 'low'
                ? 'bg-utility-warning text-white shadow-sm'
                : 'bg-brand-white border border-brand-cream-dark text-utility-warning hover:bg-brand-cream'
            )}
          >
            Low Stock ({inventory.filter((i) => i.quantity <= i.lowStockThreshold && i.quantity > 0).length})
          </button>
          <button
            onClick={() => setFilterStock('out')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px]',
              filterStock === 'out'
                ? 'bg-utility-danger text-white shadow-sm'
                : 'bg-brand-white border border-brand-cream-dark text-utility-danger hover:bg-brand-cream'
            )}
          >
            Out of Stock ({inventory.filter((i) => i.quantity === 0 || !i.available).length})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <Card className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </Card>
      ) : error ? (
        <EmptyState
          type="error"
          title="Unable to load inventory"
          description={error}
          actionLabel="Try Again"
          onAction={loadInventory}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          type="empty"
          title="No inventory records found"
          description="Try changing search or filter parameters."
          actionLabel="Show All Items"
          onAction={() => {
            setSearchQuery('');
            setFilterStock('all');
          }}
        />
      ) : (
        <Card className="p-0 overflow-hidden border-brand-cream-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cream-light border-b border-brand-cream-dark text-brand-black/70 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Threshold</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark/60 font-medium">
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.lowStockThreshold && item.quantity > 0;
                  const isOut = item.quantity === 0 || !item.available;

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        'hover:bg-brand-cream/40 transition-colors',
                        isOut ? 'bg-utility-danger-soft/20' : isLow ? 'bg-utility-warning-soft/20' : ''
                      )}
                    >
                      <td className="py-3.5 px-4 font-bold text-brand-black">
                        {item.productName}
                      </td>
                      <td className="py-3.5 px-4 text-brand-black/70">
                        {item.categoryName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-brand-black">
                            {item.quantity} {item.unit}
                          </span>
                          {isOut ? (
                            <Badge variant="danger" size="sm">Out</Badge>
                          ) : isLow ? (
                            <Badge variant="warning" size="sm">Low</Badge>
                          ) : (
                            <Badge variant="success" size="sm">Good</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-brand-black/60 font-mono">
                        {item.lowStockThreshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            item.available
                              ? 'bg-utility-success-soft text-utility-success border border-utility-success/30'
                              : 'bg-utility-danger-soft text-utility-danger border border-utility-danger/30'
                          }`}
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isOwner ? (
                          <div className="inline-flex items-center gap-1 bg-brand-white rounded-lg border border-brand-cream-dark p-0.5">
                            <button
                              onClick={() => handleAdjustQuantity(item, -5)}
                              className="w-7 h-7 rounded flex items-center justify-center text-brand-black hover:bg-brand-cream text-xs font-bold"
                              title="Reduce by 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleAdjustQuantity(item, -1)}
                              className="w-7 h-7 rounded flex items-center justify-center text-brand-black hover:bg-brand-cream"
                              title="Reduce by 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustQuantity(item, 1)}
                              className="w-7 h-7 rounded flex items-center justify-center text-brand-black hover:bg-brand-cream"
                              title="Add 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustQuantity(item, 10)}
                              className="w-7 h-7 rounded flex items-center justify-center text-brand-black hover:bg-brand-cream text-xs font-bold text-brand-red"
                              title="Restock +10"
                            >
                              +10
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-brand-black/40 italic">Owner managed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
