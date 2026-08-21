import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  X, 
  CheckCircle2, 
  MoreVertical,
  Trash2,
  Edit,
  Building2
} from 'lucide-react';
import { userService } from '../services/userService';

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Front Office');
  const [status, setStatus] = useState('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await userService.getUsers();
    setUsers(list);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newUser = await userService.createUser({ name, email, role, status });
    setUsers(prev => [newUser, ...prev]);
    setIsSubmitting(false);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setRole('Front Office');
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to remove this user from the property?')) {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser && selectedUser.id === id) setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-[#FAF9F6] min-h-screen text-slate-900 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DD] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[#6D4AFF] text-[10px] font-bold uppercase tracking-wider">
              HOTEL STAFF MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Users & Operational Access
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage operational accounts for Mercier Hotel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0B1020] hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <UserPlus size={16} />
          + Add User
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white rounded-xl outline-none text-xs font-medium text-slate-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold font-mono">Total Users: {users.length}</span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.avatarColor || 'bg-slate-800'} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      user.role === 'Manager' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      user.role === 'Front Office' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      user.role.includes('Housekeeping') ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {user.joinedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                      title="Remove User"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Hotel User</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white rounded-xl outline-none text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@mercierhotel.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white rounded-xl outline-none text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white rounded-xl outline-none text-xs font-medium text-slate-900"
                >
                  <option value="Hotel Admin">Hotel Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Front Office">Front Office</option>
                  <option value="Housekeeping Manager">Housekeeping Manager</option>
                  <option value="Housekeeping Staff">Housekeeping Staff</option>
                  <option value="Maintenance Manager">Maintenance Manager</option>
                  <option value="Maintenance Staff">Maintenance Staff</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6D4AFF] focus:bg-white rounded-xl outline-none text-xs font-medium text-slate-900"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Invite</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#0B1020] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selectedUser.avatarColor || 'bg-slate-800'} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Assigned Role</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedUser.role}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Property</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Mercier Hotel</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Role Permissions Summary</span>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span>Operational Dashboard</span>
                    <span className="text-emerald-600 font-bold">Granted ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span>AI Guest Conversations</span>
                    <span className={`font-bold ${selectedUser.role === 'Manager' || selectedUser.role === 'Front Office' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {selectedUser.role === 'Manager' || selectedUser.role === 'Front Office' ? 'Granted ✓' : 'Disabled (No AI)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Details
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default UsersManagement;
