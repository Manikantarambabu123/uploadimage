import React, { useState, useEffect } from 'react';
import { Search, Calendar, Plus, Filter, CalendarDays, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { API_BASE_URL } from './config';
import './Assessments.css';

const Assessments = ({ onNew, onViewPatient }) => {
    const [assessments, setAssessments] = useState([]);
    const [filteredAssessments, setFilteredAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/images/assessments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Ensure data is sorted by date decending
                const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAssessments(sortedData);
                setFilteredAssessments(sortedData);
            }
        } catch (error) {
            console.error("Failed to fetch assessments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this assessment?")) return;

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/images/assessments/${id}/delete/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // Remove from state
                const updated = assessments.filter(a => a.id !== id);
                setAssessments(updated);
                // Also update filtered list to reflect change immediately
                setFilteredAssessments(prev => prev.filter(a => a.id !== id));
            } else {
                alert("Failed to delete assessment.");
            }
        } catch (error) {
            console.error("Error deleting assessment:", error);
            alert("Error deleting assessment.");
        }
    };

    useEffect(() => {
        let filtered = assessments;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                (a.patient_id && a.patient_id.toLowerCase().includes(term)) ||
                (a.patient_details && a.patient_details.name.toLowerCase().includes(term)) ||
                (a.patient_details && a.patient_details.mrn.toLowerCase().includes(term)) ||
                (a.notes && a.notes.toLowerCase().includes(term))
            );
        }

        if (startDate) {
            filtered = filtered.filter(a => new Date(a.date) >= new Date(startDate));
        }

        if (endDate) {
            // Add one day to end date to include assessments on that day
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            filtered = filtered.filter(a => new Date(a.date) <= end);
        }

        setFilteredAssessments(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchTerm, startDate, endDate, assessments]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAssessments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            main: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
    };
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
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by patient ID or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="date-filters">
                    <div className="date-input-group">
                        <label>From:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="date-input-group">
                        <label>To:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <button className="clear-filters-btn" onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); }}>
                    Clear
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
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '100px' }}>
                                    <div className="loading-state">
                                        <div className="spinner-large"></div>
                                        <p>Loading assessment history...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? currentItems.map((assessment) => {
                            const date = formatDate(assessment.date);
                            const area = (assessment.length && assessment.width) ? (parseFloat(assessment.length) * parseFloat(assessment.width)).toFixed(1) : null;
                            const isHealing = assessment.exudate === 'Low' || assessment.exudate === 'None';

                            return (
                                <tr key={assessment.id}>
                                    <td>
                                        <div className="date-cell">
                                            <CalendarDays size={18} className="calendar-icon" />
                                            <div className="date-text">
                                                <div className="date-main">{date.main}</div>
                                                <div className="date-time">{date.time}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="patient-cell">
                                            <div className="patient-name">
                                                {assessment.patient_details ? assessment.patient_details.name : assessment.patient_id}
                                            </div>
                                            <div className="patient-mrn">
                                                MRN-{assessment.patient_details ? assessment.patient_details.mrn : (assessment.id + 1000)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="wound-cell">
                                            <span className="wound-loc">{assessment.body_part || 'Not specified'}</span>
                                            <span className="wound-type">{assessment.wound_type?.replace('_', ' ') || 'Clinical Assessment'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dimensions-col">
                                            <div className="dim-row">
                                                <label>AREA</label>
                                                <div className="dim-val-group">
                                                    <span className="dim-val">{area || '--'}</span>
                                                    <span className="dim-unit">cm²</span>
                                                </div>
                                            </div>
                                            <div className="dim-row">
                                                <label>DEPTH</label>
                                                <div className="dim-val-group">
                                                    <span className="dim-val">{assessment.depth || '--'}</span>
                                                    <span className="dim-unit">cm</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tissue-comp-cell">
                                            <div className="tissue-header">
                                                <span className="tissue-label">Granulation</span>
                                                <span className="tissue-percent">{isHealing ? '80%' : '30%'}</span>
                                            </div>
                                            <div className="tissue-progress-bg">
                                                <div
                                                    className={`tissue-progress-fill ${isHealing ? 'healing' : 'deteriorating'}`}
                                                    style={{ width: isHealing ? '80%' : '30%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge-revamp ${isHealing ? 'healing' : 'deteriorating'}`}>
                                            {isHealing ? 'Healing' : 'Deteriorating'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell" style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="view-btn-small"
                                                onClick={() => {
                                                    if (assessment.patient_details) {
                                                        const p = assessment.patient_details;
                                                        onViewPatient({
                                                            ...p,
                                                            riskLevel: p.risk_level,
                                                            bed: p.bed_number,
                                                            activeWounds: p.active_wounds
                                                        });
                                                    } else {
                                                        alert("Patient details not found for this assessment.");
                                                    }
                                                }}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="delete-btn-small"
                                                onClick={() => handleDelete(assessment.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                                title="Delete Assessment"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                    No assessments found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="table-footer">
                    <div className="results-count">
                        Showing {Math.min(indexOfFirstItem + 1, filteredAssessments.length)} - {Math.min(indexOfLastItem, filteredAssessments.length)} of {filteredAssessments.length} assessments
                    </div>
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="page-numbers">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessments;
