// Test the credit card validation functions
import { validateCardNumber, validateExpiryDate, validateCVV, formatCardNumber } from '../src/utils/creditCard.js';

console.log('Testing Credit Card Validation Functions');
console.log('==========================================');

// Test valid card numbers
const testCards = [
  '4111111111111111', // Visa
  '5555555555554444', // Mastercard
  '378282246310005',  // Amex
  '6011111111111117'  // Discover
];

console.log('\nTesting valid card numbers:');
testCards.forEach(card => {
  console.log(`${card}: ${validateCardNumber(card) ? 'VALID' : 'INVALID'}`);
});

// Test invalid card numbers
const invalidCards = [
  '1234567890123456', // Invalid number
  '4111111111111112', // Wrong check digit
  '123',              // Too short
  ''                  // Empty
];

console.log('\nTesting invalid card numbers:');
invalidCards.forEach(card => {
  console.log(`${card}: ${validateCardNumber(card) ? 'VALID' : 'INVALID'}`);
});

// Test formatted card numbers
console.log('\nTesting formatted card numbers:');
testCards.forEach(card => {
  const formatted = formatCardNumber(card);
  console.log(`${card} -> ${formatted}: ${validateCardNumber(formatted) ? 'VALID' : 'INVALID'}`);
});

// Test expiry dates
const validExpiry = [
  '12/25',
  '01/30',
  '06/24'
];

const invalidExpiry = [
  '13/25', // Invalid month
  '00/25', // Invalid month
  '12/23', // Past date (assuming current year is 2024+)
  '1/25',  // Single digit month
  '12/2',  // Single digit year
  ''       // Empty
];

console.log('\nTesting valid expiry dates:');
validExpiry.forEach(date => {
  console.log(`${date}: ${validateExpiryDate(date) ? 'VALID' : 'INVALID'}`);
});

console.log('\nTesting invalid expiry dates:');
invalidExpiry.forEach(date => {
  console.log(`${date}: ${validateExpiryDate(date) ? 'VALID' : 'INVALID'}`);
});

// Test CVV
const validCVV = ['123', '1234', '567'];
const invalidCVV = ['12', '12345', '', 'abc'];

console.log('\nTesting valid CVV:');
validCVV.forEach(cvv => {
  console.log(`${cvv}: ${validateCVV(cvv) ? 'VALID' : 'INVALID'}`);
});

console.log('\nTesting invalid CVV:');
invalidCVV.forEach(cvv => {
  console.log(`${cvv}: ${validateCVV(cvv) ? 'VALID' : 'INVALID'}`);
});