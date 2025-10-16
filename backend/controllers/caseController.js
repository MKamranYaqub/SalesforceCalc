import { supabase } from '../config/supabase.js';
import { createCase, saveCaseResults, getCaseByReference, updateCase } from '../services/caseService.js';

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
 * Create a new case and save calculation
 */
export const saveCalculation = async (req, res) => {
  try {
    const { 
      userAccessLevel,
      calculationData, 
      results,
      bestSummary 
    } = req.body;

    console.log('📥 Received save request:', { 
      userAccessLevel, 
      hasCalculationData: !!calculationData,
      resultsCount: results?.length,
      hasBestSummary: !!bestSummary
    });

    if (!calculationData) {
      return res.status(400).json({
        success: false,
        message: 'Calculation data is required'
      });
    }

    // Safely parse all numeric fields
    const caseData = {
      userAccessLevel: userAccessLevel || 'web_customer',
      propertyValue: parseNumeric(calculationData.propertyValue),
      monthlyRent: parseNumeric(calculationData.monthlyRent),
      propertyType: calculationData.propertyType,
      productType: calculationData.productType,
      productGroup: calculationData.productGroup,
      tier: calculationData.tier,
      isRetention: calculationData.isRetention === 'Yes',
      retentionLtv: calculationData.retentionLtv ? parseInt(calculationData.retentionLtv) : null,
      loanTypeRequired: calculationData.loanTypeRequired,
      specificNetLoan: parseNumeric(calculationData.specificNetLoan),
      specificGrossLoan: parseNumeric(calculationData.specificGrossLoan),
      specificLTV: parseNumeric(calculationData.specificLTV),
      procFeePct: parseNumeric(calculationData.procFeePct),
      brokerFeePct: parseNumeric(calculationData.brokerFeePct),
      brokerFeeFlat: parseNumeric(calculationData.brokerFeeFlat),
      fullCalculationData: calculationData,
      bestGrossLoan: bestSummary?.gross ? parseNumeric(bestSummary.gross) : null,
      bestNetLoan: bestSummary?.net ? parseNumeric(bestSummary.net) : null,
      bestFeeColumn: bestSummary?.colKey ? parseNumeric(bestSummary.colKey) : null
    };

    console.log('📋 Parsed case data:', caseData);

    const newCase = await createCase(caseData);
    console.log('✅ Case created:', newCase.case_reference);

    // Save results if provided
    if (results && results.length > 0) {
      const formattedResults = results.map(r => ({
        feeColumn: parseNumeric(r.colKey),
        grossLoan: parseNumeric(r.gross),
        netLoan: parseNumeric(r.net),
        ltvPercentage: r.ltv ? parseNumeric(r.ltv) * 100 : null,
        icr: parseNumeric(r.icr),
        fullRate: parseNumeric(r.actualRateUsed),
        payRate: r.payRateText,
        rolledMonths: r.rolledMonths ? parseInt(r.rolledMonths) : null,
        deferredRate: parseNumeric(r.deferredCapPct),
        productFee: parseNumeric(r.feeAmt),
        rolledInterest: parseNumeric(r.rolled),
        deferredInterest: parseNumeric(r.deferred),
        directDebit: parseNumeric(r.directDebit)
      }));

      console.log('💾 Saving results:', formattedResults.length);
      await saveCaseResults(newCase.id, formattedResults);
      console.log('✅ Results saved');
    }

    res.status(201).json({
      success: true,
      message: 'Calculation saved successfully',
      caseReference: newCase.case_reference,
      caseId: newCase.id
    });
  } catch (error) {
    console.error('❌ Error saving calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save calculation',
      error: error.message
    });
  }
};

/**
 * Get case by reference number
 */
export const getCase = async (req, res) => {
  try {
    const { reference } = req.params;

    console.log('🔍 Looking up case:', reference);

    if (!reference || !reference.startsWith('MFS')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case reference format. Must start with MFS'
      });
    }

    const caseData = await getCaseByReference(reference);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', reference);

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    console.error('❌ Error getting case:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve case',
      error: error.message
    });
  }
};

/**
 * Update case status
 */
export const updateCaseStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: draft, submitted, approved, or rejected'
      });
    }

    const existingCase = await getCaseByReference(reference);
    
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const updatedCase = await updateCase(existingCase.id, { status });

    res.json({
      success: true,
      message: 'Case status updated successfully',
      data: updatedCase
    });
  } catch (error) {
    console.error('❌ Error updating case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case',
      error: error.message
    });
  }
};

/**
 * Update an existing case
 */
export const updateCalculation = async (req, res) => {
  try {
    const { reference } = req.params;
    const { 
      userAccessLevel,
      calculationData, 
      results,
      bestSummary 
    } = req.body;

    console.log('🔄 Updating case:', reference);

    // Get existing case
    const existingCase = await getCaseByReference(reference);
    
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Parse all numeric fields (same as create)
    const updateData = {
      userAccessLevel: userAccessLevel || existingCase.user_access_level,
      property_value: parseNumeric(calculationData.propertyValue),
      monthly_rent: parseNumeric(calculationData.monthlyRent),
      property_type: calculationData.propertyType,
      product_type: calculationData.productType,
      product_group: calculationData.productGroup,
      tier: calculationData.tier,
      is_retention: calculationData.isRetention === 'Yes',
      retention_ltv: calculationData.retentionLtv ? parseInt(calculationData.retentionLtv) : null,
      loan_type_required: calculationData.loanTypeRequired,
      specific_net_loan: parseNumeric(calculationData.specificNetLoan),
      specific_gross_loan: parseNumeric(calculationData.specificGrossLoan),
      specific_ltv: parseNumeric(calculationData.specificLTV),
      proc_fee_pct: parseNumeric(calculationData.procFeePct),
      broker_fee_pct: parseNumeric(calculationData.brokerFeePct),
      broker_fee_flat: parseNumeric(calculationData.brokerFeeFlat),
      calculation_data: calculationData,
      best_gross_loan: bestSummary?.gross ? parseNumeric(bestSummary.gross) : null,
      best_net_loan: bestSummary?.net ? parseNumeric(bestSummary.net) : null,
      best_fee_column: bestSummary?.colKey ? parseNumeric(bestSummary.colKey) : null
    };

    console.log('📋 Update data:', updateData);

    // Update the case
    const { data: updatedCase, error: updateError } = await supabase
      .from('cases')
      .update(updateData)
      .eq('id', existingCase.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating case:', updateError);
      throw updateError;
    }

    console.log('✅ Case updated:', reference);

    // Delete old results
    const { error: deleteError } = await supabase
      .from('case_results')
      .delete()
      .eq('case_id', existingCase.id);

    if (deleteError) {
      console.error('Error deleting old results:', deleteError);
    }

    // Save new results if provided
    if (results && results.length > 0) {
      const formattedResults = results.map(r => ({
        case_id: existingCase.id,
        fee_column: parseNumeric(r.colKey),
        gross_loan: parseNumeric(r.gross),
        net_loan: parseNumeric(r.net),
        ltv_percentage: r.ltv ? parseNumeric(r.ltv) * 100 : null,
        icr: parseNumeric(r.icr),
        full_rate: parseNumeric(r.actualRateUsed),
        pay_rate: r.payRateText,
        rolled_months: r.rolledMonths ? parseInt(r.rolledMonths) : null,
        deferred_rate: parseNumeric(r.deferredCapPct),
        product_fee: parseNumeric(r.feeAmt),
        rolled_interest: parseNumeric(r.rolled),
        deferred_interest: parseNumeric(r.deferred),
        direct_debit: parseNumeric(r.directDebit)
      }));

      console.log('💾 Saving updated results:', formattedResults.length);
      await saveCaseResults(existingCase.id, formattedResults);
      console.log('✅ Results updated');
    }

    res.json({
      success: true,
      message: 'Calculation updated successfully',
      caseReference: reference
    });
  } catch (error) {
    console.error('❌ Error updating calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update calculation',
      error: error.message
    });
  }
};