/**
 * Bridge & Fusion Rate Configurations
 * Based on the provided rate sheets
 */

// FUSION RATES
export const FUSION_RATES = {
  Residential: {
    S: {
      60: 0.0084, // 0.84% monthly
      70: 0.0094,
      75: 0.0099
    },
    M: {
      60: 0.0079,
      70: 0.0089,
      75: 0.0094
    },
    L: {
      60: 0.0074,
      70: 0.0084,
      75: 0.0089
    }
  },
  Commercial: {
    S: {
      60: 0.0099,
      70: 0.0109,
      75: 0.0114
    },
    M: {
      60: 0.0094,
      70: 0.0104,
      75: 0.0109
    },
    L: {
      60: 0.0089,
      70: 0.0099,
      75: 0.0104
    }
  }
};

// VARIABLE BRIDGE RATES (Monthly Rates)
export const VARIABLE_BRIDGE_RATES = {
  'Resi BTL single unit': {
    60: 0.0074,
    70: 0.0084,
    75: 0.0089
  },
  'Resi Large Loan': {
    60: 0.0069,
    70: 0.0079,
    75: 0.0084
  },
  'Resi Portfolio': {
    60: 0.0069,
    70: 0.0079,
    75: 0.0084
  },
  'Dev Exit': {
    60: 0.0074,
    70: 0.0084,
    75: 0.0089
  },
  'Permitted/Light Dev': {
    60: 0.0089,
    70: 0.0099,
    75: 0.0104
  },
  'Semi & Full Commercial': {
    60: 0.0089,
    70: 0.0099,
    75: 0.0104
  },
  'Semi & Full Commercial Large Loan': {
    60: 0.0084,
    70: 0.0094,
    75: 0.0099
  },
  '2nd charge': {
    60: 0.0125,
    70: 0.0135,
    75: 0.0140
  }
};

// FIXED BRIDGE RATES (Annual Rates)
export const FIXED_BRIDGE_RATES = {
  'Resi BTL single unit': {
    60: 0.0889,
    70: 0.1008,
    75: 0.1068
  },
  'Resi Large Loan': {
    60: 0.0828,
    70: 0.0948,
    75: 0.1008
  },
  'Resi Portfolio': {
    60: 0.0828,
    70: 0.0948,
    75: 0.1008
  },
  'Dev Exit': {
    60: 0.0889,
    70: 0.1008,
    75: 0.1068
  },
  'Permitted/Light Dev': {
    60: 0.1068,
    70: 0.1188,
    75: 0.1248
  },
  'Semi & Full Commercial': {
    60: 0.1068,
    70: 0.1188,
    75: 0.1248
  },
  'Semi & Full Commercial Large Loan': {
    60: 0.1008,
    70: 0.1128,
    75: 0.1188
  },
  '2nd charge': {
    60: 0.1500,
    70: 0.1620,
    75: 0.1680
  }
};

/**
 * Get Fusion rate based on tier, property type, and LTV
 */
export const getFusionRate = (tier, propertyType, ltv) => {
  const propertyRates = FUSION_RATES[propertyType];
  if (!propertyRates) return null;
  
  const tierRates = propertyRates[tier];
  if (!tierRates) return null;
  
  return tierRates[ltv] || null;
};

/**
 * Get Variable Bridge rate
 */
export const getVariableBridgeRate = (propertyType, ltv) => {
  const rates = VARIABLE_BRIDGE_RATES[propertyType];
  return rates ? rates[ltv] || null : null;
};

/**
 * Get Fixed Bridge rate
 */
export const getFixedBridgeRate = (propertyType, ltv) => {
  const rates = FIXED_BRIDGE_RATES[propertyType];
  return rates ? rates[ltv] || null : null;
};