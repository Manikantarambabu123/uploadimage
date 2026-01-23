import React from 'react';
import { Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Edit, Download, BriefcaseMedical } from 'lucide-react';
import './Reports.css';

const Reports = () => {
    return (
        <div className="reports-container">
            {/* Toolbar */}
            <div className="reports-toolbar">
                <div className="toolbar-left">
                    <div className="report-breadcrumb">
                        Patients <span>/</span> Jane Doe <span>/</span> <strong>Report Preview</strong>
                    </div>
                    <div className="report-title-row">
                        Assessment Report #2023-10-27
                    </div>
                </div>

                <div className="toolbar-controls">
                    <button className="control-btn"><ZoomOut size={16} /></button>
                    <span className="page-counter">100%</span>
                    <button className="control-btn"><ZoomIn size={16} /></button>
                    <div style={{ width: 1, height: 16, background: '#E2E8F0', margin: '0 8px' }}></div>
                    <button className="control-btn"><ChevronLeft size={16} /></button>
                    <span className="page-counter">1 / 3</span>
                    <button className="control-btn"><ChevronRight size={16} /></button>
                </div>

                <div className="toolbar-actions">
                    <button className="btn-outline">
                        <Edit size={16} />
                        Edit
                    </button>
                    <button className="btn-blue">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Report Paper */}
            <div className="report-paper">
                <div className="paper-header">
                    <div className="header-brand">
                        <div className="brand-icon">
                            <BriefcaseMedical size={24} />
                        </div>
                        <div className="brand-name">WoundCare AI</div>
                    </div>
                    <div className="header-info">
                        <h1>Wound Assessment Report</h1>
                        <div className="header-meta">
                            Generated on Oct 27, 2023 at 14:35
                            <span className="status-badge">Status: Finalized</span>
                        </div>
                    </div>
                </div>

                <div className="patient-info-bar">
                    <div className="info-item">
                        <label>NAME</label>
                        <span>Jane Doe</span>
                    </div>
                    <div className="info-item">
                        <label>MRN</label>
                        <span>99281</span>
                    </div>
                    <div className="info-item">
                        <label>DOB</label>
                        <span>12/04/1958 (64y)</span>
                    </div>
                    <div className="info-item">
                        <label>LOCATION</label>
                        <span>Room 304-B</span>
                    </div>
                </div>

                <div className="report-grid">
                    <div className="report-column">
                        <div className="report-section">
                            <div className="section-title">
                                <span className="section-number">1</span>
                                Visual Assessment
                            </div>
                            <div className="visual-placeholder">
                                <div className="wound-circle"></div>
                                <div className="img-id">Img ID: 8829-A</div>
                            </div>
                        </div>

                        <div className="report-section">
                            <div className="section-title">
                                <span className="section-number">2</span>
                                Measurements
                            </div>
                            <table className="measurements-table">
                                <thead>
                                    <tr>
                                        <th>METRIC</th>
                                        <th>VALUE</th>
                                        <th style={{ textAlign: 'right' }}>CHANGE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Surface Area</td>
                                        <td>12.4 cm²</td>
                                        <td className="change-negative" style={{ textAlign: 'right' }}>↘ -1.2%</td>
                                    </tr>
                                    <tr>
                                        <td>Max Length</td>
                                        <td>4.2 cm</td>
                                        <td style={{ textAlign: 'right' }}>-</td>
                                    </tr>
                                    <tr>
                                        <td>Max Width</td>
                                        <td>3.1 cm</td>
                                        <td style={{ textAlign: 'right' }}>-</td>
                                    </tr>
                                    <tr>
                                        <td>Avg Depth</td>
                                        <td>0.4 cm</td>
                                        <td className="change-negative" style={{ textAlign: 'right' }}>↘ -0.1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="report-column">
                        <div className="report-section">
                            <div className="section-title">
                                <span className="section-number">3</span>
                                Tissue Composition
                            </div>

                            <div className="tissue-item">
                                <div className="tissue-header">
                                    <span>Granulation (Healthy)</span>
                                    <span className="tissue-value" style={{ color: '#EA580C' }}>65%</span>
                                </div>
                                <div className="tissue-bar-bg">
                                    <div className="tissue-bar-fill" style={{ width: '65%', background: '#EA580C' }}></div>
                                </div>
                            </div>

                            <div className="tissue-item">
                                <div className="tissue-header">
                                    <span>Slough</span>
                                    <span className="tissue-value" style={{ color: '#EAB308' }}>25%</span>
                                </div>
                                <div className="tissue-bar-bg">
                                    <div className="tissue-bar-fill" style={{ width: '25%', background: '#EAB308' }}></div>
                                </div>
                            </div>

                            <div className="tissue-item">
                                <div className="tissue-header">
                                    <span>Necrotic</span>
                                    <span className="tissue-value" style={{ color: '#1E293B' }}>10%</span>
                                </div>
                                <div className="tissue-bar-bg">
                                    <div className="tissue-bar-fill" style={{ width: '10%', background: '#1E293B' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="report-section">
                            <div className="section-title">
                                <span className="section-number">4</span>
                                AI Analysis Notes
                            </div>
                            <div className="ai-notes-box">
                                <div className="note-group">
                                    <div className="note-label">Wound Bed:</div>
                                    <div className="note-text">Shows positive signs of granulation. Reduction in slough percentage compared to previous assessment (Oct 20).</div>
                                </div>
                                <div className="note-group">
                                    <div className="note-label">Periwound:</div>
                                    <div className="note-text">Mild erythema observed. No signs of maceration.</div>
                                </div>
                                <div className="note-group">
                                    <div className="note-label">Recommendation:</div>
                                    <div className="note-text">Continue current treatment plan. Re-assess in 3 days.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="report-footer">
                    <div>Page 1 of 3</div>
                    <div>Confidential Medical Record • Do Not Distribute</div>
                    <div>ID: RPT-2023-8821-X</div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
