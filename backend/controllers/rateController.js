import { fetchRates, fetchLoanLimits, fetchTermMonths, transformRatesForApp } from '../services/rateService.js';

/**
 * Get all configuration data at once
 */
export const getConfiguration = async (req, res) => {
  try {
    const [rates, limits, termMonths] = await Promise.all([
      fetchRates(),
      fetchLoanLimits(),
      fetchTermMonths()
    ]);
    
    // Transform rates
    const transformedRates = transformRatesForApp(rates);
    
    // Transform loan limits
    const transformedLimits = {};
    limits.forEach(limit => {
      const termMonthsMap = {};
      termMonths
        .filter(tm => tm.months)
        .forEach(tm => {
          termMonthsMap[tm.rate_type.name] = tm.months;
        });
      
      transformedLimits[limit.property_type.name] = {
        MAX_ROLLED_MONTHS: limit.max_rolled_months,
        MAX_DEFERRED_FIX: limit.max_deferred_fix,
        MAX_DEFERRED_TRACKER: limit.max_deferred_tracker,
        MIN_ICR_FIX: limit.min_icr_fix,
        MIN_ICR_TRK: limit.min_icr_trk,
        TOTAL_TERM: limit.total_term,
        MIN_LOAN: limit.min_loan,
        MAX_LOAN: limit.max_loan,
        STANDARD_BBR: limit.standard_bbr,
        STRESS_BBR: limit.stress_bbr,
        CURRENT_MVR: limit.current_mvr,
        TERM_MONTHS: termMonthsMap
      };
    });
    
    res.json({
      success: true,
      data: {
        rates: transformedRates,
        limits: transformedLimits
      }
    });
  } catch (error) {
    console.error('Error getting configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration',
      error: error.message
    });
  }
};