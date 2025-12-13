import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      showNotification('Failed to fetch order', 'error');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(id, { status: newStatus });
      showNotification('Order status updated successfully', 'success');
      fetchOrder();
    } catch (error) {
      showNotification('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(id, { paymentStatus: newPaymentStatus });
      showNotification('Payment status updated successfully', 'success');
      fetchOrder();
    } catch (error) {
      showNotification('Failed to update payment status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-8 fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/orders')}
          className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <i className="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Order details</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-sm font-mono">#{order.orderNumber}</span>
            <span>• {new Date(order.createdAt).toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <i className="fas fa-user text-blue-400"></i>
              </div>
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                  Name
                </p>
                <p className="text-white font-medium text-lg">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                  Email
                </p>
                <p className="text-white font-medium text-lg break-all">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">
                  Phone
                </p>
                <p className="text-white font-medium text-lg">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-purple-400"></i>
              </div>
              Delivery Address
            </h2>
            <div className="bg-white/5 rounded-xl p-6 space-y-4 border border-white/5">
              <div className="flex items-start gap-4">
                <i className="fas fa-home text-gray-400 mt-1.5"></i>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Street Address</p>
                  <p className="text-white font-medium text-lg leading-relaxed">{order.customer.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="flex items-start gap-4">
                  <i className="fas fa-city text-gray-400 mt-1.5"></i>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">City</p>
                    <p className="text-white font-medium">{order.customer.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <i className="fas fa-map text-gray-400 mt-1.5"></i>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Province</p>
                    <p className="text-white font-medium">{order.customer.province}</p>
                  </div>
                </div>
              </div>

              {order.customer.postalCode && (
                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <i className="fas fa-mail-bulk text-gray-400 mt-1.5"></i>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Postal Code</p>
                    <p className="text-white font-medium">{order.customer.postalCode}</p>
                  </div>
                </div>
              )}

              {order.customer.deliveryNotes && (
                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <i className="fas fa-sticky-note text-yellow-400 mt-1.5"></i>
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-semibold">Delivery Notes</p>
                    <div className="text-white font-medium leading-relaxed bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-2">
                      "{order.customer.deliveryNotes}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <i className="fas fa-box text-green-400"></i>
              </div>
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-6 p-4 glass-card hover:bg-white/5 transition-colors group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-lg mb-2">{item.name}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-gray-300 border border-white/5">
                        Qty: <span className="text-white font-bold">{item.quantity}</span>
                      </span>
                      {item.size && (
                        <span className="px-2 py-1 bg-white/10 rounded-md text-gray-300 border border-white/5">
                          Size: <span className="text-white">{item.size}</span>
                        </span>
                      )}
                      {item.color && (
                        <span className="px-2 py-1 bg-white/10 rounded-md text-gray-300 border border-white/5">
                          Color: <span className="text-white">{item.color}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-primary font-bold text-xl">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Rs {item.price.toLocaleString()} / unit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-8">
          {/* Status Update */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Update Status</h2>
            <div className="flex flex-col gap-2">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updating || order.status === status}
                  className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-between group ${order.status === status
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-slate-900 shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="capitalize flex items-center gap-2">
                    {order.status === status && <i className="fas fa-check"></i>}
                    {status}
                  </span>
                  {order.status === status && <span className="text-xs bg-black/20 px-2 py-1 rounded">Current</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">Rs {order.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-white">
                  {order.pricing.deliveryCharge === 0
                    ? 'FREE'
                    : `Rs ${order.pricing.deliveryCharge.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-2xl font-bold primary-gradient-text">Rs {order.pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Update */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Payment Status</h2>
            <div className="glass-card p-4 rounded-xl mb-4 flex items-center justify-between border-white/10">
              <span className="text-gray-400 text-sm">Current Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.paymentStatus === 'paid'
                  ? 'bg-green-500/20 text-green-400'
                  : order.paymentStatus === 'failed'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['pending', 'paid', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handlePaymentStatusUpdate(status)}
                  disabled={updating || order.paymentStatus === status}
                  className={`px-2 py-2 rounded-lg text-sm font-medium transition-all capitalize ${order.paymentStatus === status
                      ? 'bg-primary text-slate-900 font-bold'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4 text-center">
              Payment Method: <span className="text-gray-300 font-medium">Cash on Delivery (COD)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
