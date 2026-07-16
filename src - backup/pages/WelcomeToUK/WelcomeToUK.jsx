import React from 'react';
import './WelcomeToUK.css';

// Placeholder screen shown when the bottom-nav Switch toggle is set to "welcome".
// Content here is intentionally minimal for now — swap the body of
// .wuk-content for real content whenever that's ready.
export default function WelcomeToUK() {
    return (
        <div className="wuk-screen">
            <div className="wuk-content">
                <h1 className="wuk-title">Welcome to UK</h1>
            </div>
        </div>
    );
}
