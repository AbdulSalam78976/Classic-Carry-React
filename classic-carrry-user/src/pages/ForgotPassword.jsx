import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }

        setLoading(true);
        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setIsSubmitted(true);
            showNotification('Reset link sent to your email', 'success');
        } else {
            showNotification(result.message || 'Failed to send reset link', 'error');
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f9fafb] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative z-10 p-8 md:p-10 border border-gray-100">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6 transform hover:scale-105 transition-transform">
                        <img src="/assets/images/logo.png" alt="Company Logo" className="h-14 w-auto object-contain mx-auto" />
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-500">
                        {isSubmitted
                            ? 'Check your email for instructions'
                            : 'Enter your email to receive a reset link'}
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                            <i className="fas fa-envelope-open-text text-green-500 text-3xl"></i>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We have sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                            Please check your inbox and click the link to reset your password.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors hover:underline"
                        >
                            Didn't receive the email? Try again
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-fade-in-up">
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-gray-400">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
                                    placeholder="name@example.com"
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
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <span>Send Reset Link</span>
                            )}
                        </button>
                    </form>
                )}

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

export default ForgotPassword;
