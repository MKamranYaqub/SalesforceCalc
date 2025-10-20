/**
 * Configuration for Bridge & Fusion products.
 * Defines property sub‑products, LTV bands, variable and fixed rates,
 * loan limits and Fusion bands. See data.js of your standalone calculator for values.
 */
export const BRIDGE_SUB_PRODUCTS_RESI = [
  'Resi BTL Single Unit',
  'Resi Large Loan',
  'Resi Portfolio',
  'Dev Exit',
  'Permitted/Light Dev',
];
export const BRIDGE_SUB_PRODUCTS_COMM = [
  'Semi & Full Commercial',
  'Semi & Full Commercial Large Loan',
  'Dev Exit',
  'Permitted/Light Dev',
];

export const LTV_BUCKETS = [60, 70, 75];

// Variable margin per month (converted to annual in calculations)
export const VARIABLE_RATES = {
  60: {
    'Resi BTL Single Unit': 0.0045,
    'Resi Large Loan': 0.0055,
    'Resi Portfolio': 0.005,
    'Dev Exit': 0.005,
    'Permitted/Light Dev': 0.005,
    'Semi & Full Commercial': 0.005,
    'Semi & Full Commercial Large Loan': 0.0055,
    '2nd charge': 0.005,
  },
  70: {
    'Resi BTL Single Unit': 0.0055,
    'Resi Large Loan': 0.0065,
    'Resi Portfolio': 0.006,
    'Dev Exit': 0.006,
    'Permitted/Light Dev': 0.006,
    'Semi & Full Commercial': 0.006,
    'Semi & Full Commercial Large Loan': 0.0065,
    '2nd charge': 0.006,
  },
  75: {
    'Resi BTL Single Unit': 0.0065,
    'Resi Large Loan': 0.0075,
    'Resi Portfolio': 0.007,
    'Dev Exit': 0.007,
    'Permitted/Light Dev': 0.007,
    'Semi & Full Commercial': 0.007,
    'Semi & Full Commercial Large Loan': 0.0075,
    '2nd charge': 'OVERRIDE',
  },
};

// Fixed coupon (annual) rates by sub‑product & LTV
export const FIXED_RATES = {
  60: {
    'Resi BTL Single Unit': 0.0080,
    'Resi Large Loan': 0.0095,
    'Resi Portfolio': 0.0089,
    'Dev Exit': 0.0089,
    'Permitted/Light Dev': 0.0089,
    'Semi & Full Commercial': 0.0089,
    'Semi & Full Commercial Large Loan': 0.0095,
    '2nd charge': 0.0099,
  },
  70: {
    'Resi BTL Single Unit': 0.0095,
    'Resi Large Loan': 0.0105,
    'Resi Portfolio': 0.0099,
    'Dev Exit': 0.0099,
    'Permitted/Light Dev': 0.0099,
    'Semi & Full Commercial': 0.0099,
    'Semi & Full Commercial Large Loan': 0.0105,
    '2nd charge': 0.0109,
  },
  75: {
    'Resi BTL Single Unit': 0.0105,
    'Resi Large Loan': 0.0115,
    'Resi Portfolio': 0.0105,
    'Dev Exit': 0.0105,
    'Permitted/Light Dev': 0.0105,
    'Semi & Full Commercial': 0.0105,
    'Semi & Full Commercial Large Loan': 0.0115,
    '2nd charge': 'OVERRIDE',
  },
};

// Loan limits by sub‑product
export const BRIDGE_LIMITS = {
  'Resi BTL Single Unit': { min: 100000, max: 3000000 },
  'Resi Large Loan': { min: 3000001, max: 20000000 },
  'Resi Portfolio': { min: 100000, max: 50000000 },
  'Dev Exit': { min: 100000, max: 30000000 },
  'Permitted/Light Dev': { min: 100000, max: 20000000 },
  'Semi & Full Commercial': { min: 100000, max: 2000000 },
  'Semi & Full Commercial Large Loan': { min: 2000001, max: 15000000 },
  '2nd charge': { min: 100000, max: 5000000 },
};

// Fusion bands by property type (margin is annual; gross loan selects band)
export const FUSION_BANDS = {
  Residential: [
    { name: 'Fusion S', min: 100000, max: 3000000, margin: 0.0479 },
    { name: 'Fusion M', min: 3000001, max: 10000000, margin: 0.0569 },
    { name: 'Fusion L', min: 10000001, max: 1000000000, margin: 0.0599 },
  ],
  Commercial: [
    { name: 'Fusion S', min: 100000, max: 3000000, margin: 0.0499 },
    { name: 'Fusion M', min: 3000001, max: 10000000, margin: 0.0579 },
    { name: 'Fusion L', min: 10000001, max: 1000000000, margin: 0.0629 },
  ],
  maxLTV: { Residential: 0.75, Commercial: 0.7 },
};

// Fusion limits used by your standalone code
export const FUSION_LIMITS = {
  deferredPctFusionMax: 0.02,
  rolledMonthsMinFusion: 6,
  rolledMonthsMaxFusion: 12,
};
