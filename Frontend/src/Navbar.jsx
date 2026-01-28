import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ activeTab }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard Overview';
            case 'patients': return 'Patient Records';
            case 'assessments': return 'Wound Assessments';
            case 'reports': return 'Clinical Reports';
            case 'alerts': return 'System Alerts';
            case 'settings': return 'Account Settings';
            default: return 'Dashboard Overview';
        }
    };

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <header className="navbar">
            <div className="navbar-left">
                <h1>{getTitle()}</h1>
            </div>

            <div className="navbar-center">
                <div className="search-bar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search patient MRN..." />
                </div>
            </div>

            <div className="navbar-right">
                <div className="current-date-time" style={{ marginRight: '16px', textAlign: 'right', color: '#64748b', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: '600' }}>{formattedTime}</div>
                    <div style={{ fontSize: '0.8rem' }}>{formattedDate}</div>
                </div>
                <button className="icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </button>
                <button className="icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span className="notification-dot"></span>
                </button>

                <div className="divider"></div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">Dr. Sarah Smith</span>
                        <span className="user-role">Lead Wound Specialist</span>
                    </div>
                    <div className="user-avatar">
                        {/* Placeholder for avatar image */}
                        <div className="avatar-placeholder"></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
