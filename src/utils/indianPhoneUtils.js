/**
 * Indian Phone Number Validation & Management
 * Validates real-time Indian contact numbers and stores authorized contacts
 */

// Valid Indian mobile number prefixes (first digit of 10-digit number)
const VALID_INDIAN_PREFIXES = ['6', '7', '8', '9'];

// Indian telecom operators
const INDIAN_OPERATORS = {
  '9': { name: 'Jio/Airtel/VI', color: '#FF6B35' },
  '8': { name: 'Vodafone/Airtel', color: '#004E89' },
  '7': { name: 'Jio/BSNL', color: '#F77F00' },
  '6': { name: 'BSNL/MTNL', color: '#06A77D' },
};

/**
 * Validates if a number is a valid Indian phone number
 * @param {string} phone - Phone number (10 digits, with or without +91)
 * @returns {object} { isValid: boolean, message: string, operator: string }
 */
export const validateIndianPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Remove +91 if present
  const tenDigit = cleanPhone.endsWith('91') ? cleanPhone.slice(0, -2) : cleanPhone;
  
  if (tenDigit.length !== 10) {
    return { 
      isValid: false, 
      message: 'Phone number must be 10 digits',
      operator: null 
    };
  }

  const firstDigit = tenDigit[0];
  
  if (!VALID_INDIAN_PREFIXES.includes(firstDigit)) {
    return { 
      isValid: false, 
      message: 'Invalid Indian phone number prefix',
      operator: null 
    };
  }

  const operatorInfo = INDIAN_OPERATORS[firstDigit];
  return {
    isValid: true,
    message: 'Valid Indian phone number',
    operator: operatorInfo.name,
    operatorColor: operatorInfo.color
  };
};

/**
 * Formats Indian phone number to standard format: +91 XXXXX XXXXX
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatIndianPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const tenDigit = cleanPhone.endsWith('91') ? cleanPhone.slice(0, -2) : cleanPhone;
  
  if (tenDigit.length !== 10) return phone;
  
  return `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}`;
};

/**
 * Get operator details for a phone number
 * @param {string} phone - Phone number
 * @returns {object} Operator information
 */
export const getOperatorInfo = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const tenDigit = cleanPhone.endsWith('91') ? cleanPhone.slice(0, -2) : cleanPhone;
  const firstDigit = tenDigit[0];
  
  return INDIAN_OPERATORS[firstDigit] || { name: 'Unknown', color: '#666' };
};

/**
 * Authorized demo Indian contact numbers for testing
 * Format: +91 XXXXX XXXXX
 */
export const AUTHORIZED_DEMO_CONTACTS = [
  {
    id: 1,
    name: 'Ramu Kaka',
    phone: '9876543210',
    role: 'seller',
    shop: 'Fresh Farm Produce',
    verified: true,
    operator: 'Jio'
  },
  {
    id: 2,
    name: 'Shanti Devi',
    phone: '9123456789',
    role: 'seller',
    shop: 'Handmade Crafts',
    verified: true,
    operator: 'Airtel'
  },
  {
    id: 3,
    name: 'Bhaiya Ji',
    phone: '8765432109',
    role: 'seller',
    shop: 'Local Honey & Products',
    verified: true,
    operator: 'Vodafone'
  },
  {
    id: 4,
    name: 'Priya Sharma',
    phone: '7654321098',
    role: 'buyer',
    shop: null,
    verified: true,
    operator: 'Jio'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    phone: '9988776655',
    role: 'buyer',
    shop: null,
    verified: true,
    operator: 'Airtel'
  },
  {
    id: 6,
    name: 'Asha Verma',
    phone: '8899776655',
    role: 'seller',
    shop: 'Organic Vegetables',
    verified: true,
    operator: 'VI'
  },
  {
    id: 7,
    name: 'Rohit Patel',
    phone: '7766554433',
    role: 'buyer',
    shop: null,
    verified: true,
    operator: 'BSNL'
  },
  {
    id: 8,
    name: 'Meera Dutta',
    phone: '6677889900',
    role: 'seller',
    shop: 'Spices & Seasonings',
    verified: true,
    operator: 'BSNL'
  }
];

/**
 * Search authorized contact by phone number
 * @param {string} phone - Phone number
 * @returns {object|null} Contact object or null
 */
export const searchAuthorizedContact = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const tenDigit = cleanPhone.endsWith('91') ? cleanPhone.slice(0, -2) : cleanPhone;
  
  return AUTHORIZED_DEMO_CONTACTS.find(contact => 
    contact.phone === tenDigit
  ) || null;
};

/**
 * Get all authorized contacts
 * @param {string} role - Filter by role ('seller', 'buyer', or null for all)
 * @returns {array} Array of contacts
 */
export const getAllAuthorizedContacts = (role = null) => {
  if (!role) return AUTHORIZED_DEMO_CONTACTS;
  return AUTHORIZED_DEMO_CONTACTS.filter(contact => contact.role === role);
};

/**
 * Verify phone number against authorized contacts
 * @param {string} phone - Phone number
 * @returns {object} { isAuthorized: boolean, contact: object|null }
 */
export const verifyPhoneNumber = (phone) => {
  const contact = searchAuthorizedContact(phone);
  
  if (contact) {
    return {
      isAuthorized: true,
      contact,
      message: `Welcome back, ${contact.name}!`
    };
  }
  
  return {
    isAuthorized: false,
    contact: null,
    message: 'New user - Creating account'
  };
};
