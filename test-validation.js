#!/usr/bin/env node

// Test script for credit card validation
console.log('Testing Credit Card Validation...');

// Simple Luhn algorithm implementation
function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/[^0-9]/g, '').split('').map(Number);
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function validateCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/[^0-9]/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  return luhnCheck(cleanNumber);
}

// Test cases
const testCases = [
  { number: '4111111111111111', expected: true, name: 'Visa Test Card' },
  { number: '5555555555554444', expected: true, name: 'Mastercard Test Card' },
  { number: '378282246310005', expected: true, name: 'Amex Test Card' },
  { number: '6011111111111117', expected: true, name: 'Discover Test Card' },
  { number: '4111 1111 1111 1111', expected: true, name: 'Visa with spaces' },
  { number: '1234567890123456', expected: false, name: 'Invalid number' },
  { number: '4111111111111112', expected: false, name: 'Wrong check digit' }
];

console.log('Card Number Validation Tests:');
console.log('============================');

testCases.forEach(test => {
  const result = validateCardNumber(test.number);
  const status = result === test.expected ? 'PASS' : 'FAIL';
  console.log(`${status}: ${test.name} (${test.number}) - Expected: ${test.expected}, Got: ${result}`);
});

// Test expiry date validation
function validateExpiryDate(expiryDate) {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  
  if (!regex.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
}

const expiryTests = [
  { date: '12/25', expected: true, name: 'Valid future date' },
  { date: '01/30', expected: true, name: 'Valid far future date' },
  { date: '13/25', expected: false, name: 'Invalid month (13)' },
  { date: '00/25', expected: false, name: 'Invalid month (00)' },
  { date: '12/20', expected: false, name: 'Past date' },
  { date: '1/25', expected: false, name: 'Single digit month' },
  { date: '12/2', expected: false, name: 'Single digit year' }
];

console.log('\nExpiry Date Validation Tests:');
console.log('=============================');

expiryTests.forEach(test => {
  const result = validateExpiryDate(test.date);
  const status = result === test.expected ? 'PASS' : 'FAIL';
  console.log(`${status}: ${test.name} (${test.date}) - Expected: ${test.expected}, Got: ${result}`);
});

// Test CVV validation
function validateCVV(cvv) {
  const cleanCVV = cvv.replace(/[^0-9]/g, '');
  return cleanCVV.length >= 3 && cleanCVV.length <= 4;
}

const cvvTests = [
  { cvv: '123', expected: true, name: 'Valid 3-digit CVV' },
  { cvv: '1234', expected: true, name: 'Valid 4-digit CVV' },
  { cvv: '12', expected: false, name: 'Too short CVV' },
  { cvv: '12345', expected: false, name: 'Too long CVV' },
  { cvv: '', expected: false, name: 'Empty CVV' },
  { cvv: 'abc', expected: false, name: 'Non-numeric CVV' }
];

console.log('\nCVV Validation Tests:');
console.log('====================');

cvvTests.forEach(test => {
  const result = validateCVV(test.cvv);
  const status = result === test.expected ? 'PASS' : 'FAIL';
  console.log(`${status}: ${test.name} (${test.cvv}) - Expected: ${test.expected}, Got: ${result}`);
});

console.log('\nAll tests completed!');