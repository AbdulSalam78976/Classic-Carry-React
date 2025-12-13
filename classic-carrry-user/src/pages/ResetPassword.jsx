import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const { showNotification } = useNotification();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        const result = await resetPassword(token, formData.password);
        setLoading(false);

        if (result.success) {
            showNotification('Password reset successfully! Please login.', 'success');
            navigate('/login');
        } else {
            showNotification(result.message || 'Failed to reset password', 'error');
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f9fafb] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative z-10 p-8 md:p-10 border border-gray-100">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6 transform hover:scale-105 transition-transform">
                        <img src="/assets/images/logo.png" alt="Company Logo" className="h-14 w-auto object-contain mx-auto" />
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
                    <p className="text-gray-500">
                        Create a strong password for your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="animate-fade-in-up">
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">New Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                                <i className="fas fa-lock"></i>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                                placeholder="New Password"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                                <i className="fas fa-lock"></i>
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Resetting...</span>
                            </>
                        ) : (
                            <span>Reset Password</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-50">
                    <Link to="/login" className="text-gray-500 hover:text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors group">
                        <i className="fas fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
