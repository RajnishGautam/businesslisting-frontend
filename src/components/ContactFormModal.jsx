import React, { useState } from 'react';
import './ContactFormModal.css';

function ContactFormModal({ business, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7InC3YOIUaFofyYSJKDazRsi_JaaxpW5Bwocd97qR5b-3Ay6NnZ2azIgfFrPFQpHVpw/exec';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    return newErrors;
  };

  const sendToGoogleSheets = async (contactData) => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });
      
      // Note: no-cors mode doesn't allow reading the response
      // but the data will still be saved
      console.log('Data sent to Google Sheets');
      return true;
      
    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for Google Sheets
    const contactData = {
      timestamp: new Date().toLocaleString(),
      businessName: business.businessName,
      businessId: business._id,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      businessPhone: business.phone
    };
    
    // Send to Google Sheets
    await sendToGoogleSheets(contactData);
    
    // Still log to console for debugging
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log(contactData);
    console.log('================================');
    
    setIsSubmitting(false);
    onSuccess(business.phone);
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="contact-close-btn" onClick={onClose}>×</button>
        
        <div className="contact-modal-header">
          <h2>Contact {business.businessName}</h2>
          <p>Fill in your details to view contact information</p>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="contact-form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="contact-form-group">
            <label htmlFor="phone">Your Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <button 
            type="submit" 
            className="contact-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'View Contact Details'}
          </button>
          
          <p className="contact-note">
            📝 Your information will be shared with the business owner
          </p>
        </form>
      </div>
    </div>
  );
}

export default ContactFormModal;