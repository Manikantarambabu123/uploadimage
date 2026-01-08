import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [view, setView] = useState('login'); // 'login' or 'forgot-password'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (view === 'login') {
            if (email && password) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: email,
                            password: password
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Store tokens
                        localStorage.setItem('accessToken', data.tokens.access);
                        localStorage.setItem('refreshToken', data.tokens.refresh);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        onLogin();
                    } else {
                        alert(data.message || 'Login failed. Please check your credentials.');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('An error occurred during login. Is the backend server running?');
                }
            } else {
                alert('Please enter email and password');
            }
        } else {
            if (resetEmail) {
                // TODO: Implement password reset API when available
                alert(`Reset link sent to ${resetEmail}`);
                setView('login');
            } else {
                alert('Please enter your email');
            }
        }
    };

    return (
        <div className="login-screen">
            <header className="login-header">
                <div className="logo-container">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="8" fill="#DDEAFE" />
                        <path d="M20 10V30" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                        <path d="M10 20H30" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                </div>
                <div className="header-text">
                    <h1>Wound Assessment Tool</h1>
                    <p>Hospital - Grade Diagnostics</p>
                </div>
            </header>

            <main className="login-main">
                <div className="login-card">
                    <div className="lock-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>

                    {view === 'login' ? (
                        <>
                            <h2 className="welcome-text">Welcome Back</h2>
                            <p className="subtitle">Please Sign In To Access Secure Patient Records</p>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="input-group">
                                    <label htmlFor="email">Email Or Hospital ID</label>
                                    <input
                                        type="text"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder=""
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder=""
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-footer">
                                    <label className="remember-me">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span>Remember Me</span>
                                    </label>
                                    <span onClick={() => setView('forgot-password')} className="forgot-password-link">Forgot Password?</span>
                                </div>

                                <button type="submit" className="login-btn">Login</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="welcome-text">Reset Password</h2>
                            <p className="subtitle">Enter your email to receive recovery instructions.</p>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="input-group">
                                    <label htmlFor="reset-email">Email Or Hospital ID</label>
                                    <input
                                        type="email"
                                        id="reset-email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder=""
                                    />
                                </div>

                                <button type="submit" className="login-btn">Send Reset Link</button>

                                <div className="back-to-login" onClick={() => setView('login')}>
                                    Back to Login
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Login;
