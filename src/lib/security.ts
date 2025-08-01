// Enhanced Content Security Policy for better security
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'", 
    "'unsafe-inline'", // Required for inline scripts in HTML - minimize usage
    "https://connect.facebook.net",
    "https://www.googletagmanager.com",
    "'nonce-'" // Use nonces for inline scripts where possible
  ],
  'style-src': [
    "'self'", 
    "'unsafe-inline'", // Required for styled-components - consider moving to external CSS
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:", // Consider restricting to specific domains
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://nncpapnlnrtssbruzkla.supabase.co",
    "https://connect.facebook.net",
    "https://www.facebook.com"
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'upgrade-insecure-requests': [], // Force HTTPS
  'block-all-mixed-content': [] // Block mixed content
};

// Input validation and sanitization functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePostcode = (postcode: string): boolean => {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim().toUpperCase());
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, ''); // Remove angle brackets
};

export const validateFormSubmission = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (data.postcode && !validatePostcode(data.postcode)) {
    errors.push('Invalid postcode format');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier)!;
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limited
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true; // Allowed
  };
};

// Generate CSP string
export const generateCSPString = () => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

export default CSP_DIRECTIVES;