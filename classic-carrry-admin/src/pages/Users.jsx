import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, orderAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const fetchUserOrders = async (userEmail) => {
    setLoadingOrders(true);
    try {
      const response = await orderAPI.getAll();
      const orders = response.data?.filter(order =>
        order.customer?.email?.toLowerCase() === userEmail?.toLowerCase()
      ) || [];
      setUserOrders(orders);
    } catch (error) {
      showNotification('Failed to fetch user orders', 'error');
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    await fetchUserOrders(user.email);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserOrders([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userAPI.delete(id);
      showNotification('User deleted successfully', 'success');
      fetchUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Users</h1>
          <p className="text-gray-400">Manage registered users & customers</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3 border-white/10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Users</p>
            <p className="text-2xl font-bold text-white leading-none">{filteredUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-xl p-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <i className="fas fa-search"></i>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full px-4 py-3 pl-12 pr-12"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <i className="fas fa-users text-4xl text-gray-600"></i>
            </div>
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20 text-left">
                <tr>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Joined</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="table-row-hover group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 shadow-lg">
                          <span className="text-primary font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-white font-bold group-hover:text-primary transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-mono text-sm">{user.email}</td>
                    <td className="py-4 px-6 text-gray-300">{user.phone || <span className="text-gray-600">-</span>}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/20 shadow-purple-500/10'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/20 shadow-blue-500/10'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${user.isActive
                        ? 'bg-green-500/20 text-green-400 border-green-500/20 shadow-green-500/10'
                        : 'bg-red-500/20 text-red-400 border-red-500/20 shadow-red-500/10'
                        }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 text-right">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                          title="Delete User"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}>
          <div
            className="glass-panel rounded-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark p-0.5 shadow-lg shadow-primary/20">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <i className="fas fa-user text-2xl text-primary"></i>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display mb-1">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 font-mono">{selectedUser.email}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-gray-400 flex items-center justify-center transition-all"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="overflow-y-auto p-8">
              {/* User Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Orders</p>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-white">{userOrders.length}</span>
                    <i className="fas fa-shopping-bag text-2xl text-blue-400/20"></i>
                  </div>
                </div>
                <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Completed</p>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-green-400">{userOrders.filter(o => o.status === 'delivered').length}</span>
                    <i className="fas fa-check-circle text-2xl text-green-400/20"></i>
                  </div>
                </div>
                <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Spent</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-primary">
                      Rs {userOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0).toLocaleString()}
                    </span>
                    <i className="fas fa-coins text-2xl text-primary/20"></i>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="glass-card p-6 rounded-xl mb-8 border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-info-circle text-gray-400"></i> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Phone Number</p>
                    <p className="text-gray-300 font-medium">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Member Since</p>
                    <p className="text-gray-300 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 font-display flex items-center gap-2">
                  <i className="fas fa-history text-primary"></i> Order History
                </h3>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="spinner"></div>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-xl border-dashed border-white/10">
                    <i className="fas fa-shopping-cart text-4xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400">No orders placed yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <Link
                        key={order._id}
                        to={`/orders/${order.orderNumber}`}
                        className="block glass-card rounded-xl p-5 hover:bg-white/5 transition-all duration-300 group border-white/5 hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-bold text-lg">#{order.orderNumber || order._id.slice(-6)}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                  order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-primary font-bold text-xl">Rs {order.pricing?.total?.toLocaleString()}</p>
                            <p className="text-gray-500 text-xs">{order.items?.length || 0} items</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="text-gray-400 text-sm flex items-center gap-2">
                            <i className="fas fa-map-marker-alt text-gray-600"></i>
                            {order.customer ? `${order.customer.city}, ${order.customer.province}` : 'Address unavailable'}
                          </div>
                          <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-2">
                            Details <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
