import * as Yup from "yup";
import { 
  PHONE_REGEX, 
  EMAIL_REGEX, 
  NAME_REGEX, 
  PINCODE_REGEX, 
  PAN_REGEX, 
  ADDRESS_REGEX,
  CITY_REGEX 
} from "./regex";

// Helper to trim leading/trailing whitespace before validation
export const trimmedString = () => 
  Yup.string().transform((value) => (typeof value === "string" ? value.trim() : value));

// Reusable Name schema: rejects invalid chars, rejects consecutive spaces, enforces 3+ chars when required
export const nameSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-name",
      "Enter a valid name (letters, spaces, dots, hyphens only)",
      (val) => !val || NAME_REGEX.test(val)
    )
    .test(
      "no-consecutive-spaces",
      "Name cannot contain consecutive spaces",
      (val) => !val || !/\s{2,}/.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage).min(3, "Name must be at least 3 characters");
  }
  return schema;
};

// Reusable Phone number schema: exactly 10 digits
export const phoneSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-phone",
      "Enter a valid 10-digit mobile number",
      (val) => !val || PHONE_REGEX.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};

// Reusable Email schema
export const emailSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-email",
      "Enter a valid email address",
      (val) => !val || EMAIL_REGEX.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};

// Reusable Pincode schema (6-digit Indian Pincode)
export const pincodeSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-pincode",
      "Enter a valid 6-digit Pincode",
      (val) => !val || PINCODE_REGEX.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};

// Reusable PAN schema (10-character PAN)
export const panSchema = (message = "Enter a valid 10-character PAN (e.g. ABCDE1234F)") => {
  return trimmedString()
    .transform((value) => (typeof value === "string" ? value.toUpperCase() : value))
    .test(
      "valid-pan",
      message,
      (val) => !val || PAN_REGEX.test(val)
    );
};

// Reusable Address schema
export const addressSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-address",
      "Enter a valid address (alphanumeric and standard punctuation only)",
      (val) => !val || ADDRESS_REGEX.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};

// Reusable City/District schema
export const citySchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test(
      "valid-city",
      "Enter a valid city/district (letters, spaces, dots, hyphens only)",
      (val) => !val || CITY_REGEX.test(val)
    );
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};

// Reusable Future Date schema (must be in the future)
export const futureDateSchema = (requiredMessage?: string) => {
  let schema = trimmedString()
    .test("is-valid-date", "Please enter a valid date", (value) => {
      if (!value) return true; // Let required() handle empty validation
      return !isNaN(Date.parse(value));
    })
    .test("is-future", "Date must be in the future", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date > new Date();
    });
  if (requiredMessage) {
    schema = schema.required(requiredMessage);
  }
  return schema;
};
