/**
 * Custom form validation utilities
 */

/**
 * Collection of common validation functions
 */
export const validators = {
  /**
   * Validates that a value is not empty
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Validates email format
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Validates minimum length
   */
  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min;
  },

  /**
   * Validates that two fields match
   */
  matchesField: (compareValue: string) => (value: string): boolean => {
    return value === compareValue;
  },

  /**
   * Validates password strength
   * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  passwordStrength: (value: string): boolean => {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value)
    );
  },
};

/**
 * Validates a field against multiple rules
 * @param value - The value to validate
 * @param rules - Array of validation rules with error messages
 * @returns Error message if validation fails, empty string if passes
 */
export const validateField = (
  value: string,
  rules: Array<{ validate: (v: string) => boolean; message: string }>
): string => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return '';
};
