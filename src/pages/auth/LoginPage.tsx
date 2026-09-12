import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Coffee, ShieldCheck, UserCheck, ArrowRight, AlertCircle, ArrowLeft, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { UserRole } from '../../types';

interface LoginPageProps {
  defaultMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultMode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>(
    defaultMode || (location.pathname === '/register' ? 'register' : 'login')
  );

  useEffect(() => {
    if (defaultMode) {
      setMode(defaultMode);
    } else if (location.pathname === '/register') {
      setMode('register');
    }
  }, [defaultMode, location.pathname]);

  const [role, setRole] = useState<UserRole>('staff');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('staff@cribsociety.coffee');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (mode === 'login') {
      if (selectedRole === 'owner') {
        setEmail('owner@cribsociety.coffee');
      } else if (selectedRole === 'staff') {
        setEmail('staff@cribsociety.coffee');
      } else {
        setEmail('guest@cribsociety.coffee');
      }
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    if (newMode === 'register') {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      handleRoleSelect(role);
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'login') {
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
    } else {
      // Register Mode
      if (!name.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please provide a valid email address.');
        return;
      }
      if (!password) {
        setError('Please enter a password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      try {
        await register(name, email, role);
        setSuccessMessage('Account registered successfully! Redirecting...');
        setTimeout(() => {
          if (role === 'owner') {
            navigate('/dashboard/owner');
          } else if (role === 'staff') {
            navigate('/dashboard/staff');
          } else {
            navigate('/dashboard/guest');
          }
        }, 800);
      } catch (err: any) {
        setError(err?.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
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
          <img src="/logo.png" alt="cribsociety_coffee" className="h-14 w-auto mx-auto object-contain" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white lowercase">
            cribsociety_coffee
          </h1>
          <p className="text-xs text-brand-white/60">
            {mode === 'login'
              ? 'Role-aware authentication portal for counter staff, shop owner, and guests.'
              : 'Create a new account to access POS, management dashboard, or order portal.'}
          </p>
        </div>

        {/* Sign In / Register Card */}
        <Card className="p-6 sm:p-8 space-y-6 bg-brand-black-card border-brand-black-muted shadow-2xl">
          {/* Main Mode Switch Tabs */}
          <div className="flex border-b border-brand-black-muted pb-3 gap-2">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                  : 'text-brand-white/60 hover:text-white hover:bg-brand-black-soft'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                  : 'text-brand-white/60 hover:text-white hover:bg-brand-black-soft'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {/* Role selector tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-white tracking-wide uppercase">
              {mode === 'login' ? 'Select Role Context' : 'Register As'}
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

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-utility-success-soft border border-utility-success/40 flex items-start gap-2.5 text-xs text-utility-success">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-utility-success" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Rayhan (Barista)"
              />
            )}

            <Input
              label="Account Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={mode === 'register' ? 'e.g. rayhan@cribsociety.coffee' : 'e.g. staff@cribsociety.coffee'}
            />

            <Input
              label="Password"
              type="password"
              showPasswordToggle={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            {mode === 'register' && (
              <Input
                label="Confirm Password"
                type="password"
                showPasswordToggle={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full font-bold flex items-center justify-center gap-2 py-3 mt-2 shadow-md shadow-brand-red/20"
            >
              <span>
                {mode === 'login'
                  ? `Sign In as ${role === 'owner' ? 'Owner' : role === 'staff' ? 'Staff' : 'Guest'}`
                  : `Create ${role === 'owner' ? 'Owner' : role === 'staff' ? 'Staff' : 'Guest'} Account`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Footer note / toggle link */}
          <div className="pt-4 border-t border-brand-black-muted text-center space-y-3">
            <p className="text-xs text-brand-white/60">
              {mode === 'login' ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="font-bold text-brand-red hover:underline"
                  >
                    Daftar Sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="font-bold text-brand-red hover:underline"
                  >
                    Masuk ke Akun
                  </button>
                </>
              )}
            </p>

            {mode === 'login' && (
              <div className="inline-flex items-center gap-2 text-[11px] text-brand-white/50">
                <Badge variant="brand" size="sm">Demo Mode</Badge>
                <span>Klik tombol role di atas untuk akun demo siap pakai.</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

