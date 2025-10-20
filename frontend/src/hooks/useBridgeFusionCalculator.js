/**
 * Bridge & Fusion Calculator Hook
 * Manages state and calculations for Bridge and Fusion products
 * 
 * FILE LOCATION: frontend/src/hooks/useBridgeFusionCalculator.js
 */

import { useState, useEffect, useMemo } from 'react';
import { calculateFusionLoan, calculateBridgeLoan } from '../utils/bridgeFusionCalculations';
import { PROPERTY_TYPES, LTV_OPTIONS } from '../utils/bridgeFusionRates';

export const useBridgeFusionCalculator = () => {
  // Product selection
  const [selectedProduct, setSelectedProduct] = useState('Fusion'); // 'Fusion', 'Fixed Bridge', 'Variable Bridge'
  
  // Common inputs
  const [purchasePrice, setPurchasePrice] = useState('');
  const [propertyType, setPropertyType] = useState('Residential'); // Default for Fusion
  
  // Fusion-specific inputs
  const [rent, setRent] = useState('');
  const [topSlicing, setTopSlicing] = useState('');
  
  // Results state
  const [results, setResults] = useState(null);
  const [bestResult, setBestResult] = useState(null);

  // Update property type when product changes
  useEffect(() => {
    if (selectedProduct === 'Fusion') {
      setPropertyType('Residential');
    } else {
      // Bridge products
      setPropertyType('Resi BTL single unit');
    }
  }, [selectedProduct]);

  // Get property type options based on selected product
  const propertyTypeOptions = useMemo(() => {
    if (selectedProduct === 'Fusion') {
      return PROPERTY_TYPES.FUSION;
    }
    return PROPERTY_TYPES.BRIDGE;
  }, [selectedProduct]);

  // Calculate results for all LTV options
  const calculateResults = () => {
    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      setResults(null);
      setBestResult(null);
      return;
    }

    try {
      const calculatedResults = {};
      let best = null;
      let highestNetLoan = 0;

      LTV_OPTIONS.forEach(ltv => {
        let result;
        
        if (selectedProduct === 'Fusion') {
          // Calculate Fusion
          result = calculateFusionLoan({
            propertyType,
            purchasePrice: parseFloat(purchasePrice),
            ltv,
            rent: parseFloat(rent) || 0,
            topSlicing: parseFloat(topSlicing) || 0
          });
        } else {
          // Calculate Bridge (Variable or Fixed)
          const bridgeType = selectedProduct === 'Variable Bridge' ? 'Variable' : 'Fixed';
          result = calculateBridgeLoan({
            productType: bridgeType,
            propertyType,
            purchasePrice: parseFloat(purchasePrice),
            ltv
          });
        }

        calculatedResults[ltv] = result;

        // Track best result (highest net loan)
        if (result.netLoan > highestNetLoan) {
          highestNetLoan = result.netLoan;
          best = { ...result, ltv };
        }
      });

      setResults(calculatedResults);
      setBestResult(best);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
      setBestResult(null);
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateResults();
  }, [selectedProduct, purchasePrice, propertyType, rent, topSlicing]);

  return {
    // Product selection
    selectedProduct,
    setSelectedProduct,
    
    // Inputs
    purchasePrice,
    setPurchasePrice,
    propertyType,
    setPropertyType,
    rent,
    setRent,
    topSlicing,
    setTopSlicing,
    
    // Options
    propertyTypeOptions,
    
    // Results
    results,
    bestResult,
    
    // Actions
    calculateResults
  };
};