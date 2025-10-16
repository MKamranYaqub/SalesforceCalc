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