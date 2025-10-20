/**
 * Main React Hook for Bridge & Fusion Calculator
 * Manages state and calculations
 */
import { useState, useMemo, useCallback } from 'react';
import {
  BRIDGE_FUSION_PRODUCTS,
  BRIDGE_PROPERTY_TYPES,
  FUSION_PROPERTY_TYPES,
  LTV_OPTIONS,
  LOAN_TYPE_OPTIONS,
  determineFusionTier,
  getLoanLimits
} from '../config/bridgeFusionConstants';
import {
  calculateFusionLoan,
  calculateBridgeLoan,
  validateCalculationInputs,
  formatCurrency
} from '../utils/bridgeFusionCalculations';

export const useBridgeFusionCalculator = () => {
  // Core product selection
  const [productType, setProductType] = useState(BRIDGE_FUSION_PRODUCTS.FUSION);
  const [propertyType, setPropertyType] = useState(
    FUSION_PROPERTY_TYPES.RESIDENTIAL
  );
  
  // Input values
  const [propertyValue, setPropertyValue] = useState('');
  const [selectedLTV, setSelectedLTV] = useState(75);
  const [loanType, setLoanType] = useState(LOAN_TYPE_OPTIONS.MAX_LOAN);
  const [specificGrossLoan, setSpecificGrossLoan] = useState('');
  
  // Rate override (manual input)
  const [rateOverride, setRateOverride] = useState(null);
  
  // Validation
  const [errors, setErrors] = useState({});

  // Get valid property types for selected product
  const validPropertyTypes = useMemo(() => {
    if (productType === BRIDGE_FUSION_PRODUCTS.FUSION) {
      return Object.values(FUSION_PROPERTY_TYPES);
    }
    return Object.values(BRIDGE_PROPERTY_TYPES);
  }, [productType]);

  // Auto-switch property type when product changes
  const handleProductTypeChange = useCallback((newProductType) => {
    setProductType(newProductType);
    
    // Reset property type to first valid option
    if (newProductType === BRIDGE_FUSION_PRODUCTS.FUSION) {
      setPropertyType(FUSION_PROPERTY_TYPES.RESIDENTIAL);
    } else {
      setPropertyType(BRIDGE_PROPERTY_TYPES.RESI_BTL_SINGLE);
    }
    
    // Clear specific loan if switching away from it
    if (loanType === LOAN_TYPE_OPTIONS.SPECIFIC_GROSS) {
      setSpecificGrossLoan('');
    }
    
    // Clear rate override
    setRateOverride(null);
  }, [loanType]);

  // Get loan limits for current selection
  const loanLimits = useMemo(() => {
    return getLoanLimits(productType, propertyType);
  }, [productType, propertyType]);

  // Parse numeric values
  const parsedPropertyValue = useMemo(() => {
    const val = Number(String(propertyValue).replace(/,/g, ''));
    return isNaN(val) ? 0 : val;
  }, [propertyValue]);

  const parsedSpecificGrossLoan = useMemo(() => {
    const val = Number(String(specificGrossLoan).replace(/,/g, ''));
    return isNaN(val) ? 0 : val;
  }, [specificGrossLoan]);

  // Calculate results for all LTV options
  const allResults = useMemo(() => {
    // Validate inputs first
    const validation = validateCalculationInputs({
      propertyValue: parsedPropertyValue,
      ltv: selectedLTV,
      propertyType,
      specificGrossLoan: loanType === LOAN_TYPE_OPTIONS.SPECIFIC_GROSS 
        ? parsedSpecificGrossLoan 
        : null
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return [];
    }

    setErrors([]);

    const results = LTV_OPTIONS.map(ltv => {
      const params = {
        propertyValue: parsedPropertyValue,
        ltv,
        propertyType,
        specificGrossLoan: loanType === LOAN_TYPE_OPTIONS.SPECIFIC_GROSS 
          ? parsedSpecificGrossLoan 
          : null,
        rateOverride
      };

      if (productType === BRIDGE_FUSION_PRODUCTS.FUSION) {
        return {
          ltv,
          ...calculateFusionLoan(params)
        };
      } else if (productType === BRIDGE_FUSION_PRODUCTS.FIXED_BRIDGE) {
        return {
          ltv,
          ...calculateBridgeLoan({
            ...params,
            bridgeType: BRIDGE_FUSION_PRODUCTS.FIXED_BRIDGE
          })
        };
      } else {
        return {
          ltv,
          ...calculateBridgeLoan({
            ...params,
            bridgeType: BRIDGE_FUSION_PRODUCTS.VARIABLE_BRIDGE
          })
        };
      }
    });

    return results.filter(r => !r.error);
  }, [
    productType,
    propertyType,
    parsedPropertyValue,
    selectedLTV,
    loanType,
    parsedSpecificGrossLoan,
    rateOverride
  ]);

  // Get best result (highest net loan)
  const bestResult = useMemo(() => {
    if (allResults.length === 0) return null;
    
    return allResults.reduce((best, current) => {
      return (!best || current.netLoan > best.netLoan) ? current : best;
    }, null);
  }, [allResults]);

  // Check if we can show results
  const canShowResults = useMemo(() => {
    return parsedPropertyValue > 0 && 
           (loanType === LOAN_TYPE_OPTIONS.MAX_LOAN || parsedSpecificGrossLoan > 0);
  }, [parsedPropertyValue, loanType, parsedSpecificGrossLoan]);

  return {
    // State
    productType,
    propertyType,
    propertyValue,
    selectedLTV,
    loanType,
    specificGrossLoan,
    rateOverride,
    errors,
    
    // Setters
    setProductType: handleProductTypeChange,
    setPropertyType,
    setPropertyValue,
    setSelectedLTV,
    setLoanType,
    setSpecificGrossLoan,
    setRateOverride,
    
    // Computed
    validPropertyTypes,
    loanLimits,
    allResults,
    bestResult,
    canShowResults,
    
    // Utilities
    formatCurrency
  };
};