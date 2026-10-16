import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../services/storageService';
import { X, Lock, Mail, Phone, User as UserIcon, Building2, Check, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AuthModalProps {
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialRole = 'student', onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Student form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');

  // Owner form state
  const [ownerUsername, setOwnerUsername] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [recoverySuccessMessage, setRecoverySuccessMessage] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (isSignUp) {
        if (!name || !email || !phone || !password) {
          setErrorMessage('Please fill in all mandatory fields.');
          return;
        }
        const user = storage.registerStudent(
          name, 
          email, 
          phone, 
          college || 'Pune University Student', 
          hostelAddress || 'Campus Hostel'
        );
        onSuccess(user);
      } else {
        if (!email && !phone) {
          setErrorMessage('Please enter your email or phone.');
          return;
        }
        const user = storage.loginStudent(email || phone);
        onSuccess(user);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Authentication failed');
    }
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (!ownerUsername) {
        setErrorMessage('Please enter the username provided by platform administrator.');
        return;
      }
      const user = storage.loginOwner(ownerUsername);
      onSuccess(user);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Invalid mess owner credentials.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = storage.loginAdmin();
      onSuccess(user);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Admin authentication failed');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your registered student email address.');
      return;
    }
    setRecoverySuccessMessage(`Password reset link and temporary PIN sent to ${email}. Check your inbox.`);
  };

  const fillQuickDemo = (role: UserRole, key?: string) => {
    setSelectedRole(role);
    setIsSignUp(false);
    setIsForgotPassword(false);
    setErrorMessage('');

    if (role === 'student') {
      setEmail('pratik@student.ac.in');
      setPassword('student123');
    } else if (role === 'owner') {
      setOwnerUsername(key || 'annapoorna_owner');
      setOwnerPassword('mess123');
    } else if (role === 'admin') {
      setAdminUsername('admin');
      setAdminPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-md my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-amber-50/50 to-white">
          <div>
            <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">Access Account</span>
            <h2 className="text-xl font-bold text-slate-900">
              {isForgotPassword 
                ? 'Reset Student Password' 
                : isSignUp 
                  ? 'Create Student Account' 
                  : 'Welcome to MessBhojan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs (Only if not in password recovery) */}
        {!isForgotPassword && (
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mb-2 block">Select Your Role:</span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => { setSelectedRole('student'); setIsSignUp(false); setErrorMessage(''); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('owner'); setIsSignUp(false); setErrorMessage(''); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === 'owner' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mess Owner
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setIsSignUp(false); setErrorMessage(''); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Demo Fast Login Pills */}
        <div className="px-6 pt-3 pb-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo:
          </span>
          <button
            type="button"
            onClick={() => fillQuickDemo('student')}
            className="px-2 py-0.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[11px] font-medium border border-amber-200 transition-colors"
          >
            Student (Pratik)
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('owner', 'annapoorna_owner')}
            className="px-2 py-0.5 bg-orange-50 text-orange-800 hover:bg-orange-100 rounded text-[11px] font-medium border border-orange-200 transition-colors"
          >
            Mess Owner
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo('admin')}
            className="px-2 py-0.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded text-[11px] font-medium border border-slate-200 transition-colors"
          >
            Platform Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Recovery Alert */}
        {recoverySuccessMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{recoverySuccessMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 pt-3">
          {/* 1. STUDENT AUTH */}
          {selectedRole === 'student' && !isForgotPassword && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College Name</label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. MIT WPU / PICT"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel / Delivery Address</label>
                    <input
                      type="text"
                      value={hostelAddress}
                      onChange={(e) => setHostelAddress(e.target.value)}
                      placeholder="Room number, Hostel name or PG address"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Phone</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.ac.in or +91..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setErrorMessage(''); }}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                {isSignUp ? 'Create Student Account' : 'Sign In as Student'}
              </button>

              <div className="text-center text-xs text-slate-600 pt-2">
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
                      className="text-amber-600 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    New student?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
                      className="text-amber-600 font-semibold hover:underline"
                    >
                      Register Now
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Student Forgot Password Form */}
          {selectedRole === 'student' && isForgotPassword && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered student email address. We will send a secure password reset link and temporary login PIN.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Student Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                Send Password Reset PIN
              </button>

              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setRecoverySuccessMessage(''); }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* 2. MESS OWNER AUTH */}
          {selectedRole === 'owner' && (
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">Admin Authorized Access Only</span>
                Mess owners cannot register publicly. Use the credentials provided by the platform administrator (or test with <code className="font-bold text-amber-800">annapoorna_owner</code>).
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Username</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    placeholder="e.g. annapoorna_owner"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                Access Mess Owner Portal
              </button>
            </form>
          )}

          {/* 3. ADMIN AUTH */}
          {selectedRole === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold block mb-0.5">Platform Administrator Panel</span>
                Authorize mess listings, issue owner accounts, and audit financial settlements.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Username</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Master Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                Sign In as Platform Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
