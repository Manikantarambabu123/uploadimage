import React, { useState } from 'react';
import './Introduction.css';

// Importing local intro images from assets
import step1Img from './assets/12.png';
import step2Img from './assets/23.png';
import step3Img from './assets/34.png';

const steps = [
    {
        title: "Automated Wound Measurement",
        subtitle: "STEP 1 OF 3",
        description: "Our AI algorithms automatically measure surface area and depth, reducing documentation time by 40%. Eliminate manual ruler errors and get precise clinical data instantly.",
        features: ["Instant contour detection", "Tissue type segmentation"],
        image: step1Img,
        primaryBtn: "Next Step"
    },
    {
        title: "AI-Driven Measurement",
        subtitle: "STEP 2 OF 3",
        description: "Our AI algorithms automatically calculates surface area and depth with 98% accuracy, removing subjectivity from your documentation and ensuring consistent longitudinal tracking.",
        features: ["Instant contour detection", "Tissue type segmentation"],
        image: step2Img,
        primaryBtn: "Next Step"
    },
    {
        title: "Start Your First Assessment",
        subtitle: "STEP 3 OF 3",
        description: "The AI is calibrated and ready. You can now upload wound imagery for instant analysis and documentation. Click below to begin.",
        features: ["System is secured and HIPAA compliant."],
        image: step3Img,
        primaryBtn: "Get Started"
    }
];

const Introduction = ({ onFinish }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];

    return (
        <div className="intro-screen">
            <header className="intro-header">
                <div className="intro-logo-section">
                    <div className="logo-container">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#2563EB" />
                            <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="header-text">
                        <h1>Wound Assessment Tool</h1>
                        <p>Hospital - Grade Diagnostics</p>
                    </div>
                </div>
                <button className="skip-btn" onClick={onFinish}>Skip Intro</button>
            </header>

            <main className="intro-main">
                <div className="intro-card">
                    <div className="intro-image-pane">
                        <img src={step.image} alt={step.title} />
                    </div>
                    <div className="intro-content-pane">
                        <div className="step-counter">{step.subtitle}</div>
                        <h2 className="step-title">{step.title}</h2>
                        <p className="step-description">{step.description}</p>

                        <ul className="feature-list">
                            {step.features.map((feature, idx) => (
                                <li key={idx}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" fill="#2563EB" />
                                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="progress-container">
                            <div className="progress-bar-background">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="intro-actions">
                            <button
                                className="btn-prev"
                                onClick={handlePrevious}
                            >
                                Previous
                            </button>
                            <button className="btn-next" onClick={handleNext}>
                                {step.primaryBtn} <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Introduction;
