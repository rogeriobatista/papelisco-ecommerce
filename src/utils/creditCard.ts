// Credit card formatting utilities

/**
 * Format credit card number with spaces
 * @param value - Raw card number input
 * @returns Formatted card number (1234 5678 9012 3456)
 */
export const formatCardNumber = (value: string): string => {
  // Remove all non-digits
  const cleanValue = value.replace(/\D/g, '');
  
  // Determine max length based on card type patterns
  let maxLength = 19; // Default max length
  
  // American Express cards start with 34 or 37 and are 15 digits
  if (/^3[47]/.test(cleanValue)) {
    maxLength = 15;
  } 
  // Most other cards (Visa, Mastercard, Discover) are 16 digits
  else if (/^[4-6]/.test(cleanValue)) {
    maxLength = 16;
  }
  
  // Limit based on detected card type
  const limitedValue = cleanValue.slice(0, maxLength);
  
  // Add spaces every 4 digits
  return limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Format expiry date as MM/YY
 * @param value - Raw expiry date input
 * @returns Formatted expiry date (MM/YY)
 */
export const formatExpiryDate = (value: string): string => {
  // Remove all non-digits
  const cleanValue = value.replace(/\D/g, '');
  
  // Limit to 4 digits
  const limitedValue = cleanValue.slice(0, 4);
  
  // Add slash after 2 digits
  if (limitedValue.length >= 2) {
    return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
  }
  
  return limitedValue;
};

/**
 * Format CVV (security code)
 * @param value - Raw CVV input
 * @returns Formatted CVV (3-4 digits only)
 */
export const formatCVV = (value: string): string => {
  // Remove all non-digits and limit to 4 digits
  return value.replace(/\D/g, '').slice(0, 4);
};

/**
 * Validate credit card number using Luhn algorithm
 * @param cardNumber - Card number to validate (with or without spaces)
 * @returns True if valid
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-digits
  const cleanNumber = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
  
  // Check if length is appropriate (13-19 digits, most common is 16)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  // Loop through digits from right to left
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

/**
 * Validate expiry date
 * @param expiryDate - Expiry date in MM/YY format
 * @returns True if valid and not expired
 */
export const validateExpiryDate = (expiryDate: string): boolean => {
  const cleanValue = expiryDate.replace(/\D/g, '');
  
  if (cleanValue.length !== 4) {
    return false;
  }
  
  const month = parseInt(cleanValue.slice(0, 2));
  const year = parseInt(`20${cleanValue.slice(2)}`);
  
  // Check valid month
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Check if not expired
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validate CVV
 * @param cvv - CVV code
 * @returns True if valid (3-4 digits)
 */
export const validateCVV = (cvv: string): boolean => {
  const cleanCVV = cvv.replace(/\D/g, '');
  return cleanCVV.length >= 3 && cleanCVV.length <= 4;
};

/**
 * Detect card type based on card number
 * @param cardNumber - Card number
 * @returns Card type (visa, mastercard, amex, discover, etc.)
 */
export const detectCardType = (cardNumber: string): string => {
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

/**
 * Get card type display name
 * @param cardType - Card type from detectCardType
 * @returns Human-readable card type name
 */
export const getCardTypeDisplayName = (cardType: string): string => {
  const cardTypes: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    unknown: 'Credit Card',
  };
  
  return cardTypes[cardType] || 'Credit Card';
};

/**
 * Mask card number for display (show only last 4 digits)
 * @param cardNumber - Full card number
 * @returns Masked card number (**** **** **** 1234)
 */
export const maskCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
  const lastFour = cleanNumber.slice(-4);
  const maskedPart = '**** **** ****';
  return `${maskedPart} ${lastFour}`;
};