/**
 * Computes the donor level based on the lifetime donation amount.
 */
export const getDonorLevel = (lifetime: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (lifetime >= 10000) return "Platinum";
  if (lifetime >= 5000) return "Gold";
  if (lifetime >= 1000) return "Silver";
  return "Bronze";
};
