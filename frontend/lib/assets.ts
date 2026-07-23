/**
 * Cloudinary Image Optimization Service
 * Uses f_auto (auto WebP/AVIF format) and q_auto:best (highest fidelity visual crispness)
 * to ensure images stay crystal-clear on Retina & HD displays on fast networks.
 */
export const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/duwqehc0k/image/upload/f_auto,q_auto:best";

export const ASSETS = {
  a1: `${CLOUDINARY_BASE_URL}/v1769195528/smartcitizen/assets/a1.png`,
  a2: `${CLOUDINARY_BASE_URL}/v1769195534/smartcitizen/assets/a2.png`,
  a3: `${CLOUDINARY_BASE_URL}/v1769195531/smartcitizen/assets/a3.png`,
  a4: `${CLOUDINARY_BASE_URL}/v1769195536/smartcitizen/assets/a4.png`,
  a9: `${CLOUDINARY_BASE_URL}/v1769195543/smartcitizen/assets/a9.png`,
  a10: `${CLOUDINARY_BASE_URL}/v1769195541/smartcitizen/assets/a10.png`,
  a11: `${CLOUDINARY_BASE_URL}/v1769195546/smartcitizen/assets/a11.png`,
  a17: `${CLOUDINARY_BASE_URL}/v1769195523/smartcitizen/assets/a17.jpeg`,
  a18: `${CLOUDINARY_BASE_URL}/v1769195519/smartcitizen/assets/a18.jpeg`,
  a23: `${CLOUDINARY_BASE_URL}/v1769195520/smartcitizen/assets/a23.jpeg`,
  a26: `${CLOUDINARY_BASE_URL}/v1769195525/smartcitizen/assets/a26.jpeg`,
  s1: `${CLOUDINARY_BASE_URL}/v1769195518/smartcitizen/assets/s1.jpeg`,
  vision34: `${CLOUDINARY_BASE_URL}/v1769195521/smartcitizen/assets/vision34.jpeg`,
  aboutUs: `${CLOUDINARY_BASE_URL}/v1769195517/smartcitizen/assets/about_us.jpg`,
  logo: `${CLOUDINARY_BASE_URL}/v1769195538/smartcitizen/assets/logo.png`,
} as const;

export type AssetKey = keyof typeof ASSETS;
