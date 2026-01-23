import React from 'react';
import { Users, AlertCircle, Activity, Clock, Calendar, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <div className="current-date">MONDAY, DECEMBER 15, 2025</div>
                    <h1 className="welcome-text">Good Morning, Dr. Bennett</h1>
                    <div className="status-text">
                        <span className="status-icon">✓</span>
                        You have 5 scheduled assessments and 3 pending reviews today.
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <FileText size={18} />
                        <span>Generate Report</span>
                    </button>
                    <button className="btn btn-primary">
                        <Activity size={18} />
                        <span>New Assessment</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-blue">
                            <Users size={20} />
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUp size={14} />
                            <span>+12%</span>
                        </div>
                    </div>
                    <div className="stat-value">3</div>
                    <div className="stat-label">Active Patients</div>
                    <div className="stat-subtext">Total across all units</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-red">
                            <AlertCircle size={20} />
                        </div>
                        <div className="stat-trend trend-down">
                            <ArrowDown size={14} />
                            <span>-2</span>
                        </div>
                    </div>
                    <div className="stat-value">1</div>
                    <div className="stat-label">Critical Cases</div>
                    <div className="stat-subtext">Requires daily monitoring</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-green">
                            <Activity size={20} />
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUp size={14} />
                            <span>+5%</span>
                        </div>
                    </div>
                    <div className="stat-value">84%</div>
                    <div className="stat-label">Wound Healing Rate</div>
                    <div className="stat-subtext">Patients improving this week</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-purple">
                            <Clock size={20} />
                        </div>
                        <div className="stat-trend trend-up">
                            <ArrowUp size={14} />
                            <span>-30s</span>
                        </div>
                    </div>
                    <div className="stat-value">4.2m</div>
                    <div className="stat-label">Avg. Assessment Time</div>
                    <div className="stat-subtext">AI-assisted speed</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-col-left">
                    {/* Scheduled for Today */}
                    <div className="content-card">
                        <div className="card-header">
                            <div className="card-title-wrapper">
                                <Calendar size={20} className="text-gray" />
                                <h3 className="card-title">Scheduled for Today</h3>
                            </div>
                            <button className="btn-link">View Calendar</button>
                        </div>
                        <div className="schedule-list">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="schedule-item">
                                    <div className="time-badge">09:30</div>
                                    <div className="schedule-details">
                                        <div className="schedule-title">Assessment: James Wilson</div>
                                        <div className="schedule-subtitle">Follow-up on Left Heel ulcer • Room 302</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="content-card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">Healing Efficiency Trend</h3>
                                <div className="card-subtitle">Average healing score improvement over last 6 weeks</div>
                            </div>
                        </div>
                        <div className="chart-container">
                            <svg viewBox="0 0 500 200" className="chart-svg">
                                <line x1="0" y1="150" x2="500" y2="150" stroke="#E2E8F0" strokeDasharray="4" />
                                <line x1="0" y1="100" x2="500" y2="100" stroke="#E2E8F0" strokeDasharray="4" />
                                <line x1="0" y1="50" x2="500" y2="50" stroke="#E2E8F0" strokeDasharray="4" />
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#2d62a8" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#2d62a8" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,120 Q80,100 160,110 T320,80 T500,60 V200 H0 Z"
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d="M0,120 Q80,100 160,110 T320,80 T500,60"
                                    fill="none"
                                    stroke="#2d62a8"
                                    strokeWidth="3"
                                />
                            </svg>
                            <div className="chart-labels">
                                <span>Week 1</span>
                                <span>Week 2</span>
                                <span>Week 3</span>
                                <span>Week 4</span>
                                <span>Week 5</span>
                                <span>Week 6</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-col-right">
                    {/* Priority Attention */}
                    <div className="content-card priority-card">
                        <div className="card-header">
                            <div className="card-title-wrapper">
                                <AlertCircle size={20} className="text-red" />
                                <h3 className="card-title text-red">Priority Attention</h3>
                            </div>
                            <span className="badge badge-red-soft">3 Active</span>
                        </div>
                        <div className="priority-item">
                            <div className="priority-header">
                                <span className="priority-name">James Wilson</span>
                                <span className="badge badge-red">HIGH RISK</span>
                            </div>
                            <p className="priority-desc">
                                Latest AI scan indicates 15% increase in necrotic tissue. Immediate review recommended.
                            </p>
                            <button className="btn-link-red">Review Case &gt;</button>
                        </div>
                    </div>

                    {/* Wound Types Distribution */}
                    <div className="content-card">
                        <div className="card-header">
                            <h3 className="card-title">Wound Types Distribution</h3>
                        </div>
                        <div className="distribution-list">
                            <div className="distribution-item">
                                <div className="dist-header">
                                    <span>Venous Ulcers</span>
                                    <span className="font-bold">45%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill fill-blue" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div className="distribution-item">
                                <div className="dist-header">
                                    <span>Pressure Ulcers</span>
                                    <span className="font-bold">30%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill fill-green" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                            <div className="distribution-item">
                                <div className="dist-header">
                                    <span>Diabetic Foot</span>
                                    <span className="font-bold">25%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill fill-orange" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer-center">
                            <button className="btn-link">View Full Analytics</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
