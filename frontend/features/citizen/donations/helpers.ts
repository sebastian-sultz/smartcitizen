import { DonationRecord } from "../types";

/**
 * Maps a donation status to the appropriate Badge variant.
 */
export const getStatusColor = (status: DonationRecord["status"]): "success" | "warning" | "danger" => {
  switch (status) {
    case "success":
      return "success";
    case "pending":
      return "warning";
    default:
      return "danger";
  }
};

/**
 * Strips non-digits and formats digits into groups of 4 separated by spaces.
 * Max length: 19 characters (16 digits + 3 spaces).
 */
export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const limitedDigits = digits.substring(0, 16);
  const groups = limitedDigits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : limitedDigits;
};

/**
 * Strips non-digits and formats digits into MM/YY format.
 * Max length: 5 characters (4 digits + 1 slash).
 */
export const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const limitedDigits = digits.substring(0, 4);
  if (limitedDigits.length > 2) {
    return `${limitedDigits.substring(0, 2)}/${limitedDigits.substring(2)}`;
  }
  return limitedDigits;
};
