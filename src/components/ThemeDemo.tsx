'use client';

import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeDemo.module.scss';

export default function ThemeDemo() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.themeDemo}>
      <div className={styles.card}>
        <h2>Theme Switcher Demo</h2>
        <p>Current theme: <strong>{theme}</strong></p>
        <button 
          onClick={toggleTheme}
          className={styles.toggleBtn}
        >
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
        </button>
        
        <div className={styles.colorPalette}>
          <h3>Color Palette Preview</h3>
          <div className={styles.colorGrid}>
            <div className={`${styles.colorSwatch} ${styles.base}`}>
              <span>Base</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.surface0}`}>
              <span>Surface 0</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.surface1}`}>
              <span>Surface 1</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.text}`}>
              <span>Text</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.blue}`}>
              <span>Blue</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.green}`}>
              <span>Green</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.red}`}>
              <span>Red</span>
            </div>
            <div className={`${styles.colorSwatch} ${styles.mauve}`}>
              <span>Mauve</span>
            </div>
          </div>
        </div>

        <div className={styles.componentPreview}>
          <h3>Component Preview</h3>
          
          <div className={styles.previewSection}>
            <h4>Buttons</h4>
            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn}>Primary Button</button>
              <button className={styles.secondaryBtn}>Secondary Button</button>
              <button className={styles.dangerBtn}>Danger Button</button>
            </div>
          </div>

          <div className={styles.previewSection}>
            <h4>Form Elements</h4>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                placeholder="Text input" 
                className={styles.textInput}
              />
              <select className={styles.selectInput}>
                <option>Select option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>

          <div className={styles.previewSection}>
            <h4>Cards</h4>
            <div className={styles.sampleCard}>
              <h5>Sample Card</h5>
              <p>This is a sample card to demonstrate the theme colors and styling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}