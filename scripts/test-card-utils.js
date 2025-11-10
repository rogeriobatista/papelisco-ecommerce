#!/usr/bin/env node

// Test credit card formatting utilities with basic implementations

function basicFormattingTest() {
  console.log('🧪 Testing Credit Card Formatting...\n');
  
  // Card number formatting test
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 16);
    return limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  
  // Expiry date formatting test
  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 4);
    if (limitedValue.length >= 2) {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
    }
    return limitedValue;
  };
  
  // CVV formatting test
  const formatCVV = (value) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };
  
  // Card type detection
  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    }
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
      return 'mastercard';
    }
    if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    }
    if (/^6(?:011|5)/.test(cleanNumber)) {
      return 'discover';
    }
    return 'unknown';
  };
  
  // Validation (basic Luhn algorithm)
  const validateCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
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
  };
  
  console.log('1. Card Number Formatting:');
  const cardTests = [
    '4111111111111111',
    '4111-1111-1111-1111',
    '4111abc1111def1111',
    '5555 5555 5555 4444',
    '378282246310005'
  ];
  
  cardTests.forEach(card => {
    const formatted = formatCardNumber(card);
    const type = detectCardType(card);
    const isValid = validateCardNumber(card);
    console.log(`   "${card}" → "${formatted}" (${type}) ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });
  
  console.log('\n2. Expiry Date Formatting:');
  const expiryTests = ['1225', '01/25', '1', '122025', 'ab12cd25', '0125'];
  
  expiryTests.forEach(expiry => {
    const formatted = formatExpiryDate(expiry);
    console.log(`   "${expiry}" → "${formatted}"`);
  });
  
  console.log('\n3. CVV Formatting:');
  const cvvTests = ['123', '1234', '12a3', 'abc', '12345', '12'];
  
  cvvTests.forEach(cvv => {
    const formatted = formatCVV(cvv);
    const isValid = formatted.length >= 3 && formatted.length <= 4;
    console.log(`   "${cvv}" → "${formatted}" ${isValid ? '✅' : '❌'}`);
  });
  
  console.log('\n4. Real-world Test Cases:');
  console.log('   Testing actual credit card scenarios...');
  
  // Test common real-world inputs
  const scenarios = [
    { input: '4111111111111111', desc: 'Visa test card' },
    { input: '5555555555554444', desc: 'Mastercard test card' },
    { input: '378282246310005', desc: 'Amex test card' },
    { input: '4111 1111 1111 1111', desc: 'Pre-formatted Visa' },
    { input: '4111-1111-1111-1111', desc: 'Dash-formatted card' }
  ];
  
  scenarios.forEach(scenario => {
    const formatted = formatCardNumber(scenario.input);
    const type = detectCardType(scenario.input);
    const isValid = validateCardNumber(scenario.input);
    console.log(`   ${scenario.desc}: "${formatted}" (${type}) ${isValid ? '✅' : '❌'}`);
  });
  
  console.log('\n✅ All credit card formatting tests completed!');
  console.log('🎯 These utilities will provide:');
  console.log('   • Real-time card number formatting (spaces every 4 digits)');
  console.log('   • Expiry date formatting (MM/YY)');
  console.log('   • CVV validation and limiting');
  console.log('   • Card type detection (Visa, Mastercard, Amex, Discover)');
  console.log('   • Luhn algorithm validation for card numbers');
}

basicFormattingTest();