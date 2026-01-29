import React, { useState, useEffect } from 'react';
import './PatientProfile.css';
import { API_BASE_URL } from './config';

const PatientProfile = ({ patient, onBack, onNewAssessment, onEditPatient }) => {
    const [patientAssessments, setPatientAssessments] = useState([]);
    const [loadingAssessment, setLoadingAssessment] = useState(false);
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem(`tasks_${patient?.id}`);
        return savedTasks ? JSON.parse(savedTasks) : [
            { id: 1, title: 'Collect Tissue Sample', due: 'Today, 12:00 PM', completed: false },
            { id: 2, title: 'Dietary Consultation', due: 'Today, 02:00 PM', completed: false },
            { id: 3, title: 'Update Family', due: 'Tomorrow', completed: false }
        ];
    });

    useEffect(() => {
        if (patient?.id) {
            localStorage.setItem(`tasks_${patient.id}`, JSON.stringify(tasks));
        }
    }, [tasks, patient?.id]);

    // Live Vitals State
    const [vitals, setVitals] = useState({
        bp: '120/80',
        hr: 72,
        temp: 36.6,
        spo2: 98,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    useEffect(() => {
        if (patient) {
            fetchPatientAssessments();
        }

        // Live Vitals Simulation
        const interval = setInterval(() => {
            setVitals(prev => ({
                bp: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
                hr: 65 + Math.floor(Math.random() * 15),
                temp: (36.4 + (Math.random() * 0.4)).toFixed(1),
                spo2: 97 + Math.floor(Math.random() * 3),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }));
        }, 1800000); // Update every 30 minutes

        return () => clearInterval(interval);
    }, [patient]);

    const fetchPatientAssessments = async () => {
        setLoadingAssessment(true);
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/images/assessments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter assessments for this patient (match by MRN or related_patient ID)
                const filtered = data.filter(a =>
                    (a.patient_id === patient.mrn) ||
                    (a.related_patient === patient.id)
                );

                // Sort by date descending
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPatientAssessments(filtered);
            }
        } catch (error) {
            console.error("Failed to fetch patient assessments", error);
        } finally {
            setLoadingAssessment(false);
        }
    };

    const addTask = () => {
        const title = prompt("Enter task description:");
        if (title) {
            const newTask = {
                id: Date.now(),
                title: title,
                due: 'Today, 05:00 PM',
                completed: false
            };
            setTasks([...tasks, newTask]);
        }
    };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
    };

    // Calculate age
    const getAge = (dob) => {
        if (!dob) return '';
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        return `${dob} (${age}y)`;
    };

    const latestAssessment = patientAssessments.length > 0 ? patientAssessments[0] : null;

    const fullPatientData = {
        name: patient?.name || 'Unknown Patient',
        mrn: patient?.mrn || 'N/A',
        dob: getAge(patient?.dob),
        bed: patient?.bed || patient?.bed_number || 'Unassigned',

        // Conditions/Diagnosis
        conditions: patient?.conditions || (patient?.diagnosis ? [{ label: patient.diagnosis, type: 'info' }] : []),

        // Contact Info
        contact: {
            phone: patient?.contact_number || '--',
            phoneLabel: 'Mobile',
            address: patient?.address || '--',
            addressLabel: 'Primary Residence',
            emergency: patient?.emergency_contact_name || '--',
            emergencyPhone: patient?.emergency_contact_number || '--',
            emergencyLabel: 'Emergency Contact'
        },

        vitals: {
            bp: vitals.bp,
            hr: vitals.hr,
            temp: vitals.temp,
            spo2: vitals.spo2,
            time: vitals.time
        },

        alerts: [],
        tasks: tasks,
        latestNote: {
            author: latestAssessment ? 'Clinician' : 'System',
            text: latestAssessment?.notes || 'Patient record created.'
        },
        team: [
            { name: patient?.assigning_physician || 'Unassigned', role: 'Primary Physician', initials: 'MD', color: '#bfdbfe', text: '#1e40af' }
        ],
        timeline: patientAssessments.map(a => ({
            time: new Date(a.date).toLocaleDateString(),
            title: 'Wound Assessment',
            desc: a.notes || 'Routine wound assessment performed.'
        }))
    };

    // Helper to format assessment for card
    const getWoundCardData = (assess) => {
        const area = (assess.length && assess.width) ? (parseFloat(assess.length) * parseFloat(assess.width)).toFixed(1) : null;
        return {
            type: assess.wound_type?.replace('_', ' ').toUpperCase() || 'WOUND ASSESSMENT',
            stage: assess.stage || 'Stage 1',
            id: `#${assess.id}`,
            reduction: '0%',
            size: area ? `${area} cm²` : '-- cm²',
            exudate: assess.exudate || 'None',
            tissueType: 'Granulation',
            lastAssessment: new Date(assess.date).toLocaleDateString(),
            confidence: '94%',
            image: assess.image_details && assess.image_details.length > 0
                ? assess.image_details[0].image_url
                : null
        };
    };

    return (
        <div className="patient-profile-container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <span className="crumb link" onClick={onBack}>Home</span> &gt;
                <span className="crumb link" onClick={onBack}> Patients</span> &gt;
                <span className="crumb active"> {fullPatientData.name}</span>
            </div>

            {/* Header Section */}
            <div className="patient-profile-header">
                <div className="header-content">
                    <div className="avatar-wrapper">
                        <div className="avatar-placeholder"></div>
                        <div className="status-dot"></div>
                    </div>

                    <div className="patient-info-main">
                        <div className="name-row">
                            <h1>{fullPatientData.name}</h1>
                        </div>

                        <div className="details-row">
                            <div className="detail-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                <span className="label">MRN:</span>
                                <span className="value">{fullPatientData.mrn}</span>
                            </div>
                            <div className="detail-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span className="value">{fullPatientData.dob}</span>
                            </div>
                            <div className="detail-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span className="label">Bed:</span>
                                <span className="value">{fullPatientData.bed}</span>
                            </div>
                        </div>

                        <div className="badges-row">
                            {fullPatientData.conditions.map((cond, idx) => (
                                <span key={idx} className={`condition-badge ${cond.type}`}>
                                    {cond.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="edit-details-btn" onClick={() => onEditPatient(fullPatientData)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit Details
                    </button>
                    <button className="new-assessment-btn" onClick={onNewAssessment}>
                        <span className="plus-icon">+</span> New Assessment
                    </button>
                </div>
            </div>

            {/* Main Dashboard Grid - 3 Columns */}
            <div className="profile-dashboard-grid">

                {/* Column 1: Vitals, Team, Contact (Left Sidebar) */}
                <div className="dashboard-col-left">

                    {/* Vitals */}
                    <div className="card vitals-card">
                        <div className="card-header">
                            <h3>Latest Vitals</h3>
                            <span className="timestamp">Today, {fullPatientData.vitals.time}</span>
                        </div>
                        <div className="vitals-grid">
                            <div className="vital-item">
                                <label>BP</label>
                                <div className="vital-val">{fullPatientData.vitals.bp}</div>
                                <span className="vital-status normal">➔ Normal</span>
                            </div>
                            <div className="vital-item">
                                <label>HR</label>
                                <div className="vital-val">{fullPatientData.vitals.hr} <span className="unit">bpm</span></div>
                                <span className="vital-status normal">➔ Normal</span>
                            </div>
                            <div className="vital-item">
                                <label>TEMP</label>
                                <div className="vital-val">{fullPatientData.vitals.temp} <span className="unit">°C</span></div>
                                <span className="vital-status normal">➔ Normal</span>
                            </div>
                            <div className="vital-item">
                                <label>SPO2</label>
                                <div className="vital-val">{fullPatientData.vitals.spo2}<span className="unit">%</span></div>
                                <span className="vital-status normal">➔ Normal</span>
                            </div>
                        </div>
                    </div>

                    {/* Care Team */}
                    <div className="card care-team-card">
                        <div className="card-header">
                            <h3>Care Team</h3>
                        </div>
                        <div className="team-list">
                            {fullPatientData.team.map((member, idx) => (
                                <div key={idx} className="team-member">
                                    <div className="member-avatar" style={{ backgroundColor: member.color, color: member.text }}>
                                        {member.initials}
                                    </div>
                                    <div className="member-info">
                                        <span className="member-name">{member.name}</span>
                                        <span className="member-role">{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-team-btn">VIEW FULL TEAM</button>
                    </div>

                    {/* Contact Information */}
                    <div className="card contact-card">
                        <div className="card-header">
                            <h3>Contact Information</h3>
                        </div>
                        <div className="contact-list">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div className="contact-details">
                                    <span className="contact-value">{fullPatientData.contact.phone}</span>
                                    <span className="contact-label">{fullPatientData.contact.phoneLabel}</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                </div>
                                <div className="contact-details">
                                    <span className="contact-value">{fullPatientData.contact.address}</span>
                                    <span className="contact-label">{fullPatientData.contact.addressLabel}</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <div className="contact-details">
                                    <span className="contact-value">{fullPatientData.contact.emergency}</span>
                                    <span className="contact-label">{fullPatientData.contact.emergencyLabel} • {fullPatientData.contact.emergencyPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Wounds & Timeline (Center) */}
                <div className="dashboard-col-center">
                    {/* Active Wounds Section */}
                    <div className="section-header">
                        <h3>Active Wounds</h3>
                        <a href="#" className="view-map-link">View Body Map</a>
                    </div>

                    {patientAssessments.length > 0 ? (
                        patientAssessments.map(assess => {
                            const activeWound = getWoundCardData(assess);
                            return (
                                <div className="wound-card" key={assess.id} style={{ marginBottom: '24px' }}>
                                    <div className="wound-image-col">
                                        {activeWound.image ? (
                                            <img src={activeWound.image} alt="Wound" className="wound-img" />
                                        ) : (
                                            <div className="wound-img-placeholder" style={{
                                                width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                                            }}>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="wound-info-col">
                                        <div className="wound-header-row">
                                            <div className="wound-title-block">
                                                <span className="stage-badge stage-3">{activeWound.stage}</span>
                                                <span className="wound-id">{activeWound.id}</span>
                                            </div>
                                            <div className="reduction-badge">
                                                <span className="reduction-val">{activeWound.reduction}</span>
                                                <span className="reduction-label">REDUCTION</span>
                                            </div>
                                        </div>
                                        <h2 className="wound-type-title">{activeWound.type}</h2>
                                        <div className="wound-metrics-grid">
                                            <div className="metric-box">
                                                <label>Size (Area)</label>
                                                <div className="metric-val">{activeWound.size}</div>
                                            </div>
                                            <div className="metric-box">
                                                <label>Exudate</label>
                                                <div className="metric-val">{activeWound.exudate}</div>
                                            </div>
                                            <div className="metric-box">
                                                <label>Tissue Type</label>
                                                <div className="metric-val" style={{ whiteSpace: 'pre-line' }}>{activeWound.tissueType}</div>
                                            </div>
                                            <div className="metric-box">
                                                <label>Last Assessment</label>
                                                <div className="metric-val">{activeWound.lastAssessment}</div>
                                            </div>
                                        </div>
                                        <div className="wound-action-row">
                                            <div className="ai-confidence">
                                                <div className="ai-icon">AI</div>
                                                <span>AI Confidence: <br /><strong>{activeWound.confidence}</strong></span>
                                            </div>
                                            <button className="analyze-link">Analyze &rarr;</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            No assessments found for this patient.
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="care-timeline-section">
                        <h3>Care Timeline</h3>
                        <div className="timeline-list">
                            {fullPatientData.timeline && fullPatientData.timeline.length > 0 ? fullPatientData.timeline.map((item, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-left">
                                        <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`}></div>
                                        {idx !== fullPatientData.timeline.length - 1 && <div className="timeline-line"></div>}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-time">{item.time}</div>
                                        <h4 className="timeline-title">{item.title}</h4>
                                        <p className="timeline-desc">{item.desc}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="timeline-empty">No recent activity</div>
                            )}
                        </div>
                        <div className="view-history-container">
                            <a href="#" className="view-full-history">View Full History</a>
                        </div>
                    </div>
                </div>

                {/* Column 3: Alerts, Tasks, Note (Right Sidebar) */}
                <div className="dashboard-col-right">
                    {/* Active Alerts */}
                    <div className="section-title-row">
                        <span>⚠️ Active Alerts</span>
                    </div>

                    {fullPatientData.alerts && fullPatientData.alerts.length > 0 ? fullPatientData.alerts.map((alert, idx) => (
                        <div key={idx} className={`alert-card ${alert.type}`}>
                            <div className="alert-header">
                                <span className="alert-tag">{alert.type === 'high' ? 'HIGH PRIORITY' : 'ATTENTION'}</span>
                            </div>
                            <h4>{alert.title}</h4>
                            <p>{alert.desc}</p>
                            {alert.link && <a href="#" className="alert-link">{alert.link}</a>}
                        </div>
                    )) : (
                        <div style={{ color: '#64748b', padding: '10px', fontSize: '0.9rem' }}>No active alerts</div>
                    )}

                    {/* Pending Tasks */}
                    <div className="card pending-tasks-card">
                        <div className="card-header">
                            <h3>Pending Tasks</h3>
                            <span className="counter-badge">{fullPatientData.tasks.filter(t => !t.completed).length}</span>
                        </div>
                        <div className="task-list">
                            {fullPatientData.tasks && fullPatientData.tasks.length > 0 ? fullPatientData.tasks.map((task, idx) => (
                                <div key={idx} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                    <div className="checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                        />
                                    </div>
                                    <div className="task-details" style={{ opacity: task.completed ? 0.6 : 1 }}>
                                        <span className="task-name" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                            {task.title}
                                        </span>
                                        <span className="task-due">Due: {task.due}</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '12px', color: '#94a3b8' }}>No pending tasks</div>
                            )}
                        </div>
                        <button className="add-task-btn" onClick={addTask}>+ Add Task</button>
                    </div>

                    {/* Latest Note */}
                    <div className="card latest-note-card">
                        <div className="card-header">
                            <h3>Latest Note</h3>
                            <span className="author-name">{fullPatientData.latestNote.author}</span>
                        </div>
                        <p className="note-text">{fullPatientData.latestNote.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
