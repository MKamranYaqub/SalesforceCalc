import { useState, useEffect } from 'react';
import { solveBridgeFusion } from '../utils/bridgeFusionCalculations';
import {
  LTV_BUCKETS,
  BRIDGE_SUB_PRODUCTS_RESI,
  BRIDGE_SUB_PRODUCTS_COMM,
} from '../config/bridgeFusionRates';

/**
 * Hook to manage state for Bridge & Fusion calculations.  It tracks
 * inputs such as property value, gross loan, property type and
 * sub‑product, computes results for each LTV bucket and identifies
 * the best option by net loan.
 */
export function useBridgeFusionCalculator() {
  // State for common inputs
  const [propertyValue, setPropertyValue] = useState('');
  const [grossLoan, setGrossLoan] = useState('');
  const [propertyType, setPropertyType] = useState('Residential');
  const [subProduct, setSubProduct] = useState(BRIDGE_SUB_PRODUCTS_RESI[0]);
  const [rent, setRent] = useState('');
  const [topSlicing, setTopSlicing] = useState(false);
  const [results, setResults] = useState([]);
  const [bestResults, setBestResults] = useState({});
  const [bbr, setBbr] = useState(5.25);
  const [overrideRate, setOverrideRate] = useState('');
  const [arrangementPct, setArrangementPct] = useState(0.02);
  const [deferredPct, setDeferredPct] = useState(0);
  const [rolledMonths, setRolledMonths] = useState(0);
  const [procFeePct, setProcFeePct] = useState(0);
  const [brokerFeeFlat, setBrokerFeeFlat] = useState(0);

  useEffect(() => {
    const pv = Number(propertyValue);
    const gross = Number(grossLoan);
    if (!pv || !gross || isNaN(pv) || isNaN(gross)) {
      setResults([]);
      setBestResults({});
      return;
    }
    // Determine if the property is commercial or semi-commercial.  In
    // bridge & fusion we treat Semi-Commercial as residential for
    // rental calculations, so only Full Commercial counts as
    // commercial here.
    const isComm = propertyType !== 'Residential' && propertyType !== 'Semi-Commercial';
    // Define product names and mapping to solver kinds
    const products = ['Fusion', 'Variable Bridge', 'Fixed Bridge'];
    const kindMap = {
      Fusion: 'fusion',
      'Variable Bridge': 'bridge-var',
      'Fixed Bridge': 'bridge-fix',
    };

    // Calculate results for each product using the actual gross loan
    const singleResult = {};
    products.forEach((prod) => {
      const calc = solveBridgeFusion({
        kind: kindMap[prod],
        grossLoanInput: gross,
        propertyValue: pv,
        subProduct,
        isCommercial: isComm,
        bbrPct: bbr,
        overrideMonthly: overrideRate ? Number(overrideRate) : 0,
        rentPm: Number(rent),
        topSlicingPm: topSlicing ? Number(rent) : 0,
        arrangementPct,
        deferredPct,
        rolledMonths,
        procFeePct,
        brokerFeeFlat: Number(brokerFeeFlat),
      });
      singleResult[prod] = calc;
    });

    setResults([singleResult]); // Array with single result object
    setBestResults(singleResult); // Same as single result
  }, [propertyValue, grossLoan, propertyType, subProduct, rent, topSlicing, bbr, overrideRate, arrangementPct, deferredPct, rolledMonths, procFeePct, brokerFeeFlat]);
  const subProductOptions =
    propertyType === 'Residential' ? BRIDGE_SUB_PRODUCTS_RESI : BRIDGE_SUB_PRODUCTS_COMM;
  return {
    // Input values
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
    arrangementPct,
    setArrangementPct,
    deferredPct,
    setDeferredPct,
    rolledMonths,
    setRolledMonths,
    procFeePct,
    setProcFeePct,
    brokerFeeFlat,
    setBrokerFeeFlat,
    // Outputs
    results,
    bestResults,
  };
}