import React, { useState } from 'react';
import './Onboarding.css';

// Journey stages/statuses, imported directly so onboarding stays in sync with
// src/data/stages.js — no separate hardcoded list to drift out of sync.
import { STATUSES } from '../../data/stages';

// Adjust this path if you move this file — currently assumes this component
// lives at src/pages/Onboarding/Onboarding.jsx. Still used for Screen 1's
// hero photo; Screens 2 and 3 no longer use any background image per the
// "clean, flat Home-matching background, no blurred imagery" requirement.
import bigBenImg from '../../assets/images/big-ben.png';

const INTAKE_OPTIONS = [
    'January 2027',
    'May 2027',
    'September 2027',
    'January 2028',
];

const FEATURES = [
    { icon: '🎓', label: 'University search' },
    { icon: '🏫', label: 'Compare universities' },
    { icon: '📋', label: 'Application tracking' },
    { icon: '✅', label: 'Smart task manager' },
    { icon: '📄', label: 'CAS & UKVI' },
    { icon: '💰', label: 'Budget calculator' },
    { icon: '🎒', label: 'Packing planner' },
    { icon: '📖', label: 'UK life guides' },
    { icon: '🏅', label: 'Scholarship finder' },
    { icon: '🛂', label: 'Visa guidance' },
];

function UKFlagBadge() {
    return (
        <div className="ob-flag-badge" aria-hidden="true">
            <span className="ob-flag-stripe ob-flag-green" />
            <span className="ob-flag-stripe ob-flag-white" />
            <span className="ob-flag-stripe ob-flag-orange" />
        </div>
    );
}

function ProgressDots({ total, activeIndex }) {
    return (
        <div className="ob-dots" role="progressbar" aria-valuenow={activeIndex + 1} aria-valuemin={1} aria-valuemax={total}>
            {Array.from({ length: total }).map((_, i) => (
                <span key={i} className={`ob-dot ${i === activeIndex ? 'ob-dot-active' : ''}`} />
            ))}
        </div>
    );
}

function ScreenOne({ onNext }) {
    return (
        <div className="ob-screen ob-screen-dark">
            <div className="ob-topbar">
                <span className="ob-gb-label">GB</span>
            </div>

            {/* Flag moved here — centered, directly above the title — instead
                of the old top-right corner slot. GB label above stays put. */}
            <div className="ob-flag-center">
                <UKFlagBadge />
            </div>

            <h1 className="ob-hero-title">Journey to UK</h1>
            <div className="ob-hero-tagline">
                <span>from dream to destination</span>
                <span>from destination to success</span>
            </div>

            <div className="ob-hero-image-wrap">
                <img
                    className="ob-hero-image"
                    src={bigBenImg}
                    alt="Illustration of a UK landmark tower"
                />
            </div>

            <p className="ob-hero-subtitle">
                Your personal UK student journey manager — from offers to arrival.
            </p>

            <ProgressDots total={3} activeIndex={0} />

            <div className="ob-bottom-action">
                <button type="button" className="ob-btn ob-btn-primary" onClick={onNext}>
                    Start my journey
                </button>
            </div>
        </div>
    );
}

function ScreenTwo({ onNext, onBack }) {
    return (
        <div className="ob-screen ob-screen-dark">
            <button type="button" className="ob-back" onClick={onBack} aria-label="Go back">
                ←
            </button>

            <ProgressDots total={3} activeIndex={1} />

            <h2 className="ob-light-title">
                We&rsquo;ll help you on every step of your UK journey 🚀
            </h2>
            <p className="ob-light-subtitle">Everything you need, all in one place.</p>

            <div className="ob-feature-grid">
                {FEATURES.map((f) => (
                    <div className="ob-feature-card" key={f.label}>
                        <span className="ob-feature-icon" aria-hidden="true">{f.icon}</span>
                        <span className="ob-feature-label">{f.label}</span>
                    </div>
                ))}
            </div>

            <div className="ob-bottom-action">
                <button type="button" className="ob-btn ob-btn-primary" onClick={onNext}>
                    Continue
                </button>
            </div>
        </div>
    );
}

function ScreenThree({ onFinish, onSkip, onBack }) {
    const [name, setName] = useState('');
    const [statusId, setStatusId] = useState('');
    const [intake, setIntake] = useState('');

    const handleBuild = () => {
        onFinish({ name, statusId: statusId === '' ? 0 : Number(statusId), intake });
    };

    return (
        // Flat dark background matching Home exactly — no photo, no blur, no
        // gradient. The old ob-photo-bg / ob-photo-overlay elements are gone.
        <div className="ob-screen ob-screen-dark ob-screen-setup">
            <button type="button" className="ob-back" onClick={onBack} aria-label="Go back">
                ←
            </button>

            <h2 className="ob-photo-title">Let&rsquo;s personalize your journey 🚀</h2>

            <div className="ob-form-card">
                <label className="ob-field-label" htmlFor="ob-name">What should we call you?</label>
                <input
                    id="ob-name"
                    className="ob-input"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="ob-field-label" htmlFor="ob-status">Where are you now?</label>
                <select
                    id="ob-status"
                    className="ob-select"
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                >
                    <option value="">Select your current status</option>
                    {STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
                    ))}
                </select>

                <label className="ob-field-label" htmlFor="ob-intake">Which intake are you aiming for?</label>
                <select
                    id="ob-intake"
                    className="ob-select"
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                >
                    <option value="">Select intake</option>
                    {INTAKE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className="ob-bottom-action">
                <button type="button" className="ob-btn ob-btn-primary" onClick={handleBuild}>
                    Build my journey →
                </button>
                <button type="button" className="ob-skip-link" onClick={onSkip}>
                    I&rsquo;ll set up later
                </button>
            </div>
        </div>
    );
}

export default function Onboarding({ onComplete = () => {
    // eslint-disable-next-line no-console
    console.warn('Onboarding: no onComplete prop was passed — nothing will happen after this flow finishes. See usage example in the file header comments.');
} }) {
    const [step, setStep] = useState(1);

    let activeScreen;
    if (step === 1) {
        activeScreen = <ScreenOne onNext={() => setStep(2)} />;
    } else if (step === 2) {
        activeScreen = <ScreenTwo onNext={() => setStep(3)} onBack={() => setStep(1)} />;
    } else {
        activeScreen = (
            <ScreenThree
                onFinish={(data) => onComplete({ skipped: false, profile: data })}
                onSkip={() => onComplete({ skipped: true, profile: null })}
                onBack={() => setStep(2)}
            />
        );
    }

    return (
        <div className="ob-frame-outer">
            <div className="ob-frame-inner">{activeScreen}</div>
        </div>
    );
}
