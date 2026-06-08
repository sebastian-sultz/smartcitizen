/**
 * Reusable regular expression patterns for frontend input validation schemas.
 */

// Matches standard 10-digit phone numbers
export const PHONE_REGEX = /^[0-9]{10}$/;

// Matches standard Indian 10-digit mobile numbers (starting with 6, 7, 8, or 9)
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

// Matches standard 6-digit Indian Pincodes (cannot start with 0)
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

// Matches standard Indian Permanent Account Number (PAN)
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

// Matches standard email address format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Matches names (alphabets, spaces, dots, hyphens, and apostrophes)
export const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;

// Matches cities / districts (alphabets, spaces, dots, hyphens, and apostrophes)
export const CITY_REGEX = /^[a-zA-Z\s.'-]+$/;

// Matches addresses (alphanumeric, spaces, and common address punctuation/symbols)
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s.,#/\(\)\'&:;\-\+]+$/;
