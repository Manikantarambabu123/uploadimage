import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [activeMenu, setActiveMenu] = useState('security');

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account preferences and application settings.</p>
            </div>

            <div className="settings-layout">
                {/* Left Sidebar Menu */}
                <div className="settings-sidebar">
                    <div className="settings-menu-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        My Profile
                    </div>
                    <div className={`settings-menu-item ${activeMenu === 'security' ? 'active' : ''}`} onClick={() => setActiveMenu('security')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Security & Login
                        <span className="arrow">›</span>
                    </div>
                    <div className="settings-menu-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        Notifications
                    </div>
                    <div className="settings-menu-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
                        Display & Accessibility
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="settings-content-card">
                    <div className="card-header">
                        <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div className="card-title">
                            <h2>Password & Authentication</h2>
                            <p>Manage your login credentials and security level.</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" value="........" className="form-input" readOnly />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">New Password</label>
                            <input type="password" value="........" className="form-input" readOnly />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Confirm Password</label>
                            <input type="password" value="........" className="form-input" readOnly />
                        </div>
                    </div>

                    <button className="btn-update">Update Password</button>

                    <div className="divider"></div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <h3>Two-Factor Authentication</h3>
                            <p>Secure your account with 2FA.</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
