// src/__tests__/calculationEngine.test.js
import { computeColumnData } from '../utils/calculationEngine';
import { LOAN_TYPES, PRODUCT_GROUPS, PROPERTY_TYPES } from '../config/constants';
import { LOAN_LIMITS } from '../config/loanLimits';

describe('Calculation Engine', () => {
  // Basic test setup with common parameters
  const baseParams = {
    colKey: 6,
    propertyValue: 350000,
    monthlyRent: 1750,
    loanTypeRequired: LOAN_TYPES.MAX_OPTIMUM_GROSS,
    productType: '2yr Fix',
    tier: 'Tier 1',
    propertyType: PROPERTY_TYPES.RESIDENTIAL,
    productGroup: PRODUCT_GROUPS.SPECIALIST,
    isRetention: 'No',
    retentionLtv: '75',
    criteria: {},
    limits: LOAN_LIMITS.Residential,
    effectiveProcFeePct: 1,
    brokerFeePct: null,
    brokerFeeFlat: null,
    feeOverrides: {},
  };

  // Test basic gross loan calculation
  test('calculates gross loan correctly for standard inputs', () => {
    const result = computeColumnData(baseParams);
    
    expect(result).toBeTruthy();
    expect(result.gross).toBeGreaterThan(0);
    expect(result.net).toBeGreaterThan(0);
    expect(result.gross).toBeLessThanOrEqual(baseParams.limits.MAX_LOAN);
  });

  // Test ICR (Interest Coverage Ratio) calculation
  test('calculates ICR correctly', () => {
    const result = computeColumnData(baseParams);
    
    expect(result.icr).toBeTruthy();
    expect(result.icr).toBeGreaterThan(1); // ICR should always be > 1
  });

  // Test specific net loan scenario
  test('handles specific net loan calculation', () => {
    const specificNetParams = {
      ...baseParams,
      loanTypeRequired: LOAN_TYPES.SPECIFIC_NET,
      specificNetLoan: '250000',
    };

    const result = computeColumnData(specificNetParams);
    
    expect(result).toBeTruthy();
    expect(result.net).toBeCloseTo(Number(specificNetParams.specificNetLoan), -2);
  });

  // Test maximum LTV scenarios
  test('respects maximum LTV rules', () => {
    const maxLTVParams = {
      ...baseParams,
      loanTypeRequired: LOAN_TYPES.MAX_LTV,
      specificLTV: 0.75, // 75% LTV
    };

    const result = computeColumnData(maxLTVParams);
    
    const calculatedLTV = result.gross / baseParams.propertyValue;
    expect(calculatedLTV).toBeLessThanOrEqual(0.75);
  });

  // Test rate overrides
  test('applies rate overrides correctly', () => {
    const overrideParams = {
      ...baseParams,
      overriddenRate: 0.07, // 7% override
    };

    const result = computeColumnData(overrideParams);
    
    expect(result.isRateOverridden).toBe(true);
    expect(result.actualRateUsed).toBeCloseTo(0.07, 3);
  });
});

// src/__tests__/bridgeFusionCalculations.test.js
import { solveBridgeFusion } from '../utils/bridgeFusionCalculations';

describe('Bridge & Fusion Calculations', () => {
  const baseParams = {
    kind: 'fusion',
    grossLoanInput: 300000,
    propertyValue: 400000,
    subProduct: 'Resi BTL single unit',
    isCommercial: false,
    bbrPct: 5.25,
    rentPm: 1750,
  };

  test('calculates fusion loan metrics correctly', () => {
    const result = solveBridgeFusion(baseParams);
    
    expect(result.gross).toBe(baseParams.grossLoanInput);
    expect(result.netLoanGBP).toBeGreaterThan(0);
    expect(result.netLoanGBP).toBeLessThan(result.gross);
    expect(result.monthlyPaymentGBP).toBeGreaterThan(0);
  });

  test('handles different LTV buckets', () => {
    const ltv60Params = { ...baseParams, grossLoanInput: 240000 }; // 60% LTV
    const ltv75Params = { ...baseParams, grossLoanInput: 300000 }; // 75% LTV

    const ltv60Result = solveBridgeFusion(ltv60Params);
    const ltv75Result = solveBridgeFusion(ltv75Params);

    expect(ltv60Result.fullAnnualRate).not.toBe(ltv75Result.fullAnnualRate);
  });
});

// src/__tests__/rateSelectors.test.js
import { 
  getMaxLTV, 
  selectRateSource, 
  getFeeColumns 
} from '../utils/rateSelectors';

describe('Rate Selectors', () => {
  test('getMaxLTV handles different scenarios', () => {
    const resiParams = {
      propertyType: PROPERTY_TYPES.RESIDENTIAL,
      isRetention: 'No',
    };

    const commercialParams = {
      propertyType: PROPERTY_TYPES.COMMERCIAL,
      isRetention: 'Yes',
      retentionLtv: '65',
    };

    expect(getMaxLTV(resiParams)).toBe(0.75);
    expect(getMaxLTV(commercialParams)).toBe(0.65);
  });

  test('selectRateSource returns correct rates', () => {
    const params = {
      propertyType: PROPERTY_TYPES.RESIDENTIAL,
      productGroup: PRODUCT_GROUPS.SPECIALIST,
      isRetention: 'No',
      tier: 'Tier 1',
      productType: '2yr Fix',
    };

    const rates = selectRateSource(params);
    
    expect(rates).toBeTruthy();
    expect(rates[6]).toBeDefined(); // 6% fee column
  });
});

// Complex Formula Verification Test
describe('Complex Calculation Formulas', () => {
  test('net loan calculation matches expected formula', () => {
    const params = {
      ...baseParams,
      propertyValue: 500000,
      monthlyRent: 2500,
    };

    const result = computeColumnData(params);

    // Verify net loan calculation follows expected formula
    const expectedNetLoan = 
      result.gross - 
      (result.gross * (params.colKey / 100)) - // Product fee
      (result.gross * (result.payRateText.split('%')[0] / 100 / 12) * result.rolledMonths); // Rolled interest

    expect(result.net).toBeCloseTo(expectedNetLoan, -2);
  });
});