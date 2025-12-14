/**
 * Form validation types
 */

/** A single validation rule */
export interface ValidationRule {
  /** Function that validates a value */
  validate: (value: any) => boolean;
  /** Error message to display if validation fails */
  message: string;
}

/** Result of validation */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Array of error messages */
  errors: string[];
}

/** Form field errors */
export interface FormErrors {
  /** Field name mapped to error message */
  [key: string]: string;
}
