import React, { useState } from 'react';
import './Patients.css';
import { API_BASE_URL } from './config';

const Patients = ({ onAddPatient, onViewPatient, sharedSearchTerm, setSharedSearchTerm, refreshKey }) => {
    // Local copy only if we need it, but we'll use shared state
    const searchTerm = sharedSearchTerm || '';
    const setSearchTerm = setSharedSearchTerm;

    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState([]);

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                // Not logged in or no token, maybe empty list or redirect handled by App
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/patients/list/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Map backend fields to frontend fields
                const mappedPatients = data.map(p => ({
                    ...p,
                    riskLevel: p.risk_level, // Map snake_case to camelCase
                    lastVisit: new Date(p.updated_at).toLocaleDateString(), // Use updated_at as proxy for last visit
                    bed: p.bed_number,
                    diagnosis: p.diagnosis,
                    conditions: p.diagnosis ? [{ label: p.diagnosis, type: 'info' }] : undefined,
                    activeWounds: p.active_wounds // Map active_wounds to activeWounds
                }));
                setPatients(mappedPatients);
            } else {
                console.error("Failed to fetch patients");
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPatients();
    }, [refreshKey]); // Refresh when key changes or on mount

    // Filter locally for now
    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRiskClass = (level) => {
        switch (level.toLowerCase()) {
            case 'high': return 'risk-high';
            case 'moderate': return 'risk-moderate';
            case 'low': return 'risk-low';
            default: return '';
        }
    };

    return (
        <div className="patients-container">
            <div className="patients-header">
                <div className="header-left">
                    <h1>Patients</h1>
                    <p>Manage patient records and wound history.</p>
                </div>
                <button className="add-patient-btn" onClick={onAddPatient}>
                    <span className="plus-icon">+</span> Add Patient
                </button>
            </div>

            <div className="patients-table-card">
                <div className="table-controls">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or MRN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        Filter
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="patients-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>MRN</th>
                                <th>Risk Level</th>
                                <th>Last Visit</th>
                                <th>Active Wounds</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div className="fetching-indicator">
                                            <div className="spinner-small"></div>
                                            <span>Searching patients...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPatients.map((patient, index) => (
                                <tr key={index}>
                                    <td className="patient-name">{patient.name}</td>
                                    <td className="patient-mrn">{patient.mrn}</td>
                                    <td>
                                        <span className={`risk-badge ${getRiskClass(patient.riskLevel)}`}>
                                            {patient.riskLevel}
                                        </span>
                                    </td>
                                    <td className="patient-date">{patient.lastVisit}</td>
                                    <td className="patient-wounds">{patient.activeWounds}</td>
                                    <td className="patient-actions">
                                        <button className="view-btn" onClick={() => onViewPatient(patient)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
