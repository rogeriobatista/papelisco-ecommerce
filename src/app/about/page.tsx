import type { Metadata } from 'next';
import styles from './about.module.scss';

export const metadata: Metadata = {
  title: 'About Us - Papelisco',
  description: 'Learn more about Papelisco, your trusted e-commerce destination for mobile phones, electronics, books, and more.',
};

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.hero}>
        <h1>About Papelisco</h1>
        <p className={styles.heroSubtitle}>
          Your trusted e-commerce destination for quality products and exceptional service
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Story</h2>
          <p>
            Founded with a vision to make quality products accessible to everyone, Papelisco has grown from a 
            small startup to a trusted e-commerce platform. We specialize in mobile phones, electronics, books, 
            and a wide range of products that enhance your daily life.
          </p>
          <p>
            Our commitment to excellence drives us to carefully curate our product selection, ensuring that 
            every item meets our high standards for quality, functionality, and value.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What We Offer</h2>
          <div className={styles.offeringsGrid}>
            <div className={styles.offering}>
              <div className={styles.offeringIcon}>📱</div>
              <h3>Mobile Phones</h3>
              <p>Latest smartphones from top brands with competitive prices and warranty coverage.</p>
            </div>
            <div className={styles.offering}>
              <div className={styles.offeringIcon}>💻</div>
              <h3>Electronics</h3>
              <p>Cutting-edge electronics and gadgets for work, entertainment, and daily use.</p>
            </div>
            <div className={styles.offering}>
              <div className={styles.offeringIcon}>📚</div>
              <h3>Books</h3>
              <p>Extensive collection of books across various genres and educational materials.</p>
            </div>
            <div className={styles.offering}>
              <div className={styles.offeringIcon}>🏠</div>
              <h3>Home & Living</h3>
              <p>Quality products to enhance your living space and daily comfort.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.value}>
              <h3>Quality First</h3>
              <p>We never compromise on quality. Every product is carefully selected and tested.</p>
            </div>
            <div className={styles.value}>
              <h3>Customer Focus</h3>
              <p>Your satisfaction is our priority. We provide exceptional customer service and support.</p>
            </div>
            <div className={styles.value}>
              <h3>Innovation</h3>
              <p>We continuously evolve our platform to provide the best shopping experience.</p>
            </div>
            <div className={styles.value}>
              <h3>Trust & Security</h3>
              <p>Your personal information and transactions are protected with industry-leading security.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Why Choose Papelisco?</h2>
          <ul className={styles.benefitsList}>
            <li>✅ <strong>Wide Product Range:</strong> From electronics to books, we have everything you need</li>
            <li>✅ <strong>Competitive Prices:</strong> Best prices guaranteed with regular discounts and offers</li>
            <li>✅ <strong>Fast Shipping:</strong> Quick and reliable delivery to your doorstep</li>
            <li>✅ <strong>Secure Payments:</strong> Multiple payment options with bank-level security</li>
            <li>✅ <strong>Easy Returns:</strong> Hassle-free return and exchange policy</li>
            <li>✅ <strong>24/7 Support:</strong> Round-the-clock customer service for all your needs</li>
          </ul>
        </section>

        <section className={styles.contactCta}>
          <h2>Get in Touch</h2>
          <p>
            Have questions about our products or services? We'd love to hear from you!
          </p>
          <a href="/contact" className={styles.ctaButton}>
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}