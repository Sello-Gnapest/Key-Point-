import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  X,
  CheckCircle2,
  Lock,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { login, loginWithInviteCode } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');
  const [viewMode, setViewMode] = useState<'admin' | 'guest'>('admin');
  const [isFromGuestLink, setIsFromGuestLink] = useState(false);

  // Admin credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Guest & Agent security key state
  const [securityKeyInput, setSecurityKeyInput] = useState('');

  // Check URL parameters for guest link/invite
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasGuestParam =
      params.has('guest_link') ||
      params.has('guest') ||
      params.has('link') ||
      params.has('invite') ||
      params.has('code');

    if (hasGuestParam) {
      setViewMode('guest');
      setIsFromGuestLink(true);
    }
  }, []);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = login(email, password);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!securityKeyInput.trim()) {
      setErrorMessage('Please enter the 6-digit security key provided to access.');
      return;
    }

    setIsSubmitting(true);
    const result = loginWithInviteCode(securityKeyInput);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate security key.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* LEFT COLUMN: Feature & Property Key Image Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden select-none hero-visual-panel">
        {/* Photorealistic Property Keys Background Image */}
        <img
          src="/src/assets/images/luxury_property_keys_1791673674679.jpg"
          alt="Luxury Property Keys & Tag Management"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] transition-transform duration-700 ease-out hover:scale-105"
        />

        {/* Lighter, translucent gradient overlay so the photo and marble surface remain clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/20" />

        {/* Foreground Content Container with lighter glassmorphism */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 xl:p-14 text-white">
          {/* Top Pill Badges with high-transparency glass */}
          <div className="flex items-center justify-between">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/25 text-xs font-semibold text-white shadow-lg"
              style={{ color: '#ffffff' }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-Time Custody Management</span>
            </div>

            <div
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-950/35 backdrop-blur-md border border-white/20 text-slate-100"
              style={{ color: '#f8fafc' }}
            >
              Key Point v3.2
            </div>
          </div>

          {/* Bottom Frosted Card: Made lighter & translucent so the photo stays clearly visible */}
          <div
            className="rounded-3xl p-7 xl:p-8 border border-white/20 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(2, 6, 23, 0.45)',
              color: '#ffffff',
            }}
          >
            <div className="space-y-3.5">
              {/* Brand Lockup inside visual showcase */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#00a2ea] flex items-center justify-center text-white shadow-lg shadow-[#00a2ea]/40 ring-2 ring-white/30">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div
                    className="text-2xl font-extrabold tracking-tight text-white leading-tight"
                    style={{ color: '#ffffff' }}
                  >
                    Key Point
                  </div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider text-cyan-300"
                    style={{ color: '#67e8f9' }}
                  >
                    Property Key Management
                  </div>
                </div>
              </div>

              {/* System Description */}
              <p
                className="text-sm xl:text-base text-slate-100 leading-relaxed font-normal drop-shadow-md"
                style={{ color: '#f8fafc' }}
              >
                Professional property key management system. Track, manage, and audit your property keys with precision.
              </p>
            </div>

            {/* Translucent Feature Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-white/15">
              <div
                className="p-3 rounded-2xl border border-white/15 text-center backdrop-blur-xs"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div
                  className="text-xl xl:text-2xl font-black text-white leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  100%
                </div>
                <div
                  className="text-[11px] text-cyan-200 uppercase tracking-wider font-medium mt-0.5"
                  style={{ color: '#a5f3fc' }}
                >
                  Key Custody
                </div>
              </div>

              <div
                className="p-3 rounded-2xl border border-white/15 text-center backdrop-blur-xs"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div
                  className="text-xl xl:text-2xl font-black text-white leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  Audit
                </div>
                <div
                  className="text-[11px] text-cyan-200 uppercase tracking-wider font-medium mt-0.5"
                  style={{ color: '#a5f3fc' }}
                >
                  Log Tracking
                </div>
              </div>

              <div
                className="p-3 rounded-2xl border border-white/15 text-center backdrop-blur-xs"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div
                  className="text-xl xl:text-2xl font-black text-white leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  Peg
                </div>
                <div
                  className="text-[11px] text-cyan-200 uppercase tracking-wider font-medium mt-0.5"
                  style={{ color: '#a5f3fc' }}
                >
                  Board System
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Login Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-6">
          {/* TOP SEGMENTED TOGGLE SWITCHER (Matching screenshot style) */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`px-6 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('create');
                  setErrorMessage(null);
                }}
                className={`px-6 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-200 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* CARD CONTAINER */}
          <div className="bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {activeTab === 'create' ? (
              /* Create Account Notice Panel */
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Authorized Access Only
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Key Point administrator accounts are managed internally by property security.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <Lock className="w-4 h-4 text-[#00a2ea]" />
                    <span>Administrative Policy</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    Estate Agents, Contractors, and Guests do not require email accounts or passwords. They access property keys via shareable guest links and a secure 6-digit security key issued by property management.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setViewMode('guest');
                    }}
                    className="w-full py-2.5 px-4 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Enter with 6-Digit Security Key</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Back to Admin Sign In
                  </button>
                </div>
              </div>
            ) : viewMode === 'admin' ? (
              /* PRIMARY ADMIN SIGN IN FORM */
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign in to your admin account
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="admin-email"
                      className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@keypoint.com"
                      autoComplete="email"
                      required
                      className="w-full px-3.5 py-2.5 bg-cyan-50/20 dark:bg-slate-900 border border-cyan-300 dark:border-cyan-500/40 focus:border-[#00a2ea] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00a2ea]/20 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="admin-password"
                        className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowHelpModal(true)}
                        className="text-xs text-[#00a2ea] hover:text-[#008ecf] font-medium transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="w-full px-3.5 pr-11 py-2.5 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#00a2ea] focus:ring-2 focus:ring-[#00a2ea]/20 transition-all shadow-2xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 bg-[#00a2ea] hover:bg-[#0092cc] active:bg-[#0082b6] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="text-white" style={{ color: '#ffffff' }}>
                      {isSubmitting ? 'Verifying...' : 'Sign In'}
                    </span>
                  </button>
                </form>
              </div>
            ) : (
              /* GUEST & AGENT SECURITY KEY VERIFICATION */
              <div>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Security Verification
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Guest & Agent Access
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter the 6-digit security key provided to access the portal
                  </p>
                </div>

                {isFromGuestLink && (
                  <div className="mb-4 p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 rounded-xl text-xs text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>Guest link active. Please enter your 6-digit security key to unlock.</span>
                  </div>
                )}

                <form onSubmit={handleGuestSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="security-key"
                      className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Security 6-Digit Key
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-cyan-500" />
                      </div>
                      <input
                        id="security-key"
                        type="text"
                        value={securityKeyInput}
                        onChange={(e) => setSecurityKeyInput(e.target.value)}
                        placeholder="e.g. 512-890"
                        maxLength={15}
                        required
                        autoFocus
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#00a2ea] focus:ring-2 focus:ring-[#00a2ea]/20 transition-all shadow-2xs font-mono tracking-wider"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      Security keys are provided with your guest invite link.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 bg-[#00a2ea] hover:bg-[#0092cc] active:bg-[#0082b6] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="text-white" style={{ color: '#ffffff' }}>
                      {isSubmitting ? 'Verifying Security Key...' : 'Verify Security Key & Enter'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* BELOW CARD: Centered invite toggle matching screenshot */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'admin' ? (
              <span>
                Have an invite link?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('guest');
                    setErrorMessage(null);
                  }}
                  className="text-[#00a2ea] hover:text-[#008ecf] hover:underline font-semibold cursor-pointer transition-colors"
                >
                  Access as guest
                </button>
              </span>
            ) : (
              <span>
                Administrator?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('admin');
                    setErrorMessage(null);
                  }}
                  className="text-[#00a2ea] hover:text-[#008ecf] hover:underline font-semibold cursor-pointer transition-colors"
                >
                  Sign in to admin account
                </button>
              </span>
            )}
          </div>

          {/* Subtle Security Badge */}
          <div className="mt-7 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit encrypted secure session · Key Point Portal</span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
          © 2026 Key Point Systems · All Rights Reserved
        </div>
      </div>

      {/* Forgot Password / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[#00a2ea] flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Account Access & Assistance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Key Point enforces strict security protocols for property keys and custody records. If you need assistance accessing your administrative profile, please coordinate with your primary systems administrator.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-5">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Security Guidelines</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Authorized administrators configure property records, checkout logs, and master reports. Guest viewers and agents require a verified 6-digit security key.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 px-4 bg-[#00a2ea] hover:bg-[#0092cc] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
