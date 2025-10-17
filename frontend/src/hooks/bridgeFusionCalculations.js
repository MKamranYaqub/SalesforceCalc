/**
 * Bridge & Fusion Calculation Engine
 */

import {
  BRIDGE_FUSION_PRODUCTS,
  ARRANGEMENT_FEE_PERCENTAGE,
  determineFusionTier,
  getLoanLimits,
  FUSION_TIER_LIMITS,
} from './bridgeFusionConstants';

import {
  getFusionRate,
  getVariableBridgeRate,
  getFixedBridgeRate,
} from './bridgeFusionRates';

/**
 * Calculate Fusion loan details
 * @param {Object} params - Calculation parameters
 * @param {number} params.propertyValue - Property value
 * @param {number} params.ltv - LTV percentage (60, 70, or 75)
 * @param {string} params.propertyType - Property type
 * @param {number} [params.specificGrossLoan] - Optional specific gross loan amount
 * @param {number} [params.rateOverride] - Optional manual rate override
 * @returns {Object} Calculation results
 */
export const calculateFusionLoan = (params) => {
  const {
    propertyValue,
    ltv,
    propertyType,
    specificGrossLoan = null,
    rateOverride = null,
  } = params;

  // Step 1: Calculate gross loan
  let grossLoan;
  if (specificGrossLoan !== null && specificGrossLoan > 0) {
    grossLoan = specificGrossLoan;
  } else {
    grossLoan = propertyValue * (ltv / 100);
  }

  // Step 2: Determine tier based on gross loan amount
  const tier = determineFusionTier(grossLoan);
  const tierLimits = FUSION_TIER_LIMITS[tier];

  // Step 3: Cap gross loan to tier limits
  grossLoan = Math.min(grossLoan, tierLimits.max);
  grossLoan = Math.max(grossLoan, tierLimits.min);

  // Step 4: Get rate (use override if provided)
  let rate;
  if (rateOverride !== null) {
    rate = rateOverride;
  } else {
    rate = getFusionRate(tier, propertyType, ltv);
  }

  if (rate === null) {
    return {
      error: 'Rate not available for selected criteria',
      grossLoan: 0,
      netLoan: 0,
    };
  }

  // Step 5: Calculate arrangement fee
  const arrangementFee = grossLoan * (ARRANGEMENT_FEE_PERCENTAGE / 100);

  // Step 6: Calculate net loan (amount advanced)
  const netLoan = grossLoan - arrangementFee;

  // Step 7: Calculate interest payments
  const annualInterest = grossLoan * rate;
  const monthlyInterest = annualInterest / 12;

  // Step 8: Calculate actual LTV achieved
  const actualLTV = (grossLoan / propertyValue) * 100;

  return {
    productType: BRIDGE_FUSION_PRODUCTS.FUSION,
    tier: `Fusion ${tier}`,
    tierKey: tier,
    propertyType,
    propertyValue,
    requestedLTV: ltv,
    actualLTV: actualLTV,
    grossLoan,
    netLoan,
    arrangementFee,
    arrangementFeePercentage: ARRANGEMENT_FEE_PERCENTAGE,
    rate,
    rateDisplay: `${(rate * 100).toFixed(2)}%`,
    isRateOverridden: rateOverride !== null,
    annualInterest,
    monthlyInterest,
    tierLimits,
    error: null,
  };
};

/**
 * Calculate Bridge loan details (Fixed or Variable)
 * @param {Object} params - Calculation parameters
 * @param {string} params.bridgeType - 'Fixed Bridge' or 'Variable Bridge'
 * @param {number} params.propertyValue - Property value
 * @param {number} params.ltv - LTV percentage
 * @param {string} params.propertyType - Bridge property type
 * @param {number} [params.specificGrossLoan] - Optional specific gross loan amount
 * @param {number} [params.rateOverride] - Optional manual rate override
 * @returns {Object} Calculation results
 */
export const calculateBridgeLoan = (params) => {
  const {
    bridgeType,
    propertyValue,
    ltv,
    propertyType,
    specificGrossLoan = null,
    rateOverride = null,
  } = params;

  // Step 1: Calculate gross loan
  let grossLoan;
  if (specificGrossLoan !== null && specificGrossLoan > 0) {
    grossLoan = specificGrossLoan;
  } else {
    grossLoan = propertyValue * (ltv / 100);
  }

  // Step 2: Apply loan limits for property type
  const limits = getLoanLimits(bridgeType, propertyType);
  grossLoan = Math.min(grossLoan, limits.max);
  grossLoan = Math.max(grossLoan, limits.min);

  // Step 3: Get rate (use override if provided)
  let rate;
  if (rateOverride !== null) {
    rate = rateOverride;
  } else {
    if (bridgeType === BRIDGE_FUSION_PRODUCTS.FIXED_BRIDGE) {
      rate = getFixedBridgeRate(propertyType, ltv);
    } else {
      rate = getVariableBridgeRate(propertyType, ltv);
    }
  }

  if (rate === null) {
    return {
      error: 'Rate not available for selected criteria',
      grossLoan: 0,
      netLoan: 0,
    };
  }

  // Step 4: Calculate arrangement fee
  const arrangementFee = grossLoan * (ARRANGEMENT_FEE_PERCENTAGE / 100);

  // Step 5: Calculate net loan
  const netLoan = grossLoan - arrangementFee;

  // Step 6: Calculate payments
  let monthlyPayment, annualPayment;
  
  if (bridgeType === BRIDGE_FUSION_PRODUCTS.VARIABLE_BRIDGE) {
    // Variable bridge: rate is monthly
    monthlyPayment = grossLoan * rate;
    annualPayment = monthlyPayment * 12;
  } else {
    // Fixed bridge: rate is annual
    annualPayment = grossLoan * rate;
    monthlyPayment = annualPayment / 12;
  }

  // Step 7: Calculate actual LTV
  const actualLTV = (grossLoan / propertyValue) * 100;

  // Step 8: Format rate display
  let rateDisplay;
  if (bridgeType === BRIDGE_FUSION_PRODUCTS.VARIABLE_BRIDGE) {
    rateDisplay = `${(rate * 100).toFixed(2)}% monthly`;
  } else {
    rateDisplay = `${(rate * 100).toFixed(2)}% annual`;
  }

  return {
    productType: bridgeType,
    propertyType,
    propertyValue,
    requestedLTV: ltv,
    actualLTV,
    grossLoan,
    netLoan,
    arrangementFee,
    arrangementFeePercentage: ARRANGEMENT_FEE_PERCENTAGE,
    rate,
    rateDisplay,
    isRateOverridden: rateOverride !== null,
    monthlyPayment,
    annualPayment,
    loanLimits: limits,
    error: null,
  };
};

/**
 * Calculate Bridge loan for all available LTV options
 * Used for matrix display
 * @param {Object} params - Calculation parameters
 * @param {string} params.bridgeType - 'Fixed Bridge' or 'Variable Bridge'
 * @param {number} params.propertyValue - Property value
 * @param {string} params.propertyType - Bridge property type
 * @param {Array<number>} [params.ltvOptions] - Array of LTV percentages to calculate
 * @returns {Array<Object>} Array of calculation results
 */
export const calculateAllBridgeLTVOptions = (params) => {
  const {
    bridgeType,
    propertyValue,
    propertyType,
    ltvOptions = [60, 70, 75],
  } = params;

  return ltvOptions.map(ltv => {
    const result = calculateBridgeLoan({
      bridgeType,
      propertyValue,
      ltv,
      propertyType,
    });
    
    return {
      ltv,
      ...result,
    };
  }).filter(result => result.error === null); // Filter out unavailable options
};

/**
 * Calculate comparison between different products
 * @param {Object} params - Calculation parameters
 * @param {number} params.propertyValue - Property value
 * @param {number} params.ltv - LTV percentage
 * @returns {Object} Comparison of all products
 */
export const calculateProductComparison = (params) => {
  const { propertyValue, ltv } = params;

  // This would calculate all three products and return comparison data
  // Implementation depends on what property types are available
  // For now, return structure for future use
  
  return {
    fusion: null, // Would calculate Fusion
    fixedBridge: null, // Would calculate Fixed Bridge
    variableBridge: null, // Would calculate Variable Bridge
  };
};

/**
 * Validate calculation inputs
 * @param {Object} params - Parameters to validate
 * @returns {Object} Validation result
 */
export const validateCalculationInputs = (params) => {
  const errors = [];

  // Validate property value
  if (!params.propertyValue || params.propertyValue <= 0) {
    errors.push('Property value must be greater than zero');
  }

  // Validate LTV
  if (!params.ltv || ![60, 70, 75].includes(params.ltv)) {
    errors.push('LTV must be 60%, 70%, or 75%');
  }

  // Validate property type
  if (!params.propertyType) {
    errors.push('Property type is required');
  }

  // Validate specific gross loan if provided
  if (params.specificGrossLoan !== null && params.specificGrossLoan !== undefined) {
    if (params.specificGrossLoan <= 0) {
      errors.push('Specific gross loan must be greater than zero');
    }
    
    if (params.specificGrossLoan > params.propertyValue) {
      errors.push('Gross loan cannot exceed property value');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Helper: Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Helper: Format percentage
 * @param {number} value - Value to format (as decimal)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};