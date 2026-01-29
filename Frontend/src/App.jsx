import { useState, useRef, useEffect } from 'react';
import Login from './Login';
import Introduction from './Introduction';
import Sidebar from './Sidebar';
import Settings from './Settings';
import Dashboard from './Dashboard';
import Reports from './Reports';
import Assessments from './Assessments';
import Patients from './Patients';
import AddPatient from './AddPatient';
import PatientProfile from './PatientProfile';
import AddAssessment from './AddAssessment';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('accessToken'))
  const [showIntro, setShowIntro] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const introFinished = localStorage.getItem('introFinished');
    // If not logged in already, show intro first.
    return !token && !introFinished;
  })
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try { return stored ? JSON.parse(stored) : null; } catch (e) { return null; }
  })
  const [notes, setNotes] = useState('')
  const [patientId, setPatientId] = useState('')
  const [images, setImages] = useState([]) // Stores {url, id} objects
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // Navigation Persistence
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || 'dashboard');
  const [searchTerm, setSearchTerm] = useState(''); // global search
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(() => sessionStorage.getItem('isCreatingAssessment') === 'true');
  const [isAddingPatient, setIsAddingPatient] = useState(() => sessionStorage.getItem('isAddingPatient') === 'true');
  const [isEditingPatient, setIsEditingPatient] = useState(() => sessionStorage.getItem('isEditingPatient') === 'true');
  const [selectedPatient, setSelectedPatient] = useState(() => {
    const saved = sessionStorage.getItem('selectedPatient');
    try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
    sessionStorage.setItem('isCreatingAssessment', isCreatingAssessment);
    sessionStorage.setItem('isAddingPatient', isAddingPatient);
    sessionStorage.setItem('isEditingPatient', isEditingPatient);
    if (selectedPatient) {
      sessionStorage.setItem('selectedPatient', JSON.stringify(selectedPatient));
    } else {
      sessionStorage.removeItem('selectedPatient');
    }
  }, [activeTab, isCreatingAssessment, isAddingPatient, isEditingPatient, selectedPatient]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      setShowIntro(false);
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
    return <Introduction onFinish={() => {
      localStorage.setItem('introFinished', 'true');
      setShowIntro(false);
    }} />
  }

  if (!isLoggedIn) {
    return <Login onLogin={(userData) => {
      setIsLoggedIn(true);
      setUser(userData);
    }} />
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear(); // Clear navigation persistence
    setIsLoggedIn(false);
    setUser(null);
    setShowIntro(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setIsCreatingAssessment(false); // Reset to list view when switching tabs
        setIsAddingPatient(false);
        setIsEditingPatient(false);
        setSelectedPatient(null);
      }} />
      <div className="main-content">
        <Navbar
          activeTab={activeTab}
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="page-content">
          {(() => {
            if (activeTab === 'dashboard') return <Dashboard />;
            if (activeTab === 'reports') return <Reports />;
            if (activeTab === 'settings') return <Settings />;
            if (activeTab === 'alerts') return (
              <div style={{ padding: '80px 40px', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '40px auto' }}>
                <div style={{ width: '64px', height: '64px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h2 style={{ color: '#0f172a', marginBottom: '12px' }}>Alerts Module</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>The real-time clinical alerts dashboard is currently being integrated.</p>
              </div>
            );

            if (activeTab === 'patients') {
              if (isAddingPatient) return <AddPatient onCancel={() => setIsAddingPatient(false)} onSave={() => setIsAddingPatient(false)} />;
              if (isEditingPatient) return (
                <AddPatient
                  patient={selectedPatient}
                  onCancel={() => setIsEditingPatient(false)}
                  onSave={(updatedPatient) => {
                    setSelectedPatient(updatedPatient);
                    setIsEditingPatient(false);
                  }}
                />
              );
              if (selectedPatient) return (
                <PatientProfile
                  patient={selectedPatient}
                  onBack={() => setSelectedPatient(null)}
                  onEditPatient={() => setIsEditingPatient(true)}
                  onNewAssessment={() => {
                    setActiveTab('assessments');
                    setIsCreatingAssessment(true);
                  }}
                />
              );
              return (
                <Patients
                  onAddPatient={() => setIsAddingPatient(true)}
                  onViewPatient={(p) => setSelectedPatient(p)}
                  sharedSearchTerm={searchTerm}
                  setSharedSearchTerm={setSearchTerm}
                />
              );
            }

            if (activeTab === 'assessments') {
              if (isCreatingAssessment) return (
                <AddAssessment
                  patient={selectedPatient}
                  onCancel={() => setIsCreatingAssessment(false)}
                  onSave={() => {
                    setIsCreatingAssessment(false);
                    if (selectedPatient) {
                      setActiveTab('patients');
                    }
                  }}
                />
              );
              return (
                <Assessments
                  onNew={() => setIsCreatingAssessment(true)}
                  onViewPatient={(p) => {
                    setSelectedPatient(p);
                    setActiveTab('patients');
                  }}
                />
              );
            }

            // Fallback / Default
            return (
              <div className="container">
                {/* Legacy Content or Fallback UI */}
                <h2 style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>Select a module from the sidebar</h2>
              </div>
            );
          })()}
        </div>
      </div>
    </div >
  );
}

export default App
