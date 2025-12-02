import React from 'react';
import './StepsSection.css';

const StepsSection = () => {
  return (
    <section className="steps_section">
      <h2 className="steps_title">Get a FREE Business Listing in 3 Simple Steps</h2>

      <div className="steps_wrapper">

        {/* Step 1 */}
        <div className="step_block">
          <img
            src="/homeimages/step1.svg"
            alt="Create Account"
            className="step_image"
          />
          <div className="step_text_box">
            <p className="step_num">Step 1</p>
            <h3 className="step_heading">Create Account</h3>
            <p className="step_desc">
              Sign up with your email to get started
            </p>
          </div>
        </div>

        <div className="arrow_box">
          <span className="arrow_icon">»»</span>
        </div>

        {/* Step 2 */}
        <div className="step_block">
          <img
            src="/homeimages/step1.svg"
            alt="Enter Business Details"
            className="step_image"
          />
          <div className="step_text_box">
            <p className="step_num">Step 2</p>
            <h3 className="step_heading">Enter Business Details</h3>
            <p className="step_desc">
              Add name, address and contact info of your business
            </p>
          </div>
        </div>

        <div className="arrow_box">
          <span className="arrow_icon">»»</span>
        </div>

        {/* Step 3 */}
        <div className="step_block">
          <img
            src="/homeimages/step1.svg"
            alt="Select Categories"
            className="step_image"
          />
          <div className="step_text_box">
            <p className="step_num">Step 3</p>
            <h3 className="step_heading">Select Categories</h3>
            <p className="step_desc">
              Add relevant categories to your free listing page
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default StepsSection;
