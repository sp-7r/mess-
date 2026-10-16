import React, { useState } from 'react';
import { MessListing, Order, User, Subscription } from '../types';
import { storage } from '../services/storageService';
import { 
  Building2, Users, ShoppingBag, IndianRupee, ShieldCheck, CheckCircle, 
  XCircle, UserPlus, KeyRound, AlertTriangle, ArrowUpRight, Search 
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  messes: MessListing[];
  orders: Order[];
  subscriptions: Subscription[];
  users: User[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab,
  onNavigateTab,
  messes,
  orders,
  subscriptions,
  users,
  onRefreshData
}) => {
  // Create Owner Account Form
  const [ownerName, setOwnerName] = useState('');
  const [messName, setMessName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [assignedUsername, setAssignedUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('mess123');
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');
  const [createErrorMsg, setCreateErrorMsg] = useState('');

  // Analytics Calculations
  const totalVolumeINR = orders.reduce((sum, o) => sum + (o.paymentStatus === 'success' ? o.grandTotal : 0), 0);
  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
  const verifiedStudentsCount = users.filter(u => u.role === 'student').length;

  const handleToggleMessApproval = (mess: MessListing) => {
    storage.updateMess({ ...mess, approved: !mess.approved });
    onRefreshData();
  };

  const handleToggleMessActive = (mess: MessListing) => {
    storage.updateMess({ ...mess, active: !mess.active });
    onRefreshData();
  };

  const handleCreateOwnerAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErrorMsg('');
    setCreateSuccessMsg('');

    if (!ownerName || !messName || !ownerEmail || !assignedUsername) {
      setCreateErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    try {
      const res = storage.createMessOwnerByAdmin(
        ownerName,
        messName,
        ownerEmail,
        ownerPhone || '+91 98000 00000',
        assignedUsername
      );
      setCreateSuccessMsg(`Success! Created account for ${ownerName}. Assigned Username: ${assignedUsername}, Password: ${tempPassword}. Mess listing ${res.mess.name} is now approved.`);
      setOwnerName('');
      setMessName('');
      setOwnerEmail('');
      setOwnerPhone('');
      setAssignedUsername('');
      onRefreshData();
    } catch (err: unknown) {
      setCreateErrorMsg((err as Error).message || 'Failed to create owner account');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      {/* Platform Executive Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Governance Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Super Administrator Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage student mess authorizations, credential issuances, and financial settlement audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('admin_create_owner')}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision Mess Owner</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Platform GMV</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              ₹{totalVolumeINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400">Verified Settlements</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Subscriptions</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-0.5">
              {activeSubsCount}
            </div>
            <span className="text-[10px] text-slate-400">Monthly Passes</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Verified Students</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {verifiedStudentsCount}
            </div>
            <span className="text-[10px] text-slate-400">Hostel Residents</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Authorized Messes</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              {messes.filter(m => m.approved && m.active).length} / {messes.length}
            </div>
            <span className="text-[10px] text-slate-400">FSSAI Compliant</span>
          </div>
        </div>
      </div>

      {/* SECTION A: MESS MANAGEMENT & APPROVALS */}
      {(activeTab === 'admin_overview' || activeTab === 'admin_messes') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mess Listing Authorization & Status</h2>
              <p className="text-xs text-slate-500">Only approved and active messes are visible in student search discovery.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Mess Name & Location</th>
                    <th className="py-3 px-4">Owner Credential</th>
                    <th className="py-3 px-4">Monthly Base</th>
                    <th className="py-3 px-4">FSSAI License</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messes.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-slate-400 text-[11px]">{m.locality}, {m.city}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {m.ownerUsername}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ₹{m.monthlyBasePrice}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {m.fssaiNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.approved && m.active 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {m.approved && m.active ? 'Approved & Live' : 'Suspended / Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleMessApproval(m)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            m.approved 
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {m.approved ? 'Revoke Approval' : 'Approve Mess'}
                        </button>
                        <button
                          onClick={() => handleToggleMessActive(m)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            m.active 
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {m.active ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: PROVISION NEW MESS OWNER ACCOUNT */}
      {activeTab === 'admin_create_owner' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <KeyRound className="w-4 h-4" />
              <span>Privileged Operation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Provision Authorized Mess Owner</h2>
            <p className="text-xs text-slate-500 mt-1">
              Generate platform-verified credentials for campus mess operators. Mess owners cannot self-register.
            </p>
          </div>

          {createSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>{createSuccessMsg}</div>
            </div>
          )}

          {createErrorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{createErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateOwnerAccount} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mess Facility Name</label>
              <input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                placeholder="e.g. Gurukripa Deluxe Student Mess"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner / Operator Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Suresh Patil"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+91 98220..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Owner Email</label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@messbhojan.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Username</label>
                <input
                  type="text"
                  value={assignedUsername}
                  onChange={(e) => setAssignedUsername(e.target.value.toLowerCase())}
                  placeholder="e.g. gurukripa_owner"
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Initial Password</label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Issue Credentials & Create Mess Listing
            </button>
          </form>
        </div>
      )}

      {/* SECTION C: PLATFORM ORDERS & FINANCIAL AUDIT */}
      {(activeTab === 'admin_overview' || activeTab === 'admin_orders') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Orders & Payment Settlement Log</h2>
              <p className="text-xs text-slate-500">Live transaction stream with payment verification hashes and delivery statuses.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Mess Partner</th>
                    <th className="py-3 px-4">Type & Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Verification</th>
                    <th className="py-3 px-4">Order State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">#{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {ord.studentName}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {ord.messName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{ord.deliveryType}</span> · <span className="font-mono uppercase">{ord.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{ord.grandTotal}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ord.paymentStatus === 'success' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : 'bg-amber-50 text-amber-900'
                        }`}>
                          {ord.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-slate-700 font-medium">
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
