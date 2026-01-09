import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./Contact.css";

const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim().replace(/\s+/g, "");
    const message = formData.get("message").trim();

    // Basic validation
    if (!name || !email || !phone) {
      alert("Please fill all required fields: Name, Email, and Phone Number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number with optional country code.");
      return;
    }

    // Show success message immediately
    setShowSuccess(true);
    e.target.reset();
    setTimeout(() => setShowSuccess(false), 3000);

    // Send data to Google Apps Script (no-cors, same as HeroWithVideo)
    fetch(
      "https://script.google.com/macros/s/AKfycbygkQxRpUJv5yPshUjb7AFc10G6PU8vF6IO77iP0K9t417DNhXLwgf2ZaC2XB0sgE6rZA/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ name, email, phone, message }),
        headers: { "Content-Type": "application/json" },
      }
    ).catch((err) => console.error("Error sending form data:", err));
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <div className="contact-header">
        <div className="header-content">
          <h1 className="contact-title">Get In Touch</h1>
        </div>
      </div>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Let's Start a Conversation</h2>
            <p>
              We're here to help you bring your ideas to life. Whether you have
              a question about our services or want to discuss your next
              project, we're just a message away.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <FaWhatsapp className="contact-icon" />
                <div>
                  <h4>WhatsApp</h4>
                  <h5>
                    <a
                      href="https://wa.me/917838649867"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +91 7838649867
                    </a>
                  </h5>
                </div>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <h5>
                    <a href="mailto:hello@dDotit.com">
                      support@7dotit.solutions
                    </a>
                  </h5>
                </div>
              </div>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>Office</h4>
                  <h5>
                    SCO 2/3 IT Park, Chandigarh,
                    <br />
                    (Panchkula)
                  </h5>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-media">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/share/1CRjRz1M3j/"
                  className="social-link facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://www.instagram.com/7dot_it_solutions?igsh=MTNpMHozYm13cHd0aA=="
                  className="social-link instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://wa.me/917838649867"
                  className="social-link whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href="https://www.linkedin.com/company/7dot-it-soln/"
                  className="social-link linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                required
              />

              <textarea
                name="message"
                placeholder="Tell us about your project..."
                rows="6"
              ></textarea>

              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>

            {showSuccess && (
              <div className="success-message">
                Thank you! We have received your message and will get back to
                you soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
    </div>
  );
};

export default ContactPage;
