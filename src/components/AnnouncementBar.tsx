'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has previously dismissed the announcement
    const dismissed = localStorage.getItem('announcement-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span>ARE YOU A MEMBER OF THE TRADE? REGISTER YOUR ACCOUNT HERE</span>
        <button
          className="announcement-close"
          onClick={handleDismiss}
          aria-label="Close announcement"
        >
          ✕
        </button>
      </div>
    </div>
  );
}