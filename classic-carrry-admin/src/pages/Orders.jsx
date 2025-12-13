import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await orderAPI.getAll(params);
      const ordersData = response.data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 font-display">Orders</h1>
        <p className="text-gray-400">Manage customer orders</p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-xl p-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <i className="fas fa-search"></i>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number, customer name, or email..."
            className="glass-input w-full px-4 py-3 pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-gray-400 text-sm mt-3 ml-1">
            Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 capitalize border ${filter === status
              ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(210,193,182,0.3)]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-1">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shopping-cart text-4xl text-gray-600"></i>
            </div>
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'No orders match your search' : 'No orders found'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary hover:text-white transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20 text-left">
                <tr>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Order #</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Items</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Total</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="table-row-hover group">
                    <td className="py-4 px-6 text-white font-mono text-sm">#{order.orderNumber}</td>
                    <td className="py-4 px-6 text-gray-300 font-medium">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{order.customer.email}</td>
                    <td className="py-4 px-6 text-gray-300">{order.items.length}</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      Rs {order.pricing.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border-green-500/20 shadow-green-500/10' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20 shadow-blue-500/10' :
                          order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20 shadow-yellow-500/10' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20 shadow-red-500/10' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/20'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <Link
                          to={`/orders/${order.orderNumber}`}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
