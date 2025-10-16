import { createCase, saveCaseResults, getCaseByReference, updateCase } from '../services/caseService.js';

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

    if (!calculationData) {
      return res.status(400).json({
        success: false,
        message: 'Calculation data is required'
      });
    }

    // Create case
    const caseData = {
      userAccessLevel: userAccessLevel || 'web_customer',
      propertyValue: calculationData.propertyValue,
      monthlyRent: calculationData.monthlyRent,
      propertyType: calculationData.propertyType,
      productType: calculationData.productType,
      productGroup: calculationData.productGroup,
      tier: calculationData.tier,
      isRetention: calculationData.isRetention,
      retentionLtv: calculationData.retentionLtv,
      loanTypeRequired: calculationData.loanTypeRequired,
      specificNetLoan: calculationData.specificNetLoan,
      specificGrossLoan: calculationData.specificGrossLoan,
      specificLTV: calculationData.specificLTV,
      procFeePct: calculationData.procFeePct,
      brokerFeePct: calculationData.brokerFeePct,
      brokerFeeFlat: calculationData.brokerFeeFlat,
      fullCalculationData: calculationData,
      bestGrossLoan: bestSummary?.gross,
      bestNetLoan: bestSummary?.net,
      bestFeeColumn: bestSummary?.colKey
    };

    const newCase = await createCase(caseData);

    // Save results if provided
    if (results && results.length > 0) {
      const formattedResults = results.map(r => ({
        feeColumn: r.colKey,
        grossLoan: r.gross,
        netLoan: r.net,
        ltvPercentage: r.ltv ? r.ltv * 100 : null,
        icr: r.icr,
        fullRate: r.actualRateUsed,
        payRate: r.payRateText,
        rolledMonths: r.rolledMonths,
        deferredRate: r.deferredCapPct,
        productFee: r.feeAmt,
        rolledInterest: r.rolled,
        deferredInterest: r.deferred,
        directDebit: r.directDebit
      }));

      await saveCaseResults(newCase.id, formattedResults);
    }

    res.status(201).json({
      success: true,
      message: 'Calculation saved successfully',
      caseReference: newCase.case_reference,
      caseId: newCase.id
    });
  } catch (error) {
    console.error('Error saving calculation:', error);
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

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    console.error('Error getting case:', error);
    
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
    console.error('Error updating case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case',
      error: error.message
    });
  }
};