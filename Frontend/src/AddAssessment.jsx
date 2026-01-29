import React, { useState, useRef } from 'react';
import {
    ChevronRight, Camera, Upload, Info, HelpCircle,
    ArrowLeft, History, Save, X, Activity, User,
    FileText, Ruler, Pencil, Layout, Calendar
} from 'lucide-react';
import './AddAssessment.css';
import bodyMapAnterior from './assets/image.png';

import { API_BASE_URL } from './config';

const AddAssessment = ({ patient, onCancel, onSave }) => {
    const fileInputRef = useRef(null);
    const dateInputRef = useRef(null);

    // Form State
    const [woundLocation, setWoundLocation] = useState('Anterior');
    const [selectedPart, setSelectedPart] = useState('Select on Map');
    const [woundType, setWoundType] = useState('pressure_injury');
    const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
    const [stage, setStage] = useState('Stage 2');
    const [exudate, setExudate] = useState('Low');
    const [painLevel, setPainLevel] = useState(4);
    const [notes, setNotes] = useState('');
    const [images, setImages] = useState([]);

    const [measurements, setMeasurements] = useState({
        length: '0.0',
        width: '0.0',
        depth: '0.0'
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [previousAssessments, setPreviousAssessments] = useState([]);
    const [showHistoryGallery, setShowHistoryGallery] = useState(false);

    React.useEffect(() => {
        if (patient) {
            fetchPreviousAssessments();
        }
    }, [patient]);

    const fetchPreviousAssessments = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/images/assessments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const filtered = data.filter(a =>
                    (a.patient_id === patient.mrn) ||
                    (a.related_patient === patient.id)
                );
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPreviousAssessments(filtered);
            }
        } catch (err) {
            console.error("Failed to fetch previous assessments", err);
        }
    };

    const toggleHistoryGallery = () => {
        setShowHistoryGallery(!showHistoryGallery);
    };

    // Body Part Grid Data (Percentage based for responsiveness)
    const bodyPartsAnterior = [
        { id: 'head', name: 'Head', top: '8%', left: '50%' },
        { id: 'chest', name: 'Chest', top: '22%', left: '50%' },
        { id: 'abdomen', name: 'Abdomen', top: '38%', left: '50%' },
        { id: 'r_shoulder', name: 'Right Shoulder', top: '18%', left: '38%' },
        { id: 'l_shoulder', name: 'Left Shoulder', top: '18%', left: '62%' },
        { id: 'r_arm', name: 'Right Upper Arm', top: '30%', left: '32%' },
        { id: 'l_arm', name: 'Left Upper Arm', top: '30%', left: '68%' },
        { id: 'r_forearm', name: 'Right Forearm', top: '45%', left: '26%' },
        { id: 'l_forearm', name: 'Left Forearm', top: '45%', left: '74%' },
        { id: 'pelvis', name: 'Pelvis', top: '50%', left: '50%' },
        { id: 'r_thigh', name: 'Right Thigh', top: '65%', left: '42%' },
        { id: 'l_thigh', name: 'Left Thigh', top: '65%', left: '58%' },
        { id: 'r_knee', name: 'Right Knee', top: '78%', left: '42%' },
        { id: 'l_knee', name: 'Left Knee', top: '78%', left: '58%' },
        { id: 'r_leg', name: 'Right Lower Leg', top: '88%', left: '42%' },
        { id: 'l_leg', name: 'Left Lower Leg', top: '88%', left: '58%' },
        { id: 'r_foot', name: 'Right Foot', top: '96%', left: '42%' },
        { id: 'l_foot', name: 'Left Foot', top: '96%', left: '58%' }
    ];

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

    const handleMeasurementChange = (field, value) => {
        setMeasurements(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePartSelection = (partName) => {
        setSelectedPart(partName);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const token = localStorage.getItem('accessToken');

        for (const file of files) {
            // Optimistic UI preview
            const tempUrl = URL.createObjectURL(file);
            const tempId = Math.random().toString(36).substr(2, 9);

            setImages(prev => [...prev, {
                url: tempUrl,
                name: file.name,
                status: 'uploading',
                tempId
            }]);

            const formData = new FormData();
            formData.append('image', file);
            formData.append('description', `Wound image for ${patient?.name || 'unknown'}`);

            try {
                const response = await fetch(`${API_BASE_URL}/api/images/upload/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    setImages(prev => prev.map(img =>
                        img.tempId === tempId ? { ...img, status: 'ready', id: result.data.id } : img
                    ));
                } else {
                    setImages(prev => prev.map(img =>
                        img.tempId === tempId ? { ...img, status: 'error' } : img
                    ));
                }
            } catch (err) {
                setImages(prev => prev.map(img =>
                    img.tempId === tempId ? { ...img, status: 'error' } : img
                ));
            }
        }
        setUploading(false);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const readyImages = images.filter(img => img.status === 'ready');
        if (readyImages.length === 0) {
            alert('Please upload/wait for at least one image.');
            return;
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');
        const assessmentData = {
            patient_id: patient?.mrn || 'Unknown',
            notes: notes || `Assessment for ${selectedPart}`,
            images: readyImages.map(img => img.id),
            stage: stage,
            // Mocking other clinical details as notes for now since backend models are simple
            clinical_details: {
                woundType,
                onsetDate,
                stage,
                exudate,
                painLevel,
                measurements,
                location: woundLocation,
                part: selectedPart
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/images/assessments/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(assessmentData)
            });

            if (response.ok) {
                if (onSave) onSave();
            } else {
                const err = await response.json();
                setError(err.message || 'Failed to save assessment');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const displayPatient = patient || {
        name: 'James Wilson',
        mrn: 'MRN-8821'
    };

    return (
        <div className="add-assessment-wrapper">
            {/* Top Navigation */}
            <div className="top-nav-bar">
                <div className="view-as-badge">
                    VIEWING AS: <span className="clinician-text">CLINICIAN</span> <span className="switch-text">(Switch)</span>
                </div>
                <div className="breadcrumb-path">
                    <span className="crumb-link" onClick={handleCancel}>Patient Profile</span>
                    <span className="crumb-sep">/</span>
                    <span className="crumb-link" onClick={handleCancel}>{displayPatient.name}</span>
                    <span className="crumb-sep">/</span>
                    <span className="crumb-active">Add Assessment</span>
                </div>
            </div>

            {/* Top Header */}
            <div className="assessment-page-header">
                <div className="header-left-side">
                    <h1 className="page-title">Add New Wound Assessment</h1>
                    <div className="patient-summary-line">
                        <User size={16} className="user-icon-small" />
                        Patient: {displayPatient.name} (MRN: {displayPatient.mrn})
                    </div>
                </div>
                <div className="header-right-side">
                    <button className="secondary-action-btn" onClick={handleCancel}>Cancel</button>
                    <button className="secondary-action-btn grey-bg">Save Draft</button>
                </div>
            </div>

            <main className="assessment-form-body">
                {/* Left Column */}
                <div className="form-column-left">
                    <section className="ui-card location-card-revamp">
                        <div className="card-top-row">
                            <h2 className="card-headline">Wound Location</h2>
                            <div className="view-toggle">
                                {/* <button
                                    className={`toggle-option ${woundLocation === 'Anterior' ? 'is-active' : ''}`}
                                    onClick={() => setWoundLocation('Anterior')}
                                >
                                    Anterior
                                </button>
                                <button
                                    className={`toggle-option ${woundLocation === 'Posterior' ? 'is-active' : ''}`}
                                    onClick={() => setWoundLocation('Posterior')}
                                >
                                    Posterior
                                </button> */}
                            </div>
                        </div>

                        <div className="body-map-interactive-container">
                            <div className="map-view-box">
                                <img src={bodyMapAnterior} alt="Body Map" className="map-image-core" />

                                {/* Interactive Hotspots Grid */}
                                {bodyPartsAnterior.map(part => (
                                    <div
                                        key={part.id}
                                        className={`map-hotspot ${selectedPart === part.name ? 'active' : ''}`}
                                        style={{ top: part.top, left: part.left }}
                                        onClick={() => handlePartSelection(part.name)}
                                        title={part.name}
                                    >
                                        <div className="hotspot-dot"></div>
                                        {selectedPart === part.name && (
                                            <div className="hotspot-tooltip">{part.name}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="map-status-row">
                                <div className="selected-status-label">
                                    <span className="blue-indicator-dot"></span>
                                    Selected Location: <span className="bold-text">{selectedPart}</span>
                                </div>
                                <button className="text-link-btn" onClick={() => setSelectedPart('Select on Map')}>Clear</button>
                            </div>
                        </div>
                    </section>

                    <section className="ui-card history-mini-box">
                        <div className="icon-side">
                            <div className="round-icon-bg">
                                <History size={20} />
                            </div>
                        </div>
                        <div className="content-side">
                            <h3 className="mini-box-title">Previous Assessments</h3>
                            {previousAssessments.length > 0 ? (
                                <>
                                    <p className="mini-box-desc">
                                        Last assessment on {new Date(previousAssessments[0].date).toLocaleDateString()}
                                        {previousAssessments[0].exudate === 'Low' || previousAssessments[0].exudate === 'None' ? ' showed signs of healing.' : ' requires attention.'}
                                    </p>
                                    <p className="mini-box-stats">Measurements: {previousAssessments[0].length || '--'}cm x {previousAssessments[0].width || '--'}cm.</p>
                                    <button className="mini-box-link" onClick={toggleHistoryGallery}>
                                        {showHistoryGallery ? 'Hide History' : 'View History'}
                                    </button>
                                </>
                            ) : (
                                <p className="mini-box-desc">No previous assessments found for this patient.</p>
                            )}
                        </div>
                    </section>

                    {showHistoryGallery && (
                        <section className="ui-card history-gallery-card">
                            <h3 className="gallery-title">Patient Wound History</h3>
                            <div className="gallery-grid">
                                {previousAssessments.map(assess => (
                                    <div key={assess.id} className="gallery-item">
                                        <div className="gallery-item-header">
                                            <span className="assess-date">{new Date(assess.date).toLocaleDateString()}</span>
                                            <span className="assess-stage">{assess.stage}</span>
                                        </div>
                                        <div className="assess-images">
                                            {assess.image_details && assess.image_details.length > 0 ? (
                                                assess.image_details.map((img, i) => (
                                                    <img key={i} src={img.image_url} alt="Previous Wound" className="history-img" />
                                                ))
                                            ) : (
                                                <div className="no-img-placeholder">No Image</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column */}
                <div className="form-column-right">
                    <section className="ui-card detail-fields-section">
                        <div className="section-title-row">
                            <FileText size={20} className="section-header-icon" />
                            <h2 className="section-header-text">Clinical Details</h2>
                        </div>
                        <div className="input-grid-2col">
                            <div className="input-stack">
                                <label className="input-label">Wound Type</label>
                                <div className="custom-select-box">
                                    <select value={woundType} onChange={(e) => setWoundType(e.target.value)}>
                                        <option value="pressure_injury">Pressure Injury</option>
                                        <option value="surgical">Surgical Wound</option>
                                        <option value="diabetic">Diabetic Ulcer</option>
                                        <option value="venous">Venous Ulcer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-stack">
                                <label className="input-label">Onset Date</label>
                                <div className="input-with-left-icon">
                                    <Calendar
                                        size={18}
                                        className="inner-icon-left clickable"
                                        onClick={() => dateInputRef.current?.showPicker?.()}
                                    />
                                    <input
                                        type="date"
                                        ref={dateInputRef}
                                        value={onsetDate}
                                        onChange={(e) => setOnsetDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-stack">
                                <label className="input-label">Wound Stage</label>
                                <div className="custom-select-box">
                                    <select value={stage} onChange={(e) => setStage(e.target.value)}>
                                        <option value="Stage 1">Stage 1</option>
                                        <option value="Stage 2">Stage 2</option>
                                        <option value="Stage 3">Stage 3</option>
                                        <option value="Stage 4">Stage 4</option>
                                        <option value="Unstageable">Unstageable</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-stack">
                                <label className="input-label">Exudate Amount</label>
                                <div className="custom-select-box">
                                    <select value={exudate} onChange={(e) => setExudate(e.target.value)}>
                                        <option value="None">None</option>
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Heavy">Heavy</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="ui-card measurement-fields-section">
                        <div className="section-title-row">
                            <Ruler size={20} className="section-header-icon" />
                            <h2 className="section-header-text">Measurements</h2>
                        </div>
                        <div className="input-grid-3col">
                            <div className="input-stack">
                                <label className="input-label">Length</label>
                                <div className="unit-input-wrapper-inner">
                                    <input type="text" value={measurements.length} onChange={(e) => handleMeasurementChange('length', e.target.value)} />
                                    <span className="unit-tag-inner">cm</span>
                                </div>
                            </div>
                            <div className="input-stack">
                                <label className="input-label">Width</label>
                                <div className="unit-input-wrapper-inner">
                                    <input type="text" value={measurements.width} onChange={(e) => handleMeasurementChange('width', e.target.value)} />
                                    <span className="unit-tag-inner">cm</span>
                                </div>
                            </div>
                            <div className="input-stack">
                                <label className="input-label">Depth</label>
                                <div className="unit-input-wrapper-inner">
                                    <input type="text" value={measurements.depth} onChange={(e) => handleMeasurementChange('depth', e.target.value)} />
                                    <span className="unit-tag-inner">cm</span>
                                </div>
                            </div>
                        </div>

                        <div className="pain-level-control-box">
                            <div className="pain-status-label-row">
                                <label className="input-label">Pain Level</label>
                                <div className="pain-badge-indicator">
                                    {painLevel} - {
                                        painLevel === 0 ? 'No Pain' :
                                            painLevel <= 3 ? 'Mild' :
                                                painLevel <= 6 ? 'Moderate' :
                                                    painLevel <= 9 ? 'Severe' : 'Worst Possible'
                                    }
                                </div>
                            </div>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={painLevel}
                                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                    className="ui-pain-slider"
                                    style={{
                                        background: `linear-gradient(to right, #0f172a 0%, #0f172a ${painLevel * 10}%, #e2e8f0 ${painLevel * 10}%, #e2e8f0 100%)`
                                    }}
                                />
                                <div className="slider-labels">
                                    <span>No Pain (0)</span>
                                    <span>Severe Pain (10)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="ui-card imagery-section">
                        <div className="section-title-row">
                            <Camera size={20} className="section-header-icon" />
                            <h2 className="section-header-text">Visual Documentation</h2>
                        </div>

                        <div className="upload-workflow-container">
                            <div className="drag-drop-area-refined" onClick={handleUploadClick}>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />
                                <div className="upload-circle-icon">
                                    {uploading ? <div className="spinner-small blue"></div> : <Upload size={24} color="#2563eb" />}
                                </div>
                                <div className="upload-instruction-text">
                                    <span className="highlight-blue">Click to upload</span> {images.length > 0 ? 'more images' : 'or drag and drop'}
                                </div>
                                <div className="upload-spec-text">PNG, JPG up to 10MB • {images.length} images selected</div>
                            </div>

                            <div className="horizontal-preview-list">
                                {images.map((img, idx) => (
                                    <div key={idx} className={`preview-square-thumbnail ${img.status}`}>
                                        <img src={img.url} alt="Wound" />
                                        {img.status === 'uploading' && <div className="upload-overlay"><div className="spinner-mini"></div></div>}
                                        {img.status === 'error' && <div className="error-overlay">!</div>}
                                        <button className="delete-thumb-btn" onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}

                                {images.length > 0 && (
                                    <div className="preview-square-thumbnail add-more-square" onClick={handleUploadClick}>
                                        <div className="add-more-content">
                                            <Upload size={20} color="#64748b" />
                                            <span>Add More</span>
                                        </div>
                                    </div>
                                )}

                                {images.length === 0 && (
                                    <div className="preview-square-thumbnail is-empty">
                                        <Camera size={20} color="#cbd5e1" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="ui-card clinical-notes-section">
                        <div className="section-title-row">
                            <Pencil size={20} className="section-header-icon" />
                            <h2 className="section-header-text">Clinical Notes</h2>
                        </div>
                        <textarea
                            className="refined-clinical-textarea"
                            placeholder="Add detailed observations regarding tissue type, wound edge, surrounding skin, etc."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </section>
                </div>
            </main>

            {/* Sticky Submission Footer */}
            <div className="fixed-form-footer">
                <div className="footer-button-group">
                    <button className="btn-outline-white" onClick={handleSubmit}>Save & Add Another</button>
                    <button className="btn-solid-primary" onClick={handleSubmit}>Submit Assessment</button>
                </div>
            </div>
        </div>
    );
};

export default AddAssessment;
