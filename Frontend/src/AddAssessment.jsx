import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight, Camera, Upload, Info, HelpCircle,
    ArrowLeft, History, Save, X, Activity, User
} from 'lucide-react';
import './AddAssessment.css';
import bodyMapAnterior from './assets/body_map_anterior.png';

const AddAssessment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form State
    const [woundLocation, setWoundLocation] = useState('Anterior');
    const [selectedPart, setSelectedPart] = useState('Left Forearm');
    const [woundType, setWoundType] = useState('pressure_injury');
    const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
    const [stage, setStage] = useState(1);
    const [exudate, setExudate] = useState('low');
    const [painLevel, setPainLevel] = useState(4);

    const [measurements, setMeasurements] = useState({
        length: 0.0,
        width: 0.0,
        depth: 0.0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCancel = () => {
        // Since we are integrating with the existing state-based App.jsx, 
        // navigate might not be what we want if we don't have routing set up yet.
        // But we are setting up routing!
        navigate(-1);
    };

    const handleMeasurementChange = (field, value) => {
        setMeasurements(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulated submission (Mock Only)
        setTimeout(() => {
            setLoading(false);
            navigate(-1);
        }, 1000);
    };

    return (
        <div className="add-assessment-container">
            {/* Header / Breadcrumbs */}
            <div className="assessment-top-nav">
                <div className="viewing-as">
                    VIEWING AS: <span className="clinician-badge">CLINICIAN</span> <span className="switch-link">(Switch)</span>
                </div>
                <div className="breadcrumb">
                    <span className="breadcrumb-item link" onClick={handleCancel}>Patient Profile</span>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-item link" onClick={handleCancel}>John Doe</span>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-item active">Add Assessment</span>
                </div>
            </div>

            <div className="assessment-header-row">
                <h1 className="assessment-title">Add New Wound Assessment</h1>
                <div className="assessment-header-actions">
                    <button className="btn-secondary" onClick={handleCancel} disabled={loading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Assessment'}
                    </button>
                </div>
            </div>

            {error && <div className="assessment-error-banner">{error}</div>}

            <div className="patient-mini-meta">
                <span className="meta-label"><User size={14} /> Patient:</span>
                <span className="meta-value">John Doe [MRN: 12345678]</span>
            </div>

            <div className="assessment-grid">
                {/* Left Column - Wound Location */}
                <div className="assessment-col">
                    <div className="form-section location-section">
                        <div className="section-header">
                            <h2 className="section-subtitle">Wound Location</h2>
                            <div className="toggle-group">
                                <button
                                    className={`toggle-btn ${woundLocation === 'Anterior' ? 'active' : ''}`}
                                    onClick={() => setWoundLocation('Anterior')}
                                >
                                    Anterior
                                </button>
                                <button
                                    className={`toggle-btn ${woundLocation === 'Posterior' ? 'active' : ''}`}
                                    onClick={() => setWoundLocation('Posterior')}
                                >
                                    Posterior
                                </button>
                            </div>
                        </div>

                        <div className="body-map-container">
                            <div className="body-map-placeholder">
                                {/* SVG or high-quality placeholder for body map */}
                                <div className="body-part-dot" style={{ top: '45%', left: '42%' }}></div>
                                <div className="body-part-label" style={{ top: '45%', left: '45%' }}>{selectedPart}</div>
                                <img src={bodyMapAnterior} alt="Body Map" className="body-map-img" />
                            </div>
                            <div className="map-footer">
                                <span>Selected: <strong>{selectedPart}</strong></span>
                                <button className="clear-selection-btn">Clear Selection</button>
                            </div>
                        </div>

                        <div className="previous-assessments-card">
                            <div className="card-header">
                                <History size={16} color="#2563eb" />
                                <h3>Previous Assessments</h3>
                            </div>
                            <div className="card-body">
                                <p className="history-summary">Last assessment on Oct 12, 2023 showed signs of healing.</p>
                                <p className="history-stats">Measurements: <strong>4.2cm x 2.1cm</strong></p>
                                <button className="view-history-link">View History</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details & Measurements */}
                <div className="assessment-col">
                    <div className="form-section details-section">
                        <div className="section-header">
                            <h2 className="section-subtitle"><Info size={18} /> Clinical Details</h2>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Wound Type</label>
                                <select
                                    value={woundType}
                                    onChange={(e) => setWoundType(e.target.value)}
                                >
                                    <option value="pressure_injury">Pressure Injury</option>
                                    <option value="diabetic_ulcer">Diabetic Ulcer</option>
                                    <option value="surgical_wound">Surgical Wound</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Onset Date</label>
                                <input
                                    type="date"
                                    value={onsetDate}
                                    onChange={(e) => setOnsetDate(e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Wound Stage</label>
                                <select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                >
                                    <option value="1">Stage 1</option>
                                    <option value="2">Stage 2</option>
                                    <option value="3">Stage 3</option>
                                    <option value="4">Stage 4</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Exudate Amount</label>
                                <select
                                    value={exudate}
                                    onChange={(e) => setExudate(e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="high">High</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section metrics-section">
                        <div className="section-header">
                            <h2 className="section-subtitle"><Activity size={18} /> Measurements</h2>
                        </div>

                        <div className="measurements-grid">
                            <div className="form-field">
                                <label>Length</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={measurements.length}
                                        step="0.1"
                                        onChange={(e) => handleMeasurementChange('length', e.target.value)}
                                    />
                                    <span className="unit">cm</span>
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Width</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={measurements.width}
                                        step="0.1"
                                        onChange={(e) => handleMeasurementChange('width', e.target.value)}
                                    />
                                    <span className="unit">cm</span>
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Depth</label>
                                <div className="input-with-unit">
                                    <input
                                        type="number"
                                        value={measurements.depth}
                                        step="0.1"
                                        onChange={(e) => handleMeasurementChange('depth', e.target.value)}
                                    />
                                    <span className="unit">cm</span>
                                </div>
                            </div>
                        </div>

                        <div className="pain-level-section">
                            <div className="pain-header">
                                <label>Pain Level</label>
                                <span className="pain-badge">{painLevel} - Moderate</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={painLevel}
                                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                className="pain-slider"
                            />
                            <div className="pain-range-labels">
                                <span>No Pain (0)</span>
                                <span>Severe Pain (10)</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-section documentation-section">
                        <div className="section-header">
                            <h2 className="section-subtitle"><Camera size={18} /> Visual Documentation</h2>
                        </div>

                        <div className="upload-area">
                            <div className="upload-icon">
                                <Upload size={32} color="#94a3b8" />
                            </div>
                            <p className="upload-text">Click to upload or drag and drop</p>
                            <span className="upload-hint">PNG, JPG up to 10MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAssessment;
