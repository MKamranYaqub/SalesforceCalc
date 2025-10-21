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
 * @param {number} args.procFeePct Processing fee percentage.
 * @param {number} args.brokerFeeFlat Broker fee flat amount.
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
  procFeePct = 0,
  brokerFeeFlat = 0,
}) {
  let gross = Number(grossLoanInput);
  const bucket = ltvBucketFromGross(gross, propertyValue);

  // Determine full annual rate, margin/coupon, and tier name
  let fullAnnual, marginMonthly, couponMonthly, tierName, bbrMonthly;
  bbrMonthly = (bbrPct || 0) / 12 / 100; // Convert annual % to monthly decimal

  if (kind === 'bridge-var') {
    marginMonthly = overrideMonthly > 0
      ? overrideMonthly / 100
      : VARIABLE_RATES[bucket][subProduct] || 0;
    fullAnnual = (marginMonthly + (bbrPct || 0) / 12) * 12;
    couponMonthly = marginMonthly; // For variable, coupon = margin
  } else if (kind === 'bridge-fix') {
    couponMonthly = overrideMonthly > 0
      ? overrideMonthly / 100
      : FIXED_RATES[bucket][subProduct] || 0;
    fullAnnual = couponMonthly * 12;
    marginMonthly = couponMonthly; // For fixed, margin = coupon
  } else {
    // Fusion
    const res = resolveFusionRate(gross, isCommercial, bbrPct, overrideMonthly);
    fullAnnual = res.annualFull;
    tierName = res.tier;
    marginMonthly = overrideMonthly > 0 ? overrideMonthly / 100 : (res.annualFull - (bbrPct || 0)) / 12;
    couponMonthly = marginMonthly;
  }

  // Calculate fees
  const arrangementFeeGBP = gross * arrangementPct;
  const procFeeGBP = gross * (procFeePct / 100);
  const brokerFeeGBP = brokerFeeFlat;

  // Calculate interest components
  const monthlyRatePct = fullAnnual / 12; // as decimal
  const servicedMonths = termMonths - rolledMonths;

  // Rolled interest breakdown
  const rolledIntCoupon = gross * couponMonthly * rolledMonths;
  const rolledIntBBR = kind === 'bridge-var' || kind === 'fusion'
    ? gross * bbrMonthly * rolledMonths
    : 0;
  const rolledInterestGBP = rolledIntCoupon + rolledIntBBR;

  // Deferred interest
  const deferredGBP = kind === 'fusion' ? gross * deferredPct : 0;

  // Serviced interest (total interest over serviced months)
  const servicedInterestGBP = gross * monthlyRatePct * servicedMonths;

  // Total interest
  const totalInterest = deferredGBP + rolledInterestGBP + servicedInterestGBP;

  // Monthly payment breakdown
  const fullIntCoupon = gross * couponMonthly;
  const fullIntBBR = kind === 'bridge-var' || kind === 'fusion'
    ? gross * bbrMonthly
    : 0;
  const monthlyPaymentGBP = fullIntCoupon + fullIntBBR;

  // Net calculations
  const netLoanGBP = Math.max(0, gross - arrangementFeeGBP - rolledInterestGBP - deferredGBP - procFeeGBP - brokerFeeGBP);

  // LTV calculations
  const grossLTV = (gross / (propertyValue || 1)) * 100;
  const netLTV = (netLoanGBP / (propertyValue || 1)) * 100;

  // APRC calculation (simplified - assumes single payment at end)
  const totalAmountRepayable = gross + totalInterest;
  const aprcAnnual = ((totalAmountRepayable / netLoanGBP - 1) / (termMonths / 12)) * 100;
  const aprcMonthly = aprcAnnual / 12;

  // ICR
  const icr = kind === 'fusion' ? ((rentPm || 0) + (topSlicingPm || 0)) / (monthlyPaymentGBP || 1) : null;

  // Pay rate (monthly interest rate actually being paid)
  const payRateMonthly = monthlyRatePct;

  return {
    // Basic loan info
    gross,
    netLoanGBP,
    npb: netLoanGBP, // NPB = Net Proceeds to Borrower
    grossLTV,
    netLTV,
    ltv: bucket,

    // Rates
    fullAnnualRate: fullAnnual * 100, // as percentage
    fullRateMonthly: monthlyRatePct * 100, // as percentage
    fullCouponRateMonthly: couponMonthly * 100, // as percentage
    payRateMonthly: payRateMonthly * 100, // as percentage
    fullRateText: `${(fullAnnual * 100).toFixed(2)}%`,

    // Fees
    arrangementFeeGBP,
    procFeePct,
    procFeeGBP,
    brokerFeeGBP,

    // Interest breakdown
    servicedMonths,
    rolledInterestGBP,
    rolledIntCoupon,
    rolledIntBBR,
    deferredGBP,
    servicedInterestGBP,
    totalInterest,

    // Interest components for display
    fullIntCoupon,
    fullIntBBR,

    // Payment
    monthlyPaymentGBP,

    // APRC
    aprcAnnual,
    aprcMonthly,

    // Other
    tier: tierName,
    icr,
  };
}