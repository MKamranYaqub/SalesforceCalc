import { supabase } from '../config/supabase.js';

/**
 * Helper function to safely parse numeric values
 */
const parseNumeric = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove % and any other non-numeric characters except decimal point and minus
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};

/**
 * Create a new case
 */
export const createCase = async (caseData) => {
  const { data, error } = await supabase
    .from('cases')
    .insert([{
      user_access_level: caseData.userAccessLevel || 'web_customer',
      property_value: caseData.propertyValue,
      monthly_rent: caseData.monthlyRent,
      property_type: caseData.propertyType,
      product_type: caseData.productType,
      product_group: caseData.productGroup,
      tier: caseData.tier,
      is_retention: caseData.isRetention === 'Yes' || caseData.isRetention === true,
      retention_ltv: caseData.retentionLtv ? parseInt(caseData.retentionLtv) : null,
      loan_type_required: caseData.loanTypeRequired,
      specific_net_loan: caseData.specificNetLoan,
      specific_gross_loan: caseData.specificGrossLoan,
      specific_ltv: caseData.specificLTV,
      proc_fee_pct: caseData.procFeePct,
      broker_fee_pct: caseData.brokerFeePct,
      broker_fee_flat: caseData.brokerFeeFlat,
      calculation_data: caseData.fullCalculationData,
      best_gross_loan: caseData.bestGrossLoan,
      best_net_loan: caseData.bestNetLoan,
      best_fee_column: caseData.bestFeeColumn,
      status: 'draft'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating case:', error);
    throw error;
  }

  return data;
};

/**
 * Save case results - WITH PROPER NUMERIC PARSING
 */
export const saveCaseResults = async (caseId, results) => {
  console.log('💾 Saving case results for case:', caseId);
  console.log('📊 Raw results:', results);

  const resultsData = results.map((result, index) => {
    // Parse ALL numeric fields properly
    const parsed = {
      case_id: caseId,
      fee_column: parseNumeric(result.feeColumn),
      gross_loan: parseNumeric(result.grossLoan),
      net_loan: parseNumeric(result.netLoan),
      ltv_percentage: parseNumeric(result.ltvPercentage),
      icr: parseNumeric(result.icr),
      full_rate: parseNumeric(result.fullRate),
      pay_rate: result.payRate, // Keep as text - it's a display string like "5.76%" or "1.59% + BBR"
      rolled_months: result.rolledMonths ? parseInt(result.rolledMonths) : null,
      deferred_rate: parseNumeric(result.deferredRate),
      product_fee: parseNumeric(result.productFee),
      rolled_interest: parseNumeric(result.rolledInterest),
      deferred_interest: parseNumeric(result.deferredInterest),
      direct_debit: parseNumeric(result.directDebit)
    };

    console.log(`📋 Parsed result ${index + 1}:`, parsed);
    return parsed;
  });

  console.log('✅ All results parsed, inserting to database...');

  const { error } = await supabase
    .from('case_results')
    .insert(resultsData);

  if (error) {
    console.error('Error saving case results:', error);
    throw error;
  }

  console.log('✅ Case results saved successfully');
};

/**
 * Get case by reference number
 */
export const getCaseByReference = async (reference) => {
  // First get the case
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      case_results (*)
    `)
    .eq('case_reference', reference)
    .single();

  if (error) {
    console.error('Error fetching case:', error);
    throw error;
  }

  // Update access tracking
  if (data) {
    await supabase
      .from('cases')
      .update({
        accessed_count: (data.accessed_count || 0) + 1,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', data.id);
  }

  return data;
};

/**
 * Update case
 */
export const updateCase = async (caseId, updates) => {
  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', caseId)
    .select()
    .single();

  if (error) {
    console.error('Error updating case:', error);
    throw error;
  }

  return data;
};