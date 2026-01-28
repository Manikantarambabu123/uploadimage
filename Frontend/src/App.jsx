import { useState, useRef, useEffect } from 'react';
import Login from './Login';
import Introduction from './Introduction';
import Sidebar from './Sidebar';
import Settings from './Settings';
import Dashboard from './Dashboard';
import Reports from './Reports';
import Assessments from './Assessments';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [notes, setNotes] = useState('')
  const [patientId, setPatientId] = useState('')
  const [images, setImages] = useState([]) // Stores {url, id} objects
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard'); // sidebar state
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/assessments/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Transform backend assessments to history format
        const historyItems = data.map(item => ({
          id: item.id,
          images: item.image_details.map(img => img.image_url),
          notes: item.notes || '',
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
        setHistory(historyItems);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      // Create previews for all selected images immediately (Optimistic UI)
      // Note: In a real app we might want to only show previews after validation

      const validFiles = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max size is 10MB.`);
          return false;
        }
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          alert(`File ${file.name} has unsupported format. Only PNG and JPG are allowed.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Temporary local previews
      const localPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        id: null,
        status: 'uploading',
        tempKey: Math.random().toString(36).substring(2, 9)
      }));
      setImages(prev => [...prev, ...localPreviews]);

      // Upload each file to the backend
      const token = localStorage.getItem('accessToken');

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('description', file.name);

        try {
          const response = await fetch(`${API_BASE_URL}/api/images/upload/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            console.log('Image uploaded successfully:', data)

            // Update the specific image in state with its database ID using tempKey
            setImages(prev => prev.map(img =>
              img.tempKey === localPreviews[i].tempKey ?
                { ...img, id: data.data.id, status: 'ready' } : img
            ));
          } else {
            const errData = await response.json();
            console.error('Failed to upload image:', file.name, errData);

            // Mark as error so it doesn't block submission indefinitely
            setImages(prev => prev.map(img =>
              img.tempKey === localPreviews[i].tempKey ?
                { ...img, status: 'error', error: errData.message || 'Upload failed' } : img
            ));
          }
        } catch (error) {
          console.error('Error uploading image:', file.name, error)
          // Mark as error on network/other failures
          setImages(prev => prev.map(img =>
            img.tempKey === localPreviews[i].tempKey ?
              { ...img, status: 'error', error: 'Connection error' } : img
          ));
        }
      }
    }
  }

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev]
      if (newImages[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(newImages[index].url)
      }
      newImages.splice(index, 1)
      return newImages
    })
  }


  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image before submitting.')
      handleUploadClick()
      return
    }

    // Check if all images are uploaded
    const isUploading = images.some(img => img.status === 'uploading');
    const hasError = images.some(img => img.status === 'error');

    if (isUploading) {
      alert('Please wait for all images to finish uploading.');
      return;
    }

    if (hasError) {
      alert('Some images failed to upload. Please remove them or try again before submitting.');
      return;
    }

    // Check for Patient ID
    if (!patientId.trim()) {
      alert('Please enter a Patient ID before submitting.');
      return;
    }

    setIsAnalyzing(true)
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/assessments/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: notes,
          images: images.map(img => img.id),
          patient_id: patientId
        }),
      });

      if (response.ok) {
        await response.json();
        alert('Assessment submitted successfully!');
        setImages([]);
        setNotes('');
        setPatientId('');
        fetchHistory(); // Refresh history from backend
      } else {
        const errData = await response.json();
        alert(`Failed to submit assessment: ${JSON.stringify(errData)}`);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Error submitting assessment. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (showIntro) {
    return <Introduction onFinish={() => setShowIntro(false)} />
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => {
      setIsLoggedIn(true);
    }} />
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setShowIntro(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setIsCreatingAssessment(false); // Reset to list view when switching tabs
      }} />
      <div className="main-content">
        <Navbar activeTab={activeTab} />
        <div className="page-content">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : activeTab === 'reports' ? (
            <Reports />
          ) : activeTab === 'settings' ? (
            <Settings />
          ) : (
            <>
              {activeTab === 'assessments' && !isCreatingAssessment ? (
                <Assessments onNew={() => setIsCreatingAssessment(true)} />
              ) : (
                <div className="container">
                  {/* History Modal */}
                  {showHistory && (
                    <div className="modal-overlay" onClick={() => setShowHistory(false)}>
                      <div className="history-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowHistory(false)}>Close</button>
                        <h2>Assessment History</h2>
                        {history.length === 0 ? (
                          <p>No previous assessments found.</p>
                        ) : (
                          <div className="history-grid">
                            {history.map(item => (
                              <div key={item.id} className="history-item">
                                <div className="history-images-row" style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '8px' }}>
                                  {item.images && item.images.length > 0 ? (
                                    item.images.map((img, idx) => (
                                      <img key={idx} src={img} alt={`Wound ${idx}`} style={{ width: '60px', height: '60px', flexShrink: 0 }} />
                                    ))
                                  ) : (
                                    <div style={{ height: '60px', width: '60px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      No Image
                                    </div>
                                  )}
                                </div>
                                <div className="history-item-date">{item.date}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Left Column */}
                  <div className="left-column">

                    <div className="card history-card">
                      <div className="history-content">
                        <div className="history-icon-circle">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8v4l3 3"></path>
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
                          </svg>
                        </div>
                        <div className="history-info">
                          <h3>Previous Assessments</h3>
                          {history.length > 0 ? (
                            <>
                              <p>Last assessment on {history[0].date}</p>
                              <p>{history[0].notes ? history[0].notes.substring(0, 30) + '...' : 'No notes provided.'}</p>
                            </>
                          ) : (
                            <>
                              <p>Last assessment on Jan 12, 2026</p>
                              <p>showed signs of healing.</p>
                              <p>Measurements: 4.2cm x 2.1cm.</p>
                            </>
                          )}
                          <span className="view-history" onClick={() => setShowHistory(true)}>View History</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="right-column">
                    <div className="section-title">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                      Visual Documentation
                    </div>

                    <div className="card">
                      <div className="upload-zone" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                        <input
                          type="file"
                          multiple // Enable multiple files
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <div className="upload-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </div>
                        <p className="upload-text">
                          <span style={{ color: '#2563eb', fontWeight: 700 }}>Click to upload</span> or drag and drop
                        </p>
                        <p className="upload-hint">PNG, JPG up to 10MB</p>
                      </div>

                      {images.length > 0 && (
                        <div className="preview-container">
                          {images.map((img, index) => (
                            <div key={index} className={`preview-thumb ${img.status}`}>
                              <img src={img.url} alt={`Preview ${index}`} />
                              {img.status === 'uploading' && (
                                <div className="upload-overlay">
                                  <div className="spinner"></div>
                                  <span>Uploading...</span>
                                </div>
                              )}
                              {img.status === 'error' && (
                                <div className="upload-overlay error">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                  </svg>
                                  <span>Failed</span>
                                </div>
                              )}
                              <div className="remove-image" onClick={(e) => { e.stopPropagation(); removeImage(index); }}>×</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="section-title" style={{ marginTop: '40px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Patient Identification
                    </div>

                    <input
                      type="text"
                      className="patient-input"
                      placeholder="Enter Patient ID (e.g. P-1002)"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '20px',
                        fontSize: '14px',
                        backgroundColor: '#f8fafc'
                      }}
                    />

                    <div className="section-title">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Clinical Notes
                    </div>

                    <textarea
                      className="notes-input"
                      placeholder="Add detailed observations regarding tissue type, wound edge, surrounding skin, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Footer */}
                  <div className="footer-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={handleSubmit}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Save & Add Another'}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Processing Analysis...' : 'Submit Assessment'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
