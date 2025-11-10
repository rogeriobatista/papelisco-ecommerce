'use client';

import { useState } from 'react';
import { 
  formatCardNumber, 
  validateCardNumber, 
  formatExpiryDate, 
  validateExpiryDate, 
  formatCVV, 
  validateCVV, 
  detectCardType 
} from '@/utils/creditCard';

export default function TestCreditCardPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatExpiryDate(value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCVV(value);
    setCvv(formatted);
  };

  // Test cases
  const testCases = [
    { name: 'Visa', number: '4111111111111111' },
    { name: 'Mastercard', number: '5555555555554444' },
    { name: 'American Express', number: '378282246310005' },
    { name: 'Discover', number: '6011111111111117' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Credit Card Validation Test</h1>
      
      <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Interactive Test</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="Enter card number"
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '5px', fontSize: '14px' }}>
            <strong>Valid:</strong> {validateCardNumber(cardNumber) ? '✅ Yes' : '❌ No'} | 
            <strong> Type:</strong> {detectCardType(cardNumber) || 'Unknown'} | 
            <strong> Formatted:</strong> {cardNumber}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Expiry Date:</label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '5px', fontSize: '14px' }}>
            <strong>Valid:</strong> {validateExpiryDate(expiryDate) ? '✅ Yes' : '❌ No'} | 
            <strong> Formatted:</strong> {expiryDate}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>CVV:</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '5px', fontSize: '14px' }}>
            <strong>Valid:</strong> {validateCVV(cvv) ? '✅ Yes' : '❌ No'} | 
            <strong> Formatted:</strong> {cvv}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Predefined Test Cases</h2>
        {testCases.map((testCase, index) => (
          <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>{testCase.name}</strong>: {testCase.number}
            <br />
            <strong>Valid:</strong> {validateCardNumber(testCase.number) ? '✅ Yes' : '❌ No'} | 
            <strong> Type:</strong> {detectCardType(testCase.number)} | 
            <strong> Formatted:</strong> {formatCardNumber(testCase.number)}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Debug Information</h2>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{JSON.stringify({
  rawCardNumber: cardNumber.replace(/\s/g, ''),
  cardNumberLength: cardNumber.replace(/\s/g, '').length,
  formattedCardNumber: cardNumber,
  isValid: validateCardNumber(cardNumber),
  cardType: detectCardType(cardNumber),
  expiryDate: expiryDate,
  expiryValid: validateExpiryDate(expiryDate),
  cvv: cvv,
  cvvValid: validateCVV(cvv)
}, null, 2)}
        </pre>
      </div>
    </div>
  );
}