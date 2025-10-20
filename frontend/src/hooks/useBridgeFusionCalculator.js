import { useState, useEffect } from 'react';
import { solveBridgeFusion } from '../utils/bridgeFusionCalculations';
import {
  LTV_BUCKETS,
  BRIDGE_SUB_PRODUCTS_RESI,
  BRIDGE_SUB_PRODUCTS_COMM,
} from '../config/bridgeFusionRates';

export function useBridgeFusionCalculator() {
  const [selectedProduct, setSelectedProduct] = useState('Fusion'); // 'Fusion', 'Fixed Bridge', 'Variable Bridge'
  const [propertyValue, setPropertyValue] = useState('');
  const [grossLoan, setGrossLoan] = useState('');
  const [propertyType, setPropertyType] = useState('Residential'); // or 'Semi-Commercial', etc.
  const [subProduct, setSubProduct] = useState(BRIDGE_SUB_PRODUCTS_RESI[0]);
  const [rent, setRent] = useState('');
  const [topSlicing, setTopSlicing] = useState(false);
  const [results, setResults] = useState([]);
  const [bestResult, setBestResult] = useState(null);
  const [bbr, setBbr] = useState(5.25); // default base rate
  const [overrideRate, setOverrideRate] = useState('');

  useEffect(() => {
    // Validate and compute whenever inputs change
    const pv = Number(propertyValue);
    const gross = Number(grossLoan);
    if (!pv || !gross || isNaN(pv) || isNaN(gross)) {
      setResults([]);
      setBestResult(null);
      return;
    }

    const kind =
      selectedProduct === 'Fusion'
        ? 'fusion'
        : selectedProduct === 'Variable Bridge'
        ? 'bridge-var'
        : 'bridge-fix';

    const isCommercial =
      propertyType !== 'Residential' && propertyType !== 'Semi-Commercial' ? true : false;

    const scenarios = LTV_BUCKETS.map((ltv) => {
      const grossLTV = (pv * ltv) / 100;
      const solveInput = {
        kind,
        grossLoanInput: grossLTV,
        propertyValue: pv,
        subProduct,
        isCommercial,
        bbrPct: bbr,
        overrideMonthly: overrideRate ? Number(overrideRate) : 0,
        rentPm: Number(rent),
        topSlicingPm: topSlicing ? Number(rent) : 0,
      };
      const calc = solveBridgeFusion(solveInput);
      return {
        ltv,
        ...calc,
      };
    });

    setResults(scenarios);
    // Pick best by highest net loan
    const best = scenarios.reduce((acc, cur) =>
      !acc || cur.netLoanGBP > acc.netLoanGBP ? cur : acc,
      null,
    );
    setBestResult(best);
  }, [selectedProduct, propertyValue, grossLoan, propertyType, subProduct, rent, topSlicing, bbr, overrideRate]);

  // Determine available sub-products depending on property type
  const subProductOptions =
    propertyType === 'Residential' ? BRIDGE_SUB_PRODUCTS_RESI : BRIDGE_SUB_PRODUCTS_COMM;

  return {
    selectedProduct,
    setSelectedProduct,
    propertyValue,
    setPropertyValue,
    grossLoan,
    setGrossLoan,
    propertyType,
    setPropertyType,
    subProduct,
    setSubProduct,
    subProductOptions,
    rent,
    setRent,
    topSlicing,
    setTopSlicing,
    bbr,
    setBbr,
    overrideRate,
    setOverrideRate,
    results,
    bestResult,
  };
}
