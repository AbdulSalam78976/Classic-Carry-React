import { useState, useEffect } from 'react';
import API_URL from '../config/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = filter === 'all'
        ? `${API_URL}/contacts`
        : `${API_URL}/contacts?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/contacts/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/contacts/${selectedContact._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage })
      });

      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully!');
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedContact(null);
        fetchContacts();
        fetchStats();
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/20 shadow-blue-500/10',
      read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20 shadow-yellow-500/10',
      replied: 'bg-green-500/20 text-green-400 border-green-500/20 shadow-green-500/10',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500/20'
    };
    return styles[status] || styles.new;
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
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 font-display">Contact Messages</h1>
        <p className="text-gray-400">Manage customer inquiries and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
          { label: 'New', value: stats.new, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Read', value: stats.read, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Replied', value: stats.replied, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Archived', value: stats.archived, color: 'text-gray-400', bg: 'bg-gray-500/10' }
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-4 rounded-xl border-white/5 ${stat.bg} flex flex-col items-center justify-center`}>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{stat.label}</span>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-1.5 rounded-xl inline-flex flex-wrap gap-1">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 capitalize ${filter === status
              ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="glass-panel rounded-2xl overflow-hidden p-1">
        {contacts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <i className="fas fa-inbox text-4xl text-gray-600"></i>
            </div>
            <p className="text-gray-400 text-lg">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="table-row-hover group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 border border-white/10">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{contact.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-300 max-w-xs truncate">{contact.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border shadow-sm ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="View Message"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <a
                          href={`mailto:${contact.email}`}
                          className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center border border-green-500/20"
                          title="Reply via Email"
                        >
                          <i className="fas fa-reply"></i>
                        </a>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                          title="Delete Message"
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

      {/* Contact Detail Modal */}
      {selectedContact && !showReplyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedContact(null)}>
          <div
            className="glass-panel rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white font-display">Message Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Header Info */}
              <div className="flex items-start gap-4 p-4 glass-card rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shadow-primary/20">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedContact.name}</h3>
                      <p className="text-primary font-mono text-sm">{selectedContact.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Received On</p>
                      <p className="text-gray-300 text-sm">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Subject</label>
                <div className="glass-input p-3 w-full rounded-lg text-white font-bold text-lg">
                  {selectedContact.subject}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">Message</label>
                <div className="glass-panel p-6 rounded-xl border-white/5 bg-black/20 text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Reply Section if exists */}
              {selectedContact.replied && selectedContact.replyMessage && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-green-500 uppercase tracking-wider block ml-1 flex items-center gap-1">
                    <i className="fas fa-check-circle"></i> Reply Sent
                  </label>
                  <div className="glass-panel p-6 rounded-xl border-green-500/20 bg-green-900/10 text-gray-300 leading-relaxed">
                    <p className="text-xs text-green-400/60 mb-2">Sent on {new Date(selectedContact.repliedAt).toLocaleString()}</p>
                    {selectedContact.replyMessage}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-reply"></i>
                  {selectedContact.replied ? 'Reply Again' : 'Send Reply'}
                </button>

                <div className="h-12 border-l border-white/10"></div>

                <select
                  value={selectedContact.status}
                  onChange={(e) => {
                    handleStatusChange(selectedContact._id, e.target.value);
                    setSelectedContact({ ...selectedContact, status: e.target.value });
                  }}
                  className="bg-black/40 text-gray-300 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="new">Mark as New</option>
                  <option value="read">Mark as Read</option>
                  <option value="replied">Mark as Replied</option>
                  <option value="archived">Mark as Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white font-display">Reply to Customer</h2>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                  setSelectedContact(null);
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Replying To</p>
                  <p className="text-white font-bold">{selectedContact.name} &lt;{selectedContact.email}&gt;</p>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Subject</p>
                  <p className="text-white font-bold truncate">Re: {selectedContact.subject}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="8"
                  className="glass-input w-full p-4 resize-none leading-relaxed"
                  placeholder="Type your reply here..."
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReply}
                  disabled={!replyMessage.trim() || sendingReply}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingReply ? (
                    <>
                      <div className="spinner w-4 h-4 border-slate-900 border-b-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
