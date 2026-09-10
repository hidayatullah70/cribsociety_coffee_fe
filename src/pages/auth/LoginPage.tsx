import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, ShieldCheck, UserCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('staff@cribsociety.coffee');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'owner') {
      setEmail('owner@cribsociety.coffee');
    } else if (selectedRole === 'staff') {
      setEmail('staff@cribsociety.coffee');
    } else {
      setEmail('guest@cribsociety.coffee');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, role);
      if (role === 'owner') {
        navigate('/dashboard/owner');
      } else if (role === 'staff') {
        navigate('/dashboard/staff');
      } else {
        navigate('/dashboard/guest');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-brand-red selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-white/60 hover:text-brand-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-red" />
          <span>Back to Landing Page</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center mx-auto shadow-xl shadow-brand-red/30 font-black">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            CRIB OPERATIONS
          </h1>
          <p className="text-xs text-brand-white/60">
            Role-aware authentication portal for counter staff, shop owner, and guests.
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="p-6 sm:p-8 space-y-6 bg-brand-black-card border-brand-black-muted shadow-2xl">
          {/* Role selector tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
              Select Role Context
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-brand-black-soft rounded-xl border border-brand-black-muted">
              <button
                type="button"
                onClick={() => handleRoleSelect('staff')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'staff'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-brand-white/60 hover:text-white'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${role === 'staff' ? 'text-white' : 'text-brand-red'}`} />
                <span>Staff</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('owner')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'owner'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-brand-white/60 hover:text-white'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${role === 'owner' ? 'text-white' : 'text-brand-red'}`} />
                <span>Owner</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('guest')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'guest'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-brand-white/60 hover:text-white'
                }`}
              >
                <Coffee className={`w-4 h-4 ${role === 'guest' ? 'text-white' : 'text-brand-red'}`} />
                <span>Guest</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-utility-danger-soft border border-utility-danger/40 flex items-start gap-2.5 text-xs text-utility-danger">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-red" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. staff@cribsociety.coffee"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full font-bold flex items-center justify-center gap-2 py-3 mt-2"
            >
              <span>Sign In as {role === 'owner' ? 'Owner' : role === 'staff' ? 'Staff' : 'Guest'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-brand-black-muted text-center">
            <div className="inline-flex items-center gap-2 text-[11px] text-brand-white/50">
              <Badge variant="brand" size="sm">Demo Mode</Badge>
              <span>Click any role button above for pre-filled demo accounts.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
