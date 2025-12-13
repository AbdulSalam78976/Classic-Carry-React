import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
// import Logo from '../components/Logo'; // Removed Logo component usage

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
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }}></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 p-8 md:p-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/assets/images/logo.png" alt="Company Logo" className="h-12 w-auto object-contain mx-auto" />
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-500 text-sm">
                        {isSubmitted
                            ? 'Check your email for instructions'
                            : 'Enter your email to receive a reset link'}
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-envelope-open-text text-green-600 text-2xl"></i>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We have sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                            Please check your inbox and click the link to reset your password.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                        >
                            Didn't receive the email? Try again
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-envelope text-gray-400"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <Link to="/login" className="text-gray-500 hover:text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <i className="fas fa-arrow-left text-xs"></i>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
