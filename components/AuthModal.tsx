import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'signup';
    onSwitchMode: () => void;
    onSuccess: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsLoading(false);
            setName('');
            setEmail('');
            setPassword('');
        }
    }, [isOpen, mode]);

    const handleAuthAction = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAuthAction();
    };
    
    const handleGoogleAuth = () => {
        handleAuthAction();
    };

    if (!isOpen) return null;

    const isLogin = mode === 'login';

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-brand-secondary">
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {isLogin ? 'Log in to continue your design journey.' : 'Join to start creating and saving your logos.'}
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <GoogleIcon />
                        <span className="font-semibold text-gray-700">Continue with Google</span>
                    </button>
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     {!isLogin && (
                        <div>
                            <label htmlFor="name" className="font-semibold text-sm text-gray-700 block mb-1.5">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                placeholder="Alex"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="font-semibold text-sm text-gray-700 block mb-1.5">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="font-semibold text-sm text-gray-700 block mb-1.5">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white font-bold py-3 px-4 rounded-lg bg-brand-primary hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? <LoadingSpinner /> : (isLogin ? 'Log In' : 'Sign Up for Free')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={onSwitchMode} className="font-semibold text-brand-primary hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;