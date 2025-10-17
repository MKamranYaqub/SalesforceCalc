/**
 * Bridge & Fusion Calculator Constants
 */

// Main Product Types
export const BRIDGE_FUSION_PRODUCTS = {
  FUSION: 'Fusion',
  FIXED_BRIDGE: 'Fixed Bridge',
  VARIABLE_BRIDGE: 'Variable Bridge',
};

// Property Types for Bridge Products (8 types)
export const BRIDGE_PROPERTY_TYPES = {
  RESI_BTL_SINGLE: 'Resi BTL single unit',
  RESI_LARGE_LOAN: 'Resi Large Loan',
  RESI_PORTFOLIO: 'Resi Portfolio',
  DEV_EXIT: 'Dev Exit',
  PERMITTED_LIGHT_DEV: 'Permitted/Light Dev',
  SEMI_FULL_COMMERCIAL: 'Semi & Full Commercial',
  SEMI_FULL_COMMERCIAL_LARGE: 'Semi & Full Commercial Large Loan',
  SECOND_CHARGE: '2nd charge',
};

// Property Types for Fusion (2 types)
export const FUSION_PROPERTY_TYPES = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial/Semi-Commercial',
};

// LTV Bands (common across all products)
export const LTV_BANDS = {
  LTV_60: 60,
  LTV_70: 70,
  LTV_75: 75,
};

export const LTV_OPTIONS = [60, 70, 75];

// Fusion Product Tiers
export const FUSION_TIERS = {
  S: 'Fusion S',
  M: 'Fusion M',
  L: 'Fusion L',
};

// Fusion Tier Loan Limits
export const FUSION_TIER_LIMITS = {
  S: {
    min: 100000,      // £100k
    max: 3000000,     // £3m
  },
  M: {
    min: 3000001,     // £3m + 1
    max: 10000000,    // £10m
  },
  L: {
    min: 10000001,    // £10m + 1
    max: 1000000000,  // £1bn
  },
};

// Bridge Loan Limits by Property Type
export const BRIDGE_LOAN_LIMITS = {
  [BRIDGE_PROPERTY_TYPES.RESI_BTL_SINGLE]: {
    min: 100000,
    max: 4000000,
  },
  [BRIDGE_PROPERTY_TYPES.RESI_LARGE_LOAN]: {
    min: 4000001,
    max: 20000000,
  },
  [BRIDGE_PROPERTY_TYPES.RESI_PORTFOLIO]: {
    min: 100000,
    max: 50000000,
  },
  [BRIDGE_PROPERTY_TYPES.DEV_EXIT]: {
    min: 100000,
    max: 30000000,
  },
  [BRIDGE_PROPERTY_TYPES.PERMITTED_LIGHT_DEV]: {
    min: 100000,
    max: 20000000,
  },
  [BRIDGE_PROPERTY_TYPES.SEMI_FULL_COMMERCIAL]: {
    min: 100000,
    max: 3000000,
  },
  [BRIDGE_PROPERTY_TYPES.SEMI_FULL_COMMERCIAL_LARGE]: {
    min: 3000001,
    max: 15000000,
  },
  [BRIDGE_PROPERTY_TYPES.SECOND_CHARGE]: {
    min: 100000,
    max: 4000000,
  },
};

// Arrangement Fee (constant across all products)
export const ARRANGEMENT_FEE_PERCENTAGE = 2.0; // 2%

// Loan Type Options
export const LOAN_TYPE_OPTIONS = {
  MAX_LOAN: 'Maximum Loan at Selected LTV',
  SPECIFIC_GROSS: 'Specific Gross Loan Amount',
};

// Product Display Names (for UI)
export const PRODUCT_DISPLAY_NAMES = {
  [BRIDGE_FUSION_PRODUCTS.FUSION]: '💎 Fusion',
  [BRIDGE_FUSION_PRODUCTS.FIXED_BRIDGE]: '🔒 Fixed Bridge',
  [BRIDGE_FUSION_PRODUCTS.VARIABLE_BRIDGE]: '📊 Variable Bridge',
};

// Property Type Display Groups (for better UI organization)
export const BRIDGE_PROPERTY_TYPE_GROUPS = {
  'Residential': [
    BRIDGE_PROPERTY_TYPES.RESI_BTL_SINGLE,
    BRIDGE_PROPERTY_TYPES.RESI_LARGE_LOAN,
    BRIDGE_PROPERTY_TYPES.RESI_PORTFOLIO,
  ],
  'Development': [
    BRIDGE_PROPERTY_TYPES.DEV_EXIT,
    BRIDGE_PROPERTY_TYPES.PERMITTED_LIGHT_DEV,
  ],
  'Commercial': [
    BRIDGE_PROPERTY_TYPES.SEMI_FULL_COMMERCIAL,
    BRIDGE_PROPERTY_TYPES.SEMI_FULL_COMMERCIAL_LARGE,
  ],
  'Other': [
    BRIDGE_PROPERTY_TYPES.SECOND_CHARGE,
  ],
};

// Helper function to determine Fusion tier based on loan amount
export const determineFusionTier = (loanAmount) => {
  if (loanAmount <= FUSION_TIER_LIMITS.S.max) {
    return 'S';
  } else if (loanAmount <= FUSION_TIER_LIMITS.M.max) {
    return 'M';
  } else {
    return 'L';
  }
};

// Helper function to get loan limits for a property type
export const getLoanLimits = (productType, propertyType) => {
  if (productType === BRIDGE_FUSION_PRODUCTS.FUSION) {
    // For Fusion, return the overall range (S min to L max)
    return {
      min: FUSION_TIER_LIMITS.S.min,
      max: FUSION_TIER_LIMITS.L.max,
    };
  } else {
    return BRIDGE_LOAN_LIMITS[propertyType] || { min: 100000, max: 4000000 };
  }
};

// Helper function to validate loan amount
export const validateLoanAmount = (amount, productType, propertyType) => {
  const limits = getLoanLimits(productType, propertyType);
  
  if (amount < limits.min) {
    return {
      valid: false,
      error: `Minimum loan for this product is £${limits.min.toLocaleString('en-GB')}`,
    };
  }
  
  if (amount > limits.max) {
    return {
      valid: false,
      error: `Maximum loan for this product is £${limits.max.toLocaleString('en-GB')}`,
    };
  }
  
  return { valid: true, error: null };
};