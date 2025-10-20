/**
 * Bridge & Fusion Rate Structures
 * All rates and configurations for Bridge and Fusion loan products
 */

// Fusion Rates (Annual rates + BBR tracker)
export const FUSION_RATES = {
  Residential: {
    60: {
      S: { rate: 5.29, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.19, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.09, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    },
    70: {
      S: { rate: 5.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.39, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.29, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    },
    75: {
      S: { rate: 5.69, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.59, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.49, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    }
  },
  Commercial: {
    60: {
      S: { rate: 5.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.39, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.29, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    },
    70: {
      S: { rate: 5.69, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.59, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.49, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    },
    75: {
      S: { rate: 5.89, arrangementFee: 2.0, minLoan: 100000, maxLoan: 500000 },
      M: { rate: 5.79, arrangementFee: 2.0, minLoan: 500001, maxLoan: 2000000 },
      L: { rate: 5.69, arrangementFee: 2.0, minLoan: 2000001, maxLoan: 20000000 }
    }
  }
};

// Variable Bridge Rates (Monthly rates + BBR)
export const VARIABLE_BRIDGE_RATES = {
  'Resi BTL single unit': {
    60: { rate: 0.40, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 },
    70: { rate: 0.50, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 },
    75: { rate: 0.60, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 }
  },
  'Resi Large Loan': {
    60: { rate: 0.50, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 },
    70: { rate: 0.60, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 },
    75: { rate: 0.70, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 }
  },
  'Resi Portfolio': {
    60: { rate: 0.45, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 },
    70: { rate: 0.55, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 },
    75: { rate: 0.65, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 }
  },
  'HMO': {
    60: { rate: 0.50, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    70: { rate: 0.60, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    75: { rate: 0.70, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 }
  },
  'MUFB': {
    60: { rate: 0.55, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    70: { rate: 0.65, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    75: { rate: 0.75, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 }
  },
  'Semi-Commercial': {
    60: { rate: 0.55, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    70: { rate: 0.65, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    75: { rate: 0.75, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 }
  },
  'Commercial': {
    60: { rate: 0.60, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 },
    70: { rate: 0.70, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 },
    75: { rate: 0.80, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 }
  },
  'Land': {
    60: { rate: 0.70, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    70: { rate: 0.80, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    75: { rate: 0.90, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 }
  }
};

// Fixed Bridge Rates (Annual fixed rates)
export const FIXED_BRIDGE_RATES = {
  'Resi BTL single unit': {
    60: { rate: 7.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 },
    70: { rate: 8.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 },
    75: { rate: 8.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 4000000 }
  },
  'Resi Large Loan': {
    60: { rate: 8.49, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 },
    70: { rate: 8.99, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 },
    75: { rate: 9.49, arrangementFee: 2.0, minLoan: 4000001, maxLoan: 20000000 }
  },
  'Resi Portfolio': {
    60: { rate: 8.29, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 },
    70: { rate: 8.79, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 },
    75: { rate: 9.29, arrangementFee: 2.0, minLoan: 100000, maxLoan: 50000000 }
  },
  'HMO': {
    60: { rate: 8.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    70: { rate: 8.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    75: { rate: 9.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 }
  },
  'MUFB': {
    60: { rate: 8.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    70: { rate: 9.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 },
    75: { rate: 9.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 5000000 }
  },
  'Semi-Commercial': {
    60: { rate: 8.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    70: { rate: 9.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    75: { rate: 9.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 }
  },
  'Commercial': {
    60: { rate: 9.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 },
    70: { rate: 9.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 },
    75: { rate: 10.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 20000000 }
  },
  'Land': {
    60: { rate: 9.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    70: { rate: 10.49, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 },
    75: { rate: 10.99, arrangementFee: 2.0, minLoan: 100000, maxLoan: 10000000 }
  }
};

// Property type options for each product
export const PROPERTY_TYPES = {
  FUSION: ['Residential', 'Commercial'],
  BRIDGE: [
    'Resi BTL single unit',
    'Resi Large Loan',
    'Resi Portfolio',
    'HMO',
    'MUFB',
    'Semi-Commercial',
    'Commercial',
    'Land'
  ]
};

// LTV options
export const LTV_OPTIONS = [60, 70, 75];

// BBR (Bank Base Rate) - This should be updated regularly
export const BBR = 4.00; // Current BBR %