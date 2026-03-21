import React from 'react';
import './Privacy.css';

export default function Privacy() {
  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy - Baulko Bell Times Extension</h1>
        
        <p className="last-updated"><strong>Last Updated:</strong> March 21, 2026</p>
        
        <section className="privacy-section">
          <h2>Data Collection</h2>
          <p>This extension collects minimal, non-personal usage data to improve the user experience.</p>
          
          <h3>What We Collect:</h3>
          <ul>
            <li><strong>Anonymous Usage Analytics</strong>: Page views, button clicks, feature usage (via Google Analytics)</li>
            <li><strong>Approximate Location</strong>: Country/region level only (from IP address)</li>
            <li><strong>Device Information</strong>: Browser type, OS type</li>
            <li><strong>Timestamps</strong>: When features are used</li>
          </ul>
          
          <h3>What We DO NOT Collect:</h3>
          <ul>
            <li>Your name, email, or personal identification</li>
            <li>Your search history or browsing activity</li>
            <li>Passwords or authentication credentials</li>
            <li>Health, financial, or sensitive information</li>
            <li>Precise location/GPS data</li>
            <li>Keystroke logging or mouse tracking</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>Google Analytics</h2>
          <p>This extension uses Google Analytics to track anonymous usage data. Google Analytics is subject to <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>
        </section>
        
        <section className="privacy-section">
          <h2>Data Sharing</h2>
          <p>We do not sell or share your data with third parties. Data is only sent to Google Analytics.</p>
        </section>
        
        <section className="privacy-section">
          <h2>Contact</h2>
          <p>For privacy concerns, contact the extension developer.</p>
        </section>
        
        <div className="privacy-footer">
          <button 
            className="back-button"
            onClick={() => handleNavigate('/')}
            aria-label="Back to Home"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
