/**
 * Calculation functions for Bridge & Fusion products.
 *
 * These helpers compute gross/net loans, interest rates, monthly
 * payments and other metrics based on the selected product (bridge
 * variable/fixed or fusion), LTV band, property value and other
 * parameters.  They are adapted from the standalone bridge
 * calculator supplied by the user and simplified for integration
 * within SalesforceCalc.
 */

import {
  VARIABLE_RATES,
  FIXED_RATES,
  FUSION_BANDS,
} from '../config/bridgeFusionRates';

/**
 * Round a number up to the nearest step.  Used to round gross loans
 * to the nearest thousand.
 *
 * @param {number} n The value to round.
 * @param {number} step The increment to round up to.
 * @returns {number} The rounded value.
 */
const roundUpTo = (n, step = 1000) => (n > 0 ? Math.ceil(n / step) * step : 0);

/**
 * Determine the LTV bucket for a given gross loan and property value.
 *
 * @param {number} gross The gross loan amount.
 * @param {number} propertyValue The property value.
 * @returns {number} 60, 70 or 75 depending on the LTV.
 */
const ltvBucketFromGross = (gross, propertyValue) => {
  const ltvPct = (gross / (propertyValue || 1)) * 100;
  if (ltvPct <= 60) return 60;
  if (ltvPct <= 70) return 70;
  return 75;
};

/**
 * Resolve the annual full rate for a variable bridge product.  Adds
 * the base rate (BBR) divided by 12 and converted to annual.
 *
 * @param {number} bucket The LTV bucket (60,70,75).
 * @param {string} subProduct The selected sub‑product name.
 * @param {number} bbrPct The base rate (BBR) percentage.
 * @param {number} overrideMonthly Optional override margin (% per month).
 * @returns {number} Annual full rate in decimal form (e.g. 0.08 for 8%).
 */
const resolveBridgeVarRate = (bucket, subProduct, bbrPct, overrideMonthly = 0) => {
  const margin =
    overrideMonthly > 0
      ? overrideMonthly / 100
      : VARIABLE_RATES[bucket][subProduct] || 0;
  return (margin + (bbrPct || 0) / 12) * 12;
};

/**
 * Resolve the annual full rate for a fixed bridge product.
 *
 * @param {number} bucket The LTV bucket (60,70,75).
 * @param {string} subProduct The selected sub‑product.
 * @param {number} overrideMonthly Optional override coupon (% per month).
 * @returns {number} Annual rate in decimal form.
 */
const resolveBridgeFixRate = (bucket, subProduct, overrideMonthly = 0) => {
  const couponMonthly =
    overrideMonthly > 0
      ? overrideMonthly / 100
      : FIXED_RATES[bucket][subProduct] || 0;
  return couponMonthly * 12;
};

/**
 * Resolve the annual full rate and tier name for a fusion product.
 *
 * @param {number} gross Gross loan amount.
 * @param {boolean} isCommercial Whether the property is commercial/semi‑commercial.
 * @param {number} bbrPct Base rate (BBR) percentage.
 * @param {number} overrideMonthly Optional override margin (% per month).
 * @returns {{annualFull: number, tier: string}} Rate and tier.
 */
const resolveFusionRate = (gross, isCommercial, bbrPct, overrideMonthly = 0) => {
  const bands = isCommercial ? FUSION_BANDS.Commercial : FUSION_BANDS.Residential;
  const tier = bands.find((b) => gross >= b.min && gross <= b.max);
  const margin =
    overrideMonthly > 0 ? overrideMonthly / 100 : tier?.margin || 0.04;
  return {
    annualFull: margin + (bbrPct || 0),
    tier: tier?.name || 'N/A',
  };
};

/**
 * Main solver for bridge and fusion calculations.  Returns the
 * calculated gross and net loans, monthly payment and other metrics
 * for a single scenario.  This function is simplified from the
 * standalone bridge calculator and does not include APR or exit fee
 * calculations.  It assumes interest is serviced monthly (not rolled).
 *
 * @param {object} args Input parameters.
 * @param {'bridge-var'|'bridge-fix'|'fusion'} args.kind Product kind.
 * @param {number} args.grossLoanInput Requested gross loan.
 * @param {number} args.propertyValue Property value.
 * @param {string} args.subProduct Selected sub‑product.
 * @param {boolean} args.isCommercial Whether the property is commercial/semi‑commercial.
 * @param {number} args.bbrPct Base rate (BBR) percentage.
 * @param {number} args.overrideMonthly Optional override margin (% per month).
 * @param {number} args.rentPm Monthly rent (Fusion only).
 * @param {number} args.topSlicingPm Additional income for ICR (Fusion).
 * @param {number} args.termMonths Loan term in months.
 * @param {number} args.rolledMonths Number of months of rolled interest.
 * @param {number} args.arrangementPct Arrangement fee percentage.
 * @param {number} args.deferredPct Deferred interest percentage (Fusion).
 * @returns {object} Result metrics.
 */
export function solveBridgeFusion({
  kind,
  grossLoanInput,
  propertyValue,
  subProduct,
  isCommercial,
  bbrPct,
  overrideMonthly,
  rentPm,
  topSlicingPm = 0,
  termMonths = 12,
  rolledMonths = 0,
  arrangementPct = 0.02,
  deferredPct = 0,
}) {
  let gross = Number(grossLoanInput);
  const bucket = ltvBucketFromGross(gross, propertyValue);
  // Determine full annual rate and tier name
  let fullAnnual, tierName;
  if (kind === 'bridge-var') {
    fullAnnual = resolveBridgeVarRate(bucket, subProduct, bbrPct, overrideMonthly);
  } else if (kind === 'bridge-fix') {
    fullAnnual = resolveBridgeFixRate(bucket, subProduct, overrideMonthly);
  } else {
    const res = resolveFusionRate(gross, isCommercial, bbrPct, overrideMonthly);
    fullAnnual = res.annualFull;
    tierName = res.tier;
  }
  const arrangementFeeGBP = gross * arrangementPct;
  const monthlyRate = fullAnnual / 12;
  const rolledInterestGBP = gross * monthlyRate * rolledMonths;
  const deferredGBP = kind === 'fusion' ? gross * deferredPct : 0;
  const netLoanGBP = Math.max(0, gross - arrangementFeeGBP - rolledInterestGBP - deferredGBP);
  const monthlyPaymentGBP = (gross * fullAnnual) / 12;
  const ltv = gross / (propertyValue || 1);
  const icr = kind === 'fusion' ? ((rentPm || 0) + (topSlicingPm || 0)) / (monthlyPaymentGBP || 1) : null;
  return {
    gross,
    netLoanGBP,
    ltv,
    fullRateText: `${(fullAnnual * 100).toFixed(2)}%`,
    monthlyPaymentGBP,
    tier: tierName,
    icr,
    arrangementFeeGBP,
    rolledInterestGBP,
    deferredGBP,
  };
}