// PopularCategories.jsx
import React from 'react';
import './PopularCategories.css';

function PopularCategories() {
  const categories = [
    { name: "Restaurant", url: "/business?category=Restaurant" },
    { name: "Retail", url: "/business?category=Retail" },
    { name: "Technology", url: "/business?category=Technology" },
    { name: "Healthcare", url: "/business?category=Healthcare" },
    { name: "Education", url: "/business?category=Education" },
    { name: "Real Estate", url: "/business?category=Real+Estate" },
    { name: "Other", url: "/business?category=Other" },
    { name: "Automotive", url: "/business?category=Automotive" },
    // ... add remaining 43 manually
  ];

  return (
    <section className="popular-categories-section">
      <h2 className="categories-title">Popular Categories</h2>
      <div className="categories-container">
        {categories.map((cat, index) => (
          <React.Fragment key={index}>
            <a href={cat.url} className="category-link">
              {cat.name}
            </a>
            {index !== categories.length - 1 && <span className="separator"> | </span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export default PopularCategories;
