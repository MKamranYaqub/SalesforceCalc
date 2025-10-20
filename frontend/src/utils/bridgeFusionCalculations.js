/**
 * Helper functions and main solver for Bridge & Fusion calculations.
 */
import {
  VARIABLE_RATES,
  FIXED_RATES,
  FUSION_BANDS,
  BRIDGE_LIMITS,
} from '../config/bridgeFusionRates';

const roundUpTo = (n, step = 1000) =>
  n > 0 ? Math.ceil(n / step) * step : 0;

const ltvBucketFromGross = (gross, propertyValue) => {
  const ltvPct = (gross / (propertyValue || 1)) * 100;
  if (ltvPct <= 60) return 60;
  if (ltvPct <= 70) return 70;
  return 75;
};

const resolveBridgeVarRate = (bucket, subProduct, bbrPct, overrideMonthly = 0) => {
  const margin = overrideMonthly > 0
    ? overrideMonthly / 100
    : VARIABLE_RATES[bucket][subProduct] || 0;
  return (margin + (bbrPct || 0) / 12) * 12; // annual
};

const resolveBridgeFixRate = (bucket, subProduct, overrideMonthly = 0) => {
  const couponMonthly = overrideMonthly > 0
    ? overrideMonthly / 100
    : FIXED_RATES[bucket][subProduct] || 0;
  return couponMonthly * 12; // annual
};

const resolveFusionRate = (gross, isCommercial, bbrPct, overrideMonthly = 0) => {
  const bands = isCommercial ? FUSION_BANDS.Commercial : FUSION_BANDS.Residential;
  const tier = bands.find((b) => gross >= b.min && gross <= b.max);
  const margin = overrideMonthly > 0 ? (overrideMonthly / 100) : tier?.margin || 0.04;
  return {
    annualFull: margin + (bbrPct || 0),
    tier: tier?.name || 'N/A',
  };
};

/**
 * Main solver. You can extend this to handle rolled months, deferred interest,
 * exit fees, etc., exactly as in your standalone `solveScenario`.
 */
export function solveBridgeFusion({
  kind,            // 'bridge-var', 'bridge-fix', or 'fusion'
  grossLoanInput,  // requested gross loan
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
