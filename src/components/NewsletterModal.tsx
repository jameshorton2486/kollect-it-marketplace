'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface NewsletterModalProps {
  delaySeconds?: number;
}

export default function NewsletterModal({ delaySeconds = 30 }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('kollect-it-newsletter-seen');

    if (!hasSeenModal) {
      // Show modal after delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Focus first input when modal opens
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }, delaySeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [delaySeconds]);

  useEffect(() => {
    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (!isOpen || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, input, textarea, select, a[href]'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('kollect-it-newsletter-seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setIsSuccess(true);
      localStorage.setItem('kollect-it-newsletter-seen', 'true');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    // Trigger PDF download
    window.open('/downloads/collectors-guide-antique-books.pdf', '_blank');
    setTimeout(handleClose, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="newsletter-modal-overlay"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="newsletter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="newsletter-modal-close"
          aria-label="Close newsletter modal"
        >
          <X size={24} />
        </button>

        <div className="newsletter-modal-content">
          {!isSuccess ? (
            <>
              {/* Icon */}
              <div className="newsletter-modal-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="16" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 20L32 32L52 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Heading */}
              <h2 id="newsletter-modal-title" className="newsletter-modal-title">
                Preserve Your Collection
              </h2>

              {/* Subheading */}
              <p className="newsletter-modal-subtitle">
                Download our free <strong>Collector's Guide to Caring for Antique Books</strong>
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="newsletter-modal-form">
                <div className="form-group">
                  <label htmlFor="newsletter-email" className="form-label">
                    Email Address
                  </label>
                  <input
                    ref={firstInputRef}
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newsletter-firstname" className="form-label">
                    First Name <span className="opacity-60">(optional)</span>
                  </label>
                  <input
                    id="newsletter-firstname"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                {error && (
                  <div className="newsletter-modal-error" role="alert">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="newsletter-modal-submit">
                  {isSubmitting ? 'Subscribing...' : 'Get Your Free Guide'}
                </Button>
              </form>

              {/* Trust message */}
              <p className="newsletter-modal-trust">
                We never sell your info • 1-click unsubscribe
              </p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="newsletter-modal-success-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 className="newsletter-modal-title">
                Check Your Inbox!
              </h2>

              <p className="newsletter-modal-subtitle">
                We've sent you the Collector's Guide to <strong>{email}</strong>
              </p>

              <Button onClick={handleDownload} className="newsletter-modal-submit">
                Download Guide Now
              </Button>

              <p className="newsletter-modal-trust">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="underline bg-transparent border-0 text-inherit cursor-pointer"
                >
                  try again
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
