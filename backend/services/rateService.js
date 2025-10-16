import { supabase } from '../config/supabase.js';

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
      is_retention: caseData.isRetention === 'Yes',
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
 * Save case results
 */
export const saveCaseResults = async (caseId, results) => {
  const resultsData = results.map(result => ({
    case_id: caseId,
    fee_column: result.feeColumn,
    gross_loan: result.grossLoan,
    net_loan: result.netLoan,
    ltv_percentage: result.ltvPercentage,
    icr: result.icr,
    full_rate: result.fullRate,
    pay_rate: result.payRate,
    rolled_months: result.rolledMonths,
    deferred_rate: result.deferredRate,
    product_fee: result.productFee,
    rolled_interest: result.rolledInterest,
    deferred_interest: result.deferredInterest,
    direct_debit: result.directDebit
  }));

  const { error } = await supabase
    .from('case_results')
    .insert(resultsData);

  if (error) {
    console.error('Error saving case results:', error);
    throw error;
  }
};

/**
 * Get case by reference number
 */
export const getCaseByReference = async (reference) => {
  // Update access tracking
  await supabase.rpc('increment_case_access', { 
    case_ref: reference 
  });

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