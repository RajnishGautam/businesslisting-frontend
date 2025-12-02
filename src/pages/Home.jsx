import React from 'react';
import GrowSection from '../components/GrowSection';
import StepsSection from "../components/StepsSection";
import PopularCategories from "../components/PopularCategories";
function Home({ onGetStarted }) {
  return (
    <div className="home-page">
      <GrowSection onGetStarted={onGetStarted} />
      <StepsSection />
      <PopularCategories />
    </div>
  );
}

export default Home;