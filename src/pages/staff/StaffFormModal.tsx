import React, { useState, useEffect } from 'react';
import { StaffMember, UserRole } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStaff: StaffMember | null;
  onSave: (staffData: Omit<StaffMember, 'id' | 'lastActive'>, id?: string) => Promise<void>;
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  onClose,
  editingStaff,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [activeShift, setActiveShift] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingStaff) {
      setName(editingStaff.name);
      setEmail(editingStaff.email);
      setRole(editingStaff.role);
      setActiveShift(editingStaff.activeShift);
    } else {
      setName('');
      setEmail('');
      setRole('staff');
      setActiveShift(true);
    }
    setError(null);
  }, [editingStaff, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          activeShift,
        },
        editingStaff ? editingStaff.id : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStaff ? 'Edit Staff Member' : 'Register New Barista / Staff'}
      description="Configure role access permissions and shift activity status."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-white">
        {error && (
          <div className="p-3 bg-utility-danger-soft border border-utility-danger/40 rounded-xl text-xs font-semibold text-utility-danger">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="e.g. Rayhan (Barista)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. rayhan@cribsociety.coffee"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
            System Role Access
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-brand-black-soft rounded-xl border border-brand-black-muted">
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                role === 'staff'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-brand-white/60 hover:text-white'
              }`}
            >
              Barista / Staff
            </button>
            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                role === 'owner'
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-brand-white/60 hover:text-white'
              }`}
            >
              Owner
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-brand-black-muted flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Shift Active Status</span>
            <span className="text-[11px] text-brand-white/60">Mark whether barista is currently on duty on counter.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveShift(!activeShift)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeShift
                ? 'bg-utility-success-soft text-utility-success border border-utility-success/40'
                : 'bg-brand-black-soft text-brand-white/60 border border-brand-black-muted'
            }`}
          >
            {activeShift ? 'On Shift' : 'Off Duty'}
          </button>
        </div>

        <div className="pt-4 border-t border-brand-black-muted flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="border-brand-black-muted">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="font-bold px-6 shadow-md shadow-brand-red/20">
            {editingStaff ? 'Save Changes' : 'Register Staff'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
