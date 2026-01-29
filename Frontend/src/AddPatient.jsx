import React, { useState } from 'react';
import './AddPatient.css';
import { API_BASE_URL } from './config';

const AddPatient = ({ onCancel, onSave, patient }) => {
    const isEditing = !!patient;

    const [formData, setFormData] = useState({
        firstName: isEditing ? (patient.name?.split(' ')[0] || '') : '',
        lastName: isEditing ? (patient.name?.split(' ').slice(1).join(' ') || '') : '',
        mrn: patient?.mrn || '',
        dob: isEditing ? (patient.dob?.split(' ')[0] || '') : '',
        gender: patient?.gender || '',
        admissionDate: patient?.admissionDate || '',
        ward: patient?.ward || '',
        roomBed: patient?.roomBed || patient?.bed || '',
        assigningPhysician: patient?.assigningPhysician || '',
        diagnosis: patient?.diagnosis || '',
        contactNumber: patient?.contactNumber || '',
        address: patient?.address || '',
        emergencyContactName: patient?.emergencyContactName || '',
        emergencyContactNumber: patient?.emergencyContactNumber || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const method = isEditing ? 'PATCH' : 'POST'; // Assuming generic update is similar, though specific route for update might be needed
            const url = isEditing
                ? `${API_BASE_URL}/api/patients/${patient.id}/` // Assuming an update endpoint exists or will exist
                : `${API_BASE_URL}/api/patients/add/`;

            // Transform frontend data to backend model expectations if needed
            // Transform frontend data to backend model expectations
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`,
                mrn: formData.mrn,
                dob: formData.dob,
                gender: formData.gender,
                blood_group: formData.bloodGroup || '',
                bed_number: formData.roomBed,
                ward: formData.ward,
                admission_date: formData.admissionDate,
                diagnosis: formData.diagnosis,
                assigning_physician: formData.assigningPhysician,
                contact_number: formData.contactNumber,
                address: formData.address,
                emergency_contact_name: formData.emergencyContactName,
                emergency_contact_number: formData.emergencyContactNumber,
                risk_level: 'Low', // Default
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                alert(isEditing ? 'Patient updated successfully!' : 'Patient added successfully!');
                onSave(data); // Pass back the new/updated patient data
            } else {
                const errorData = await response.json();
                alert(`Error: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error saving patient:", error);
            alert("Failed to save patient. Please check your connection.");
        }
    };

    return (
        <div className="add-patient-container">
            <div className="breadcrumbs">
                Home / Patients / <span className="active">{isEditing ? 'Update Patient' : 'Add New Patient'}</span>
            </div>

            <header className="add-patient-header">
                <h1>{isEditing ? 'Update Patient Details' : 'Add New Patient'}</h1>
                <p>{isEditing ? 'Modify patient demographics and admission details.' : 'Enter patient demographics and initial admission details for the wound care unit.'}</p>
            </header>

            <form className="add-patient-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        PATIENT DEMOGRAPHICS
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name<span className="required">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="e.g. John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name<span className="required">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="e.g. Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row grid-3">
                        <div className="form-group">
                            <label>MRN<span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    name="mrn"
                                    placeholder="MRN-000000"
                                    value={formData.mrn}
                                    onChange={handleChange}
                                    required
                                />
                                <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <span className="field-hint">Unique Medical Record Number</span>
                        </div>
                        <div className="form-group">
                            <label>Date of Birth<span className="required">*</span></label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        ADMISSION DETAILS
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Admission Date<span className="required">*</span></label>
                            <input
                                type="date"
                                name="admissionDate"
                                value={formData.admissionDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ward / Department</label>
                            <select
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                            >
                                <option value="">Select ward</option>
                                <option value="icu">ICU</option>
                                <option value="recovery">Recovery</option>
                                <option value="general">General Ward</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Room / Bed #</label>
                            <input
                                type="text"
                                name="roomBed"
                                placeholder="e.g. 204-B"
                                value={formData.roomBed}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Assigning Physician</label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    name="assigningPhysician"
                                    placeholder="Search physician..."
                                    value={formData.assigningPhysician}
                                    onChange={handleChange}
                                />
                                <svg className="field-icon search" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Primary Diagnosis / Clinical Context</label>
                        <textarea
                            name="diagnosis"
                            placeholder="Enter initial diagnosis or reason for wound care referral..."
                            value={formData.diagnosis}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        CONTACT INFORMATION
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                placeholder="+1 (555) 000-0000"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Home Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="123 Main St, City, Country"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Emergency Contact Name</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                placeholder="Full Name"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Emergency Contact Number</label>
                            <input
                                type="text"
                                name="emergencyContactNumber"
                                placeholder="+1 (555) 999-9999"
                                value={formData.emergencyContactNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="save-button">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        {isEditing ? 'Update Details' : 'Save Patient'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPatient;
