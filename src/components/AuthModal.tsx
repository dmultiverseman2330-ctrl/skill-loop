import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    isDevMode, 
    loginWithDemoPhone, 
    loginWithCredentials, 
    simulateProduction 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'demo-phone' | 'email'>('demo-phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const result = loginWithDemoPhone(phoneNumber);
    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  const handleQuickDemoClick = (phone: string) => {
    setPhoneNumber(phone);
    setStatusMessage(null);
    const result = loginWithDemoPhone(phone);
    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const result = loginWithCredentials(email, password);
    if (result.success) {
      setStatusMessage({ text: result.message, isError: false });
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">Sign In to SkillLoop</h2>
            <p className="text-xs text-stone-500">Access local skill exchanges and neighbor chat</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold mb-5">
          <button
            onClick={() => {
              setAuthMode('demo-phone');
              setStatusMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              authMode === 'demo-phone' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Phone (Dev)</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('email');
              setStatusMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              authMode === 'email' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-teal-600" />
            <span>Email / Password</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-medium mb-4 flex items-start gap-2 ${
              statusMessage.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {statusMessage.isError ? (
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Demo Phone Mode */}
        {authMode === 'demo-phone' && (
          <div className="space-y-4">
            {isDevMode ? (
              <>
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Development Fast-Login</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mb-3">
                    Click a demo profile below to instantly log in with pre-configured exchange proposals:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoClick('9990003331')}
                      className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 text-left transition shadow-xs"
                    >
                      <span className="block font-bold text-stone-900 text-xs">Sarah Chen</span>
                      <span className="block font-mono text-[11px] text-emerald-700">9990003331</span>
                      <span className="block text-[10px] text-stone-400">Pottery & French</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoClick('8880002221')}
                      className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 text-left transition shadow-xs"
                    >
                      <span className="block font-bold text-stone-900 text-xs">Marcus Vance</span>
                      <span className="block font-mono text-[11px] text-emerald-700">8880002221</span>
                      <span className="block text-[10px] text-stone-400">React & Woodwork</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                      Or Enter Demo Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9990003331 or 8880002221"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Log In with Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Production Security Notice</span>
                </div>
                <p className="leading-relaxed">
                  Demo mobile-number login without OTP verification is strictly prohibited in production environments.
                </p>
                <p className="text-[11px] text-stone-600">
                  Please use Email/Password sign-in, or configure a verified Twilio/Firebase SMS OTP provider.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Email Mode */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@neighborhood.com"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Continue with Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400">
            By signing in to SkillLoop, you agree to treat local community members with mutual respect and reciprocity.
          </p>
        </div>
      </div>
    </div>
  );
};
