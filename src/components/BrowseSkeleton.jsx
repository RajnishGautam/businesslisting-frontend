import React from "react"
import "./BrowseSkeleton.css"

function BrowseSkeleton() {
  return (
    <div className="browse-card skeleton-card">
      <div className="browse-card-image-wrapper skeleton-box"></div>

      <div className="browse-card-content">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line rating"></div>
        <div className="skeleton-line address"></div>

        <div className="skeleton-actions">
          <div className="skeleton-btn"></div>
          <div className="skeleton-btn"></div>
        </div>
      </div>
    </div>
  )
}

export default BrowseSkeleton
