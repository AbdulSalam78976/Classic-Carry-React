import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import API_URL from '../config/api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCoupons(data.data || []);
    } catch (error) {
      showNotification('Failed to fetch coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCoupon
        ? `${API_URL}/coupons/${editingCoupon._id}`
        : `${API_URL}/coupons`;

      const response = await fetch(url, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully`, 'success');
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        showNotification(data.message || 'Failed to save coupon', 'error');
      }
    } catch (error) {
      showNotification('Failed to save coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Coupon deleted', 'success');
      fetchCoupons();
    } catch (error) {
      showNotification('Failed to delete coupon', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/coupons/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Status updated', 'success');
      fetchCoupons();
    } catch (error) {
      showNotification('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true
    });
    setEditingCoupon(null);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-100px)]"><div className="spinner"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Discount Coupons</h1>
          <p className="text-gray-400">Manage promotional codes and offers</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i>
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden p-1 shadow-2xl">
        {coupons.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <i className="fas fa-ticket-alt text-4xl text-gray-500"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Coupons</h3>
            <p className="text-gray-400">Create your first discount coupon to boost sales!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Code</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Discount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Requirements</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Usage</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Expiry</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-bold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="table-row-hover group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-ticket-alt text-primary/50 text-xl"></i>
                        <span className="font-mono font-bold text-lg text-white bg-white/5 px-2 py-1 rounded border border-white/10 tracking-widest">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-green-400 text-lg">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `Rs ${coupon.discountValue} OFF`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {coupon.minPurchase > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <i className="fas fa-shopping-cart text-gray-500 text-xs"></i> Min spend: <span className="text-white font-bold">Rs {coupon.minPurchase}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">No minimum spend</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-300">
                          <span className="font-bold text-white">{coupon.usedCount || 0}</span> used
                        </div>
                        {coupon.usageLimit > 0 && (
                          <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${Math.min(((coupon.usedCount || 0) / coupon.usageLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm font-medium">
                      {coupon.expiryDate ? (
                        <div className={new Date(coupon.expiryDate) < new Date() ? 'text-red-400 font-bold' : ''}>
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                      ) : <span className="text-green-400/70">Never expires</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${coupon.isActive
                          ? 'bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30'
                          : 'bg-gray-600/20 text-gray-400 border-gray-600/20 hover:bg-gray-600/30'
                          }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                          title="Delete"
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

      {/* Modern Glass Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white font-display">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Coupon Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-ticket-alt text-gray-500"></i>
                  </div>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="glass-input w-full pl-10 pr-4 py-3 font-mono text-lg tracking-widest placeholder-gray-600"
                    placeholder="SUMMER2025"
                    required
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Type</label>
                  <div className="relative">
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="glass-input w-full px-4 py-3 appearance-none cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="glass-input w-full px-4 py-3 font-bold text-white"
                    placeholder="e.g. 20"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Min Spend (Optional)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="glass-input w-full px-4 py-3"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="glass-input w-full px-4 py-3"
                    placeholder="Unlimited"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="glass-input w-full px-4 py-3 text-gray-300"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-white/5 text-gray-300 py-3.5 rounded-xl font-bold hover:bg-white/10 transition border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
