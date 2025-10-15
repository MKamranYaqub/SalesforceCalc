/**
 * Core loan calculation engine - Updated to include ICR calculation
 */
import { parseNumber } from './formatters';
import { getMaxLTV, applyFloorRate } from './rateSelectors';
import { LOAN_TYPES, PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';

export const computeColumnData = (params) => {
  const {
    colKey,
    manualRolled,
    manualDeferred,
    overriddenRate,
    selected,
    propertyValue,
    monthlyRent,
    specificNetLoan,
    specificGrossLoan,
    specificLTV,
    loanTypeRequired,
    productType,
    tier,
    criteria,
    propertyType,
    productGroup,
    isRetention,
    retentionLtv,
    effectiveProcFeePct,
    brokerFeePct,
    brokerFeeFlat,
    feeOverrides,
    limits,
  } = params;

  const baseRate = selected?.[colKey];
  if (baseRate == null && overriddenRate == null) {
    return null;
  }

  const parsedPropertyValue = parseNumber(propertyValue);
  const parsedMonthlyRent = parseNumber(monthlyRent);
  const parsedSpecificNetLoan = parseNumber(specificNetLoan);
  const parsedSpecificGrossLoan = parseNumber(specificGrossLoan);

  const feePercentageDecimal = (feeOverrides[colKey] != null
    ? Number(feeOverrides[colKey])
    : Number(colKey)) / 100;

  const minimumInterestCoverageRatio = productType.includes("Fix") 
    ? limits.MIN_ICR_FIX 
    : limits.MIN_ICR_TRK;

  const maximumLtvPercentage = getMaxLTV({
    propertyType,
    isRetention,
    retentionLtv,
    propertyAnswers: criteria,
    tier,
    productType,
  });
  
  const ltvCapFromRules = parsedPropertyValue 
    ? Math.round(maximumLtvPercentage * parsedPropertyValue) 
    : Infinity;
  
  const specificLtvCap = loanTypeRequired === LOAN_TYPES.MAX_LTV && specificLTV != null
    ? parsedPropertyValue * specificLTV
    : Infinity;

  let loanToValueCap = loanTypeRequired === LOAN_TYPES.MAX_LTV
    ? Math.min(specificLtvCap, ltvCapFromRules)
    : ltvCapFromRules;

  if (loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS && 
      parsedSpecificGrossLoan != null && 
      parsedSpecificGrossLoan > 0) {
    loanToValueCap = Math.min(loanToValueCap, parsedSpecificGrossLoan);
  }

  const termInMonths = limits.TERM_MONTHS?.[productType] ?? 24;
  
  const maximumDeferredInterestRate = selected?.isMargin 
    ? limits.MAX_DEFERRED_TRACKER 
    : limits.MAX_DEFERRED_FIX;

  const actualBaseRate = overriddenRate != null ? overriddenRate : baseRate;
  
  const isTrackerProduct = !!selected?.isMargin;

  let displayRate = isTrackerProduct 
    ? actualBaseRate + limits.STANDARD_BBR 
    : actualBaseRate;
  
  let stressTestRate = isTrackerProduct 
    ? actualBaseRate + limits.STRESS_BBR 
    : displayRate;

  let displayRateForGrossCalculation = displayRate;
  let stressRateForGrossCalculation = stressTestRate;

  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    displayRateForGrossCalculation = applyFloorRate(
      displayRateForGrossCalculation, 
      productGroup, 
      propertyType
    );
    stressRateForGrossCalculation = applyFloorRate(
      stressRateForGrossCalculation, 
      productGroup, 
      propertyType
    );
  }

  const evaluateLoanCombination = (rolledMonths, deferredInterestRate) => {
    const remainingMonths = Math.max(termInMonths - rolledMonths, 1);
    
    const stressAdjustedRate = Math.max(
      stressRateForGrossCalculation - deferredInterestRate, 
      1e-6
    );

    let maximumGrossFromRent = Infinity;
    if (parsedMonthlyRent && stressAdjustedRate > 0) {
      const annualRentalIncome = parsedMonthlyRent * termInMonths;
      
      maximumGrossFromRent = annualRentalIncome / (
        minimumInterestCoverageRatio * 
        (stressAdjustedRate / 12) * 
        remainingMonths
      );
    }

    let grossLoanFromSpecificNet = Infinity;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET && 
        parsedSpecificNetLoan != null && 
        feePercentageDecimal < 1) {
      
      const paymentRateAdjusted = Math.max(
        displayRateForGrossCalculation - deferredInterestRate, 
        0
      );
      
      const denominator = 1 
        - feePercentageDecimal 
        - (paymentRateAdjusted / 12) * rolledMonths 
        - (deferredInterestRate / 12) * termInMonths;
      
      if (denominator > 1e-7) {
        grossLoanFromSpecificNet = parsedSpecificNetLoan / denominator;
      }
    }

    let eligibleGrossLoan = Math.min(
      loanToValueCap,
      maximumGrossFromRent,
      limits.MAX_LOAN
    );
    
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET) {
      eligibleGrossLoan = Math.min(eligibleGrossLoan, grossLoanFromSpecificNet);
    }

    if (eligibleGrossLoan < limits.MIN_LOAN - 1e-6) {
      eligibleGrossLoan = 0;
    }

    const paymentRateAdjusted = Math.max(
      displayRateForGrossCalculation - deferredInterestRate, 
      0
    );
    
    const productFeeAmount = eligibleGrossLoan * feePercentageDecimal;
    
    const rolledInterestAmount = eligibleGrossLoan * 
      (paymentRateAdjusted / 12) * 
      rolledMonths;
    
    const deferredInterestAmount = eligibleGrossLoan * 
      (deferredInterestRate / 12) * 
      termInMonths;
    
    const netLoanAmount = eligibleGrossLoan 
      - productFeeAmount 
      - rolledInterestAmount 
      - deferredInterestAmount;
    
    const loanToValueRatio = parsedPropertyValue 
      ? eligibleGrossLoan / parsedPropertyValue 
      : null;

    const processingFeePercentageDecimal = Number(effectiveProcFeePct || 0) / 100;
    const brokerFeePercentageDecimal = brokerFeePct ? Number(brokerFeePct) / 100 : 0;
    
    const processingFeeValue = eligibleGrossLoan * processingFeePercentageDecimal;
    const brokerFeeValue = brokerFeeFlat
      ? Number(brokerFeeFlat)
      : eligibleGrossLoan * brokerFeePercentageDecimal;

    // Calculate ICR (Interest Coverage Ratio)
    // ICR = Annual Rental Income / Annual Interest Payment
    // Must consider rolled months (no payment) and deferred interest adjustment
    let calculatedICR = null;
    if (parsedMonthlyRent && eligibleGrossLoan > 0 && paymentRateAdjusted > 0 && remainingMonths > 0) {
      const annualRent = parsedMonthlyRent * 12;
      
      // Monthly interest payment using the pay rate (after deferred adjustment)
      const monthlyInterestPayment = eligibleGrossLoan * (paymentRateAdjusted / 12);
      
      // Total interest paid over the term (excluding rolled months where no payment is made)
      const totalInterestPaid = monthlyInterestPayment * remainingMonths;
      
      // Annualize the interest payment based on the full term
      const annualizedInterestPayment = (totalInterestPaid / termInMonths) * 12;
      
      calculatedICR = annualRent / annualizedInterestPayment;
    }

    return {
      grossLoan: eligibleGrossLoan,
      netLoan: netLoanAmount,
      productFeeAmount,
      rolledInterestAmount,
      deferredInterestAmount,
      loanToValueRatio,
      rolledMonths,
      deferredInterestRate,
      paymentRateAdjusted,
      processingFeeValue,
      brokerFeeValue,
      icr: calculatedICR,
    };
  };

  let bestLoanResult = null;

  if (productGroup === PRODUCT_GROUPS.CORE && 
      propertyType === PROPERTY_TYPES.RESIDENTIAL) {
    bestLoanResult = evaluateLoanCombination(0, 0);
  } 
  else if (manualRolled != null || manualDeferred != null) {
    const manualRolledMonths = Number.isFinite(manualRolled) ? manualRolled : 0;
    const manualDeferredRate = Number.isFinite(manualDeferred) ? manualDeferred : 0;
    
    const safeRolledMonths = Math.max(
      0, 
      Math.min(manualRolledMonths, limits.MAX_ROLLED_MONTHS)
    );
    const safeDeferredRate = Math.max(
      0, 
      Math.min(manualDeferredRate, maximumDeferredInterestRate)
    );
    
    try {
      bestLoanResult = evaluateLoanCombination(safeRolledMonths, safeDeferredRate);
      
      if (!bestLoanResult || !isFinite(bestLoanResult.grossLoan)) {
        bestLoanResult = evaluateLoanCombination(0, 0);
      }
    } catch {
      bestLoanResult = evaluateLoanCombination(0, 0);
    }
  } 
  else {
    const maximumRolledMonths = Math.min(limits.MAX_ROLLED_MONTHS, termInMonths);
    const deferredStepSize = 0.0001;
    const totalDeferredSteps = Math.max(
      1, 
      Math.round(maximumDeferredInterestRate / deferredStepSize)
    );
    
    for (let rolledMonths = 0; rolledMonths <= maximumRolledMonths; rolledMonths += 1) {
      for (let deferredStepIndex = 0; deferredStepIndex <= totalDeferredSteps; deferredStepIndex += 1) {
        const deferredInterestRate = deferredStepIndex * deferredStepSize;
        const loanCalculationResult = evaluateLoanCombination(
          rolledMonths, 
          deferredInterestRate
        );
        
        if (!bestLoanResult || 
            loanCalculationResult.netLoan > bestLoanResult.netLoan) {
          bestLoanResult = loanCalculationResult;
        }
      }
    }
  }

  if (!bestLoanResult) {
    return null;
  }

  const isBelowMinimumLoan = bestLoanResult.grossLoan > 0 && 
    bestLoanResult.grossLoan < limits.MIN_LOAN - 1e-6;
  
  const hasReachedMaximumLoan = Math.abs(
    bestLoanResult.grossLoan - limits.MAX_LOAN
  ) < 1e-6;

  const fullRateDisplayText = isTrackerProduct
    ? `${((actualBaseRate + limits.STANDARD_BBR) * 100).toFixed(2)}%`
    : `${(displayRate * 100).toFixed(2)}%`;

  const paymentRateDisplayText = isTrackerProduct
    ? `${(bestLoanResult.paymentRateAdjusted * 100).toFixed(2)}% + BBR`
    : `${(bestLoanResult.paymentRateAdjusted * 100).toFixed(2)}%`;

  const monthlyDirectDebitAmount = bestLoanResult.grossLoan * 
    (bestLoanResult.paymentRateAdjusted / 12);

  return {
    productName: `${productType}, ${tier}`,
    productType,
    fullRateText: fullRateDisplayText,
    actualRateUsed: isTrackerProduct ? actualBaseRate : displayRate,
    isRateOverridden: overriddenRate != null,
    payRateText: paymentRateDisplayText,
    net: bestLoanResult.netLoan,
    gross: bestLoanResult.grossLoan,
    feeAmt: bestLoanResult.productFeeAmount,
    rolled: bestLoanResult.rolledInterestAmount,
    deferred: bestLoanResult.deferredInterestAmount,
    ltv: bestLoanResult.loanToValueRatio,
    deferredCapPct: bestLoanResult.deferredInterestRate,
    rolledMonths: bestLoanResult.rolledMonths,
    termMonths: termInMonths,
    directDebit: monthlyDirectDebitAmount,
    ddStartMonth: bestLoanResult.rolledMonths + 1,
    procFeeValue: bestLoanResult.processingFeeValue,
    brokerFeeValue: bestLoanResult.brokerFeeValue,
    maxLtvRule: maximumLtvPercentage,
    belowMin: isBelowMinimumLoan,
    hitMaxCap: hasReachedMaximumLoan,
    isManual: manualRolled != null || manualDeferred != null,
    icr: bestLoanResult.icr,
  };
};