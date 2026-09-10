import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { apiClient } from '../../api';
import { StaffMember } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { StaffFormModal } from './StaffFormModal';

export const StaffManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const isOwner = user?.role === 'owner';

  const loadStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getStaff();
      setStaffList(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load staff list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleSaveStaff = async (
    staffData: Omit<StaffMember, 'id' | 'lastActive'>,
    id?: string
  ) => {
    if (id) {
      await apiClient.updateStaff(id, staffData);
      showToast('success', 'Staff Updated', `${staffData.name} updated.`);
    } else {
      await apiClient.createStaff(staffData);
      showToast('success', 'Staff Registered', `${staffData.name} added to roster.`);
    }
    loadStaff();
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the roster?`)) {
      return;
    }
    try {
      await apiClient.deleteStaff(id);
      showToast('success', 'Staff Removed', `${name} removed from roster.`);
      loadStaff();
    } catch (err: any) {
      showToast('error', 'Failed', err?.message || 'Failed to remove staff member');
    }
  };

  const handleToggleShift = async (member: StaffMember) => {
    try {
      const updated = await apiClient.updateStaff(member.id, {
        activeShift: !member.activeShift,
      });
      showToast(
        'info',
        'Shift Updated',
        `${member.name} is now ${updated.activeShift ? 'On Shift' : 'Off Duty'}`
      );
      loadStaff();
    } catch (err: any) {
      showToast('error', 'Update Failed', err?.message || 'Failed to update shift');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-brand-black text-brand-white overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">Staff Roster & Roles</Badge>
            <span className="text-xs text-brand-white/60 font-semibold">{staffList.length} members</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            STAFF & BARISTA MANAGEMENT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStaff}
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
                setEditingStaff(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 font-bold shadow-md shadow-brand-red/20"
            >
              <Plus className="w-4 h-4" />
              <span>Register Staff</span>
            </Button>
          )}
        </div>
      </div>

      {/* Permission UX Boundary */}
      {!isOwner && (
        <div className="p-4 rounded-xl bg-utility-warning-soft border border-utility-warning/40 flex items-center justify-between text-xs text-brand-white">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-utility-warning" />
            <span>Staff access: You are viewing team members in read-only mode. Modifying staff accounts and roles is restricted to Owner.</span>
          </div>
          <Badge variant="neutral" size="sm">Read-Only</Badge>
        </div>
      )}

      {/* Staff Table */}
      {isLoading ? (
        <Card className="p-4 space-y-3 bg-brand-black-card border-brand-black-muted">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </Card>
      ) : error ? (
        <EmptyState
          type="error"
          title="Failed to load staff list"
          description={error}
          actionLabel="Try Again"
          onAction={loadStaff}
        />
      ) : staffList.length === 0 ? (
        <EmptyState
          type="empty"
          title="No staff members registered"
          description="Click Register Staff to add baristas and counter attendants."
          actionLabel="Add First Staff"
          onAction={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <Card className="p-0 overflow-hidden border-brand-black-muted bg-brand-black-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-black-soft border-b border-brand-black-muted text-brand-white/70 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Role Access</th>
                  <th className="py-3.5 px-4">Shift Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  {isOwner && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black-muted font-medium">
                {staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-brand-black-soft transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm shadow-brand-red/20">
                          {member.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-white">{member.name}</div>
                          <div className="text-[11px] text-brand-white/60">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={member.role === 'owner' ? 'brand' : 'neutral'} size="sm">
                        {member.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => isOwner && handleToggleShift(member)}
                        disabled={!isOwner}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          member.activeShift
                            ? 'bg-utility-success-soft text-utility-success border border-utility-success/40'
                            : 'bg-brand-black-soft text-brand-white/60 border border-brand-black-muted'
                        }`}
                      >
                        {member.activeShift ? 'On Shift' : 'Off Duty'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-brand-white/60 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-red" />
                        <span>{member.lastActive}</span>
                      </div>
                    </td>
                    {isOwner && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStaff(member);
                              setIsModalOpen(true);
                            }}
                            className="h-8 px-2.5 text-xs border-brand-black-muted hover:border-brand-red"
                            title="Edit staff member"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1 text-brand-red" />
                            <span>Edit</span>
                          </Button>
                          <button
                            onClick={() => handleDeleteStaff(member.id, member.name)}
                            className="p-1.5 rounded-lg text-brand-red/70 hover:text-brand-red hover:bg-brand-black-soft transition-colors"
                            title="Remove staff member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Staff Form Modal */}
      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff}
        onSave={handleSaveStaff}
      />
    </div>
  );
};
