import React, { useState } from "react"
import "./GrowSection.css"

function GrowSection({ onGetStarted = null }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleGetStarted = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    
    // Check if onGetStarted function exists before calling
    if (onGetStarted && typeof onGetStarted === 'function') {
      onGetStarted(email);
    } else {
      console.error('onGetStarted prop is not provided or is not a function');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGetStarted();
    }
  };

  return (
    <section className="growWrap">
      <div className="growLeft">

        <h1 className="growTitle">
          GROW <span>Your Business</span>
        </h1>

        <p className="growSub">
          Advertise with Bizlist to grow your business locally.
        </p>

        <div className="emailBox">
          <input
            type="email"
            className="emailField"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
          />
          <button className="insideBtn" onClick={handleGetStarted}>
            Get Started →
          </button>
        </div>

        {error && <p className="emailError">{error}</p>}

        <ul className="points">
          <li>Rank ahead of your competition</li>
          <li>Find ready to buy customers instantly</li>
          <li>Track leads and competition trends</li>
        </ul>

      </div>

      <div className="growRight">
        <img
          src="/yourImage.png"
          alt="promo"
          className="growImg"
        />
      </div>
    </section>
  )
}

export default GrowSection