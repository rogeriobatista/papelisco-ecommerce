'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import styles from './contact.module.scss';

// Note: We can't export metadata from a client component, so we'll handle SEO differently
// or create a separate layout component if needed

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear status when user starts typing
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.hero}>
        <h1>Contact Us</h1>
        <p className={styles.heroSubtitle}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.contactGrid}>
          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h2>Get in Touch</h2>
            <p>
              Have questions about our products, need support, or want to learn more about Papelisco? 
              We're here to help!
            </p>

            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📧</div>
                <div>
                  <h3>Email</h3>
                  <p>support@papelisco.com</p>
                  <small>We typically respond within 24 hours</small>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                  <small>Mon-Fri 9:00 AM - 6:00 PM EST</small>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 E-commerce Street<br />Digital City, DC 12345</p>
                  <small>Visit our headquarters</small>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>💬</div>
                <div>
                  <h3>Live Chat</h3>
                  <p>Available on our website</p>
                  <small>Mon-Fri 9:00 AM - 8:00 PM EST</small>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2>Send us a Message</h2>
            
            {submitStatus && (
              <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="orders">Order Issues</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How can I track my order?</h3>
              <p>You can track your order by logging into your account and visiting the "My Orders" section, or using the tracking number sent to your email.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>What is your return policy?</h3>
              <p>We offer a 30-day return policy for most items. Products must be in original condition with packaging for a full refund.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Do you offer international shipping?</h3>
              <p>Yes, we ship to many countries worldwide. Shipping costs and delivery times vary by location.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How can I change or cancel my order?</h3>
              <p>Orders can be modified or cancelled within 2 hours of placement. After that, please contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}