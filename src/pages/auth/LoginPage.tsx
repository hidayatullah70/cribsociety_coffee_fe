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
    <div className="min-h-screen bg-brand-cream flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-brand-red selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-black/60 hover:text-brand-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-brand-white flex items-center justify-center mx-auto shadow-lg shadow-brand-red/30">
            <Coffee className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-black">
            CRIB OPERATIONS
          </h1>
          <p className="text-xs text-brand-black/60">
            Role-aware authentication portal for counter staff and shop management.
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="p-6 sm:p-8 space-y-6 border-brand-cream-dark shadow-xl">
          {/* Role selector tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-black tracking-wide uppercase">
              Select Role Context
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-brand-cream rounded-xl border border-brand-cream-dark">
              <button
                type="button"
                onClick={() => handleRoleSelect('staff')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'staff'
                    ? 'bg-brand-white text-brand-black shadow-sm'
                    : 'text-brand-black/60 hover:text-brand-black'
                }`}
              >
                <UserCheck className="w-4 h-4 text-brand-red" />
                <span>Staff</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('owner')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'owner'
                    ? 'bg-brand-white text-brand-black shadow-sm'
                    : 'text-brand-black/60 hover:text-brand-black'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-brand-black" />
                <span>Owner</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('guest')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'guest'
                    ? 'bg-brand-white text-brand-black shadow-sm'
                    : 'text-brand-black/60 hover:text-brand-black'
                }`}
              >
                <Coffee className="w-4 h-4 text-utility-info" />
                <span>Guest</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-utility-danger-soft border border-utility-danger/30 flex items-start gap-2.5 text-xs text-utility-danger">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
              <span>Sign In as {role === 'owner' ? 'Owner' : 'Staff'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-brand-cream-dark/60 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] text-brand-black/50">
              <Badge variant="neutral" size="sm">Demo Mode</Badge>
              <span>Click either role button above for pre-filled demo accounts.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
