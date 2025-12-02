// PopularCategories.jsx
import React from 'react';
import './PopularCategories.css';

function PopularCategories() {
  const categories = [
    { name: "Restaurant", url: "/browse?category=Restaurant" },
    { name: "Retail", url: "/browse?category=Retail" },
    { name: "Technology", url: "/browse?category=Technology" },
    { name: "Healthcare", url: "/browse?category=Healthcare" },
    { name: "Education", url: "/browse?category=Education" },
    { name: "Real Estate", url: "/browse?category=Real+Estate" },
    { name: "Other", url: "/browse?category=Other" },
    { name: "Automotive", url: "/browse?category=Automotive" },
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
