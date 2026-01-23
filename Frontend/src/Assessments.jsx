import React from 'react';
import { Search, Calendar, Plus, Filter, CalendarDays } from 'lucide-react';
import './Assessments.css';

const Assessments = ({ onNew }) => {
    return (
        <div className="assessments-container">
            <div className="assessments-header">
                <div>
                    <h1>Assessment History</h1>
                    <p>View and manage wound assessments across all patients.</p>
                </div>
                <button className="btn-new-assessment" onClick={onNew}>
                    <Plus size={16} />
                    New Assessment
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input type="text" className="search-input" placeholder="Search by patient, MRN, or wound location..." />
                </div>
                <div className="empty-spacer"></div>
                <button className="date-range-btn">
                    <Calendar size={16} />
                    Date Range
                </button>
                <button className="more-filters-btn">
                    <Filter size={16} />
                    More Filters
                </button>
            </div>

            <div className="assessments-table-container">
                <table className="assessments-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Date</th>
                            <th style={{ width: '15%' }}>Patient</th>
                            <th style={{ width: '15%' }}>Wound</th>
                            <th style={{ width: '15%' }}>Dimensions</th>
                            <th style={{ width: '20%' }}>Tissue Comp.</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '5%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Row 1 */}
                        <tr>
                            <td>
                                <div className="date-cell">
                                    <CalendarDays size={18} className="calendar-icon" />
                                    <div className="date-text">
                                        <div className="date-main">Oct 24, 2023</div>
                                        <div className="date-time">05:30</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="patient-cell">
                                    <div className="patient-name">James Wilson</div>
                                    <div className="patient-mrn">MRN-8821</div>
                                </div>
                            </td>
                            <td>
                                <div className="wound-cell">
                                    <div className="wound-loc">Right Heel</div>
                                    <div className="wound-type">Pressure Ulcer</div>
                                </div>
                            </td>
                            <td>
                                <div className="dimensions-grid">
                                    <div className="dim-item">
                                        <label>AREA</label>
                                        <span>4.2 cm²</span>
                                    </div>
                                    <div className="dim-item">
                                        <label>DEPTH</label>
                                        <span>0.5 cm</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="tissue-row">
                                    <span>Granulation</span>
                                    <span style={{ fontWeight: 700 }}>20%</span>
                                </div>
                                <div className="tissue-bar">
                                    <div className="tissue-fill" style={{ width: '20%', background: '#F59E0B' }}></div>
                                    <div className="tissue-fill" style={{ width: '60%', left: '20%', background: '#1E293B' }}></div>
                                    {/* Mocking the complexity - just a representative bar */}
                                </div>
                            </td>
                            <td>
                                <span className="status-badge status-deteriorating">Deteriorating</span>
                            </td>
                            <td></td>
                        </tr>

                        {/* Row 2 */}
                        <tr>
                            <td>
                                <div className="date-cell">
                                    <CalendarDays size={18} className="calendar-icon" />
                                    <div className="date-text">
                                        <div className="date-main">Oct 22, 2023</div>
                                        <div className="date-time">05:30</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="patient-cell">
                                    <div className="patient-name">Elena Rodriguez</div>
                                    <div className="patient-mrn">MRN-9932</div>
                                </div>
                            </td>
                            <td>
                                <div className="wound-cell">
                                    <div className="wound-loc">Lower Left Leg</div>
                                    <div className="wound-type">Venous Ulcer</div>
                                </div>
                            </td>
                            <td>
                                <div className="dimensions-grid">
                                    <div className="dim-item">
                                        <label>AREA</label>
                                        <span>12.5 cm²</span>
                                    </div>
                                    <div className="dim-item">
                                        <label>DEPTH</label>
                                        <span>0.1 cm</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="tissue-row">
                                    <span>Granulation</span>
                                    <span style={{ fontWeight: 700 }}>80%</span>
                                </div>
                                <div className="tissue-bar">
                                    <div className="tissue-fill" style={{ width: '80%', background: '#EA580C' }}></div>
                                </div>
                            </td>
                            <td>
                                <span className="status-badge status-healing">Healing</span>
                            </td>
                            <td></td>
                        </tr>

                        {/* Row 3 */}
                        <tr>
                            <td>
                                <div className="date-cell">
                                    <CalendarDays size={18} className="calendar-icon" />
                                    <div className="date-text">
                                        <div className="date-main">Oct 10, 2023</div>
                                        <div className="date-time">05:30</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="patient-cell">
                                    <div className="patient-name">James Wilson</div>
                                    <div className="patient-mrn">MRN-8821</div>
                                </div>
                            </td>
                            <td>
                                <div className="wound-cell">
                                    <div className="wound-loc">Right Heel</div>
                                    <div className="wound-type">Pressure Ulcer</div>
                                </div>
                            </td>
                            <td>
                                <div className="dimensions-grid">
                                    <div className="dim-item">
                                        <label>AREA</label>
                                        <span>3.8 cm²</span>
                                    </div>
                                    <div className="dim-item">
                                        <label>DEPTH</label>
                                        <span>0.4 cm</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="tissue-row">
                                    <span>Granulation</span>
                                    <span style={{ fontWeight: 700 }}>30%</span>
                                </div>
                                <div className="tissue-bar">
                                    <div className="tissue-fill" style={{ width: '30%', background: '#F59E0B' }}></div>
                                    <div className="tissue-fill" style={{ width: '20%', left: '30%', background: '#1E293B' }}></div>
                                </div>
                            </td>
                            <td>
                                <span className="status-badge status-deteriorating">Deteriorating</span>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <div className="table-footer">
                    <div className="results-count">Showing 3 results</div>
                    <div className="pagination">
                        <button className="page-btn">Previous</button>
                        <button className="page-btn">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessments;
