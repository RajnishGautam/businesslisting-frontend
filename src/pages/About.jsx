import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to connecting local businesses with customers in their community. 
            Our platform makes it easy for businesses to showcase their services and for customers 
            to discover amazing local offerings.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Do</h2>
          <p>
            BizList provides a comprehensive directory of local businesses across various categories. 
            Whether you're looking for a restaurant, retail store, tech service, or healthcare provider, 
            we've got you covered.
          </p>
        </div>

        <div className="about-section">
          <h2>For Business Owners</h2>
          <p>
            Are you a business owner? List your business with us for free! Create your profile, 
            upload photos, and reach thousands of potential customers in your area. It's simple, 
            fast, and effective.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Community First:</strong> We believe in supporting local businesses and communities</li>
            <li><strong>Simplicity:</strong> Easy-to-use platform for both businesses and customers</li>
            <li><strong>Trust:</strong> Verified listings and authentic business information</li>
            <li><strong>Growth:</strong> Helping businesses grow and succeed in their local markets</li>
          </ul>
        </div>

        <div className="about-cta">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses already listed on our platform</p>
        </div>
      </div>
    </div>
  );
}

export default About;