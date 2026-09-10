import { CheckCircle, Printer, RotateCcw, User } from 'lucide-react';
import { Order } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatIDR } from '../../utils/currency';

export interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Completed & Paid"
      description="Receipt generated and sent to counter queue."
      size="md"
    >
      <div className="space-y-6 pt-2 text-white">
        {/* Success Banner */}
        <div className="p-4 bg-utility-success-soft rounded-2xl border border-utility-success/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-utility-success text-white flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-utility-success tracking-wider block">
                Queue Order Number
              </span>
              <span className="text-2xl font-black text-white tracking-tight font-mono">
                #{order.orderNumber}
              </span>
            </div>
          </div>
          <Badge variant="success">PAID ({order.paymentMethod?.toUpperCase() || 'QRIS'})</Badge>
        </div>

        {/* Customer & Timestamp */}
        <div className="flex items-center justify-between text-xs text-brand-white/70 px-1">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <User className="w-3.5 h-3.5 text-brand-red" />
            <span>{order.customerName || 'Counter Customer'}</span>
          </div>
          <div className="text-brand-white/50">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        {/* Thermal Receipt Paper Surface */}
        <div className="p-4 bg-brand-black-soft rounded-xl border border-dashed border-brand-black-muted space-y-3 font-mono text-xs text-white">
          <div className="text-center pb-2 border-b border-dashed border-brand-black-muted">
            <div className="font-bold text-sm tracking-tight text-white">CRIB SOCIETY COFFEE</div>
            <div className="text-[10px] text-brand-white/60">Jl. Senopati No. 42 Jakarta</div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-white">
                <div className="max-w-[70%]">
                  <div className="font-bold">
                    {item.quantity}x {item.name}
                  </div>
                  {item.variantName && (
                    <div className="text-[10px] text-brand-red">Size: {item.variantName}</div>
                  )}
                  {item.addonNames && item.addonNames.length > 0 && (
                    <div className="text-[10px] text-brand-white/60">
                      +{item.addonNames.join(', ')}
                    </div>
                  )}
                  {item.note && (
                    <div className="text-[10px] italic text-brand-white/50">Note: {item.note}</div>
                  )}
                </div>
                <div className="font-bold whitespace-nowrap">{formatIDR(item.itemTotal)}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-dashed border-brand-black-muted space-y-1">
            <div className="flex justify-between text-brand-white/70">
              <span>Subtotal:</span>
              <span>{formatIDR(order.subtotal)}</span>
            </div>
            {order.discount && order.discount > 0 ? (
              <div className="flex justify-between text-brand-red font-semibold">
                <span>Discount:</span>
                <span>-{formatIDR(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-dashed border-brand-black-muted">
              <span>TOTAL PAID:</span>
              <span className="text-brand-red">{formatIDR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 border-brand-black-muted text-xs font-bold"
          >
            <Printer className="w-4 h-4 text-brand-red" />
            <span>Print Receipt</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onNewOrder();
            }}
            className="flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-brand-red/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Order</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
