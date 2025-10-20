/**
 * Main application component with BTL, Bridge & Fusion calculators
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useProductSelection } from './hooks/useProductSelection';
import { useCriteriaManagement } from './hooks/useCriteriaManagement';
import { useLoanInputs } from './hooks/useLoanInputs';
import { useFeeManagement } from './hooks/useFeeManagement';
import { useDynamicCriteria } from './hooks/useDynamicCriteria';
import { ProductSetup } from './components/ProductSetup';
import { CriteriaSection } from './components/CriteriaSection';
import { PropertyProductSection } from './components/PropertyProductSection';
import { FeesSection } from './components/FeesSection';
import { SummarySection } from './components/SummarySection';
import { MatrixSection } from './components/MatrixSection';
import { BasicGrossSection } from './components/BasicGrossSection';
import { ProductGroupToggle } from './components/ProductGroupToggle';
import { EmailResultsModal } from './components/EmailResultsModal';
import { SaveCalculationButton } from './components/SaveCalculationButton';
import { CaseLookup } from './components/CaseLookup';
import { BridgeFusionCalculator } from './components/BridgeFusionCalculator';
import { parseNumber, formatCurrency } from './utils/formatters';
import { selectRateSource, getFeeColumns, getMaxLTV } from './utils/rateSelectors';
import { computeColumnData } from './utils/calculationEngine';
import { LOAN_LIMITS } from './config/loanLimits';
import {
  PRODUCT_TYPES_LIST,
  PRODUCT_GROUPS,
  LOAN_TYPES,
  PROPERTY_TYPES,
} from './config/constants';
import './styles/styles.css';

function App() {
  // ============================================
  // CALCULATOR NAVIGATION STATE
  // ============================================
  // NOTE: We no longer use a separate activeCalculator state. Instead, we
  // determine which UI to render based on mainProductType directly. This
  // ensures that selecting Bridge or Fusion updates the criteria and inputs
  // without navigating away to a completely different calculator view.
  const [activeCalculator, setActiveCalculator] = useState('btl');

  // ============================================
  // 1. ALL HOOKS MUST BE CALLED FIRST (before any conditional returns)
  // ============================================

  // Load criteria from Supabase
  const {
    criteriaConfig,
    coreCriteriaConfig,
    loading: criteriaLoading,
    error: criteriaError,
    reload: reloadCriteria,
  } = useDynamicCriteria();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userAccessLevel] = useState('web_customer');
  const [loadedCaseReference, setLoadedCaseReference] = useState(null);

  const productSelection = useProductSelection();
  const {
    mainProductType,
    setMainProductType,
    propertyType,
    setPropertyType,
    isRetention,
    setIsRetention,
    retentionLtv,
    setRetentionLtv,
    productType,
    setProductType,
    productGroup,
    setProductGroup,
  } = productSelection;

  // Pass the main product type to criteria management.  The hook will
  // internally treat both "Bridge" and "Fusion" as aliases of the
  // combined Bridge & Fusion product for criteria selection.
  const criteriaManagement = useCriteriaManagement(
    propertyType,
    mainProductType,
    criteriaConfig,
    coreCriteriaConfig,
  );
  const {
    criteria,
    setCriteria,
    tier,
    getCurrentCriteria,
    isWithinCoreCriteria,
    initializeCriteriaState,
  } = criteriaManagement;

  const loanInputs = useLoanInputs();
  const {
    propertyValue,
    setPropertyValue,
    monthlyRent,
    setMonthlyRent,
    specificNetLoan,
    setSpecificNetLoan,
    specificGrossLoan,
    setSpecificGrossLoan,
    loanTypeRequired,
    setLoanTypeRequired,
    specificLTV,
    setSpecificLTV,
  } = loanInputs;

  const feeManagement = useFeeManagement(isRetention);
  const {
    procFeePctInput,
    setProcFeePctInput,
    brokerFeePct,
    setBrokerFeePct,
    brokerFeeFlat,
    setBrokerFeeFlat,
    rateOverrides,
    feeOverrides,
    manualSettings,
    tempRateInput,
    tempFeeInput,
    effectiveProcFeePct,
    handleRateInputChange,
    handleRateInputBlur,
    handleFeeInputChange,
    handleFeeInputBlur,
    handleResetFeeOverride,
    handleRolledChange,
    handleDeferredChange,
    handleResetManual,
    handleResetRateOverride,
  } = feeManagement;

  const [openSections, setOpenSections] = useState({
    criteria: false,
    property: true,
    fees: false,
  });

  // All useMemo and useEffect hooks
  const limits = useMemo(() => {
    return LOAN_LIMITS[propertyType] || LOAN_LIMITS.Residential;
  }, [propertyType]);

  const productTypesList = useMemo(() => {
    return PRODUCT_TYPES_LIST[propertyType] || PRODUCT_TYPES_LIST.Residential;
  }, [propertyType]);

  const selected = useMemo(() => {
    return selectRateSource({
      propertyType,
      productGroup,
      isRetention,
      retentionLtv,
      tier,
      productType,
    });
  }, [propertyType, productGroup, isRetention, retentionLtv, tier, productType]);

  const feeColumns = useMemo(() => {
    return getFeeColumns({
      productGroup,
      isRetention,
      retentionLtv,
      propertyType,
    });
  }, [productGroup, isRetention, retentionLtv, propertyType]);

  const canShowMatrix = useMemo(() => {
    const mr = parseNumber(monthlyRent);
    const pv = parseNumber(propertyValue);
    const sn = parseNumber(specificNetLoan);
    const sg = parseNumber(specificGrossLoan);
    if (!mr) return false;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_NET) return !!sn && !!pv;
    if (loanTypeRequired === LOAN_TYPES.MAX_LTV) return !!pv;
    if (loanTypeRequired === LOAN_TYPES.SPECIFIC_GROSS) return !!pv && !!sg;
    return !!pv;
  }, [monthlyRent, propertyValue, specificNetLoan, specificGrossLoan, loanTypeRequired]);

  const allColumnData = useMemo(() => {
    if (!canShowMatrix) return [];
    const pv = parseNumber(propertyValue);
    return feeColumns
      .map((colKey) => {
        const manual = manualSettings[colKey];
        const overriddenRate = rateOverrides[colKey];
        const data = computeColumnData({
          colKey,
          manualRolled: manual?.rolledMonths,
          manualDeferred: manual?.deferredPct,
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
        });
        if (!data) return null;
        const netLtv = pv ? data.net / pv : null;
        return { colKey, netLtv, ...data };
      })
      .filter(Boolean);
  }, [
    canShowMatrix,
    feeColumns,
    manualSettings,
    rateOverrides,
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
  ]);

  const maxLTV = useMemo(() => {
    return getMaxLTV({
      propertyType,
      isRetention,
      retentionLtv,
      propertyAnswers: criteria,
      tier,
      productType,
    });
  }, [propertyType, isRetention, retentionLtv, criteria, tier, productType]);

  const bestSummary = useMemo(() => {
    if (!canShowMatrix || !allColumnData.length) return null;
    const pv = parseNumber(propertyValue) || 0;
    let best = null;
    for (const d of allColumnData) {
      if (!best || d.net > best.net) {
        best = {
          colKey: d.colKey,
          gross: d.gross,
          grossStr: formatCurrency(d.gross),
          grossLtvPct: pv ? Math.round((d.gross / pv) * 100) : 0,
          net: d.net,
          netStr: formatCurrency(d.net),
          netLtvPct: pv ? Math.round((d.net / pv) * 100) : 0,
        };
      }
    }
    return best;
  }, [allColumnData, canShowMatrix, propertyValue]);

  const deferredCap = useMemo(() => {
    return selected?.isMargin ? limits.MAX_DEFERRED_TRACKER : limits.MAX_DEFERRED_FIX;
  }, [selected, limits]);

  const calculationData = useMemo(
    () => ({
      propertyValue: parseNumber(propertyValue),
      monthlyRent: parseNumber(monthlyRent),
      propertyType,
      productType,
      productGroup,
      tier,
      isRetention,
      retentionLtv,
      loanTypeRequired,
      specificNetLoan: parseNumber(specificNetLoan),
      specificGrossLoan: parseNumber(specificGrossLoan),
      specificLTV,
      procFeePct: effectiveProcFeePct,
      brokerFeePct: brokerFeePct ? parseNumber(brokerFeePct) : null,
      brokerFeeFlat: brokerFeeFlat ? parseNumber(brokerFeeFlat) : null,
    }),
    [
      propertyValue,
      monthlyRent,
      propertyType,
      productType,
      productGroup,
      tier,
      isRetention,
      retentionLtv,
      loanTypeRequired,
      specificNetLoan,
      specificGrossLoan,
      specificLTV,
      effectiveProcFeePct,
      brokerFeePct,
      brokerFeeFlat,
    ],
  );

  // Reset criteria when property type changes
  useEffect(() => {
    if (criteriaConfig) {
      setCriteria(initializeCriteriaState(getCurrentCriteria()));
    }
  }, [propertyType, getCurrentCriteria, initializeCriteriaState, setCriteria, criteriaConfig]);

  // Revert to Specialist if Core becomes ineligible
  useEffect(() => {
    if (productGroup === PRODUCT_GROUPS.CORE && !isWithinCoreCriteria) {
      setProductGroup(PRODUCT_GROUPS.SPECIALIST);
    }
  }, [isWithinCoreCriteria, productGroup, setProductGroup]);

  // We no longer switch calculators based on main product type. Instead, we
  // conditionally render the Bridge & Fusion inputs below based on
  // mainProductType directly in the JSX.

  // ============================================
  // 2. NOW CONDITIONAL RENDERING (after all hooks)
  // ============================================

  // Show loading state while criteria loads
  if (criteriaLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
          padding: '20px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            ⏳
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '8px',
            }}
          >
            Loading Configuration...
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#64748b',
            }}
          >
            Fetching criteria and rates from database
          </div>
          <style>{`
             @keyframes pulse {
               0%, 100% { opacity: 1; transform: scale(1); }
               50% { opacity: 0.5; transform: scale(0.95); }
             }
           `}</style>
        </div>
      </div>
    );
  }

  // Show error state
  if (criteriaError) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
          padding: '20px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            background: '#fff',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '12px',
            }}
          >
            Failed to Load Configuration
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '8px',
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
            }}
          >
            <strong>Error:</strong> {criteriaError}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '20px',
            }}
          >
            Please check that:
            <ul
              style={{
                textAlign: 'left',
                marginTop: '8px',
                paddingLeft: '20px',
              }}
            >
              <li>Backend server is running on port 3001</li>
              <li>Supabase credentials are configured correctly</li>
              <li>Database tables have been created</li>
              <li>Migration script has been run</li>
            </ul>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#008891',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = '#006b73')}
              onMouseOut={(e) => (e.target.style.background = '#008891')}
            >
              🔄 Reload Page
            </button>
            <button
              onClick={reloadCriteria}
              style={{
                padding: '12px 24px',
                background: '#f1f5f9',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.background = '#e2e8f0')}
              onMouseOut={(e) => (e.target.style.background = '#f1f5f9')}
            >
              🔁 Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 3. EVENT HANDLERS
  // ============================================

  // Handle case loaded from lookup
  const handleCaseLoaded = (caseData) => {
    console.log('📥 Loading case data:', caseData);

    setLoadedCaseReference(caseData.case_reference);

    const calc = caseData.calculation_data || caseData;

    if (calc.propertyType || caseData.property_type) {
      setPropertyType(calc.propertyType || caseData.property_type);
    }

    if (calc.propertyValue || caseData.property_value) {
      setPropertyValue(String(calc.propertyValue || caseData.property_value));
    }

    if (calc.monthlyRent || caseData.monthly_rent) {
      setMonthlyRent(String(calc.monthlyRent || caseData.monthly_rent));
    }

    if (calc.productType || caseData.product_type) {
      setProductType(calc.productType || caseData.product_type);
    }

    if (calc.productGroup || caseData.product_group) {
      setProductGroup(calc.productGroup || caseData.product_group);
    }

    const isRet =
      calc.isRetention === 'Yes' ||
      calc.isRetention === true ||
      caseData.is_retention === true;
    setIsRetention(isRet ? 'Yes' : 'No');

    if (calc.retentionLtv || caseData.retention_ltv) {
      setRetentionLtv(String(calc.retentionLtv || caseData.retention_ltv));
    }

    if (calc.loanTypeRequired || caseData.loan_type_required) {
      setLoanTypeRequired(calc.loanTypeRequired || caseData.loan_type_required);
    }

    if (calc.specificNetLoan || caseData.specific_net_loan) {
      const netLoan = calc.specificNetLoan || caseData.specific_net_loan;
      if (netLoan && netLoan !== 0) {
        setSpecificNetLoan(String(netLoan));
      }
    }

    if (calc.specificGrossLoan || caseData.specific_gross_loan) {
      const grossLoan = calc.specificGrossLoan || caseData.specific_gross_loan;
      if (grossLoan && grossLoan !== 0) {
        setSpecificGrossLoan(String(grossLoan));
      }
    }

    if (calc.specificLTV || caseData.specific_ltv) {
      const ltv = calc.specificLTV || caseData.specific_ltv;
      if (ltv && ltv !== 0) {
        setSpecificLTV(Number(ltv));
      }
    }

    if (calc.procFeePct || caseData.proc_fee_pct) {
      setProcFeePctInput(String(calc.procFeePct || caseData.proc_fee_pct));
    }

    if (calc.brokerFeePct || caseData.broker_fee_pct) {
      setBrokerFeePct(String(calc.brokerFeePct || caseData.broker_fee_pct));
    }

    if (calc.brokerFeeFlat || caseData.broker_fee_flat) {
      setBrokerFeeFlat(String(calc.brokerFeeFlat || caseData.broker_fee_flat));
    }

    if (calc.criteria) {
      console.log('📋 Loading criteria:', calc.criteria);
      setCriteria(calc.criteria);
    }

    console.log('✅ Case data loaded into form');

    setTimeout(() => {
      alert(
        `✅ Case ${caseData.case_reference} loaded successfully!\n\n` +
          `Property: £${(calc.propertyValue || caseData.property_value)?.toLocaleString()}\n` +
          `Rent: £${(calc.monthlyRent || caseData.monthly_rent)?.toLocaleString()}\n` +
          `Product: ${calc.productType || caseData.product_type}\n` +
          `Group: ${calc.productGroup || caseData.product_group}`,
      );
    }, 100);
  };

  // Handle new calculation
  const handleNewCalculation = () => {
    if (window.confirm('Start a new calculation? This will clear the current form.')) {
      setLoadedCaseReference(null);
      setPropertyValue('');
      setMonthlyRent('');
      setSpecificNetLoan('');
      setSpecificGrossLoan('');
      alert('✅ Ready for new calculation');
    }
  };

  // ============================================
  // 4. MAIN RENDER
  // ============================================

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Navigation Header */}
      <header
        style={{
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Header content could go here if needed */}
      </header>

      {/* Calculator Content */}
      <main>
        {/*
          Render the standard BTL calculator when the main product type is BTL.
          For Bridge or Fusion selections, we show the Bridge & Fusion inputs instead.
        */}
        {mainProductType !== 'Bridge' && mainProductType !== 'Fusion' && (
          <div className="app-container">
            {/* Case Lookup Section */}
            <CaseLookup onCaseLoaded={handleCaseLoaded} />

            {/* New Calculation Button */}
            {loadedCaseReference && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '12px',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>📝</span>
                  <span
                    style={{ fontSize: '14px', color: '#7c2d12', fontWeight: 600 }}
                  >
                    Editing: <strong>{loadedCaseReference}</strong>
                  </span>
                </div>
                <button
                  onClick={handleNewCalculation}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#e2e8f0')}
                  onMouseOut={(e) => (e.target.style.background = '#f1f5f9')}
                >
                  ➕ New Calculation
                </button>
              </div>
            )}

            <ProductSetup
              mainProductType={mainProductType}
              setMainProductType={setMainProductType}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              isRetention={isRetention}
              setIsRetention={setIsRetention}
              retentionLtv={retentionLtv}
              setRetentionLtv={setRetentionLtv}
              tier={tier}
            />

            <CriteriaSection
              isOpen={openSections.criteria}
              onToggle={() =>
                setOpenSections((s) => ({ ...s, criteria: !s.criteria }))
              }
              // Provide a safe fallback for currentCriteria.  If
              // getCurrentCriteria returns null or undefined (for example
              // while Supabase criteria are still loading), supply an
              // object with empty question arrays.  This prevents
              // CriteriaSection from attempting to access properties on
              // undefined and throwing an error.
              currentCriteria={
                getCurrentCriteria() || {
                  propertyQuestions: [],
                  applicantQuestions: [],
                }
              }
              // Ensure criteria is never undefined.  Fall back to an empty
              // object so that CriteriaSection always receives a defined
              // prop.  Without this guard, the component may attempt to
              // access properties on undefined during initial render.
              criteria={criteria || {}}
              setCriteria={setCriteria}
            />

            <PropertyProductSection
              isOpen={openSections.property}
              onToggle={() =>
                setOpenSections((s) => ({ ...s, property: !s.property }))
              }
              propertyValue={propertyValue}
              setPropertyValue={setPropertyValue}
              monthlyRent={monthlyRent}
              setMonthlyRent={setMonthlyRent}
              loanTypeRequired={loanTypeRequired}
              setLoanTypeRequired={setLoanTypeRequired}
              specificGrossLoan={specificGrossLoan}
              setSpecificGrossLoan={setSpecificGrossLoan}
              specificNetLoan={specificNetLoan}
              setSpecificNetLoan={setSpecificNetLoan}
              specificLTV={specificLTV}
              setSpecificLTV={setSpecificLTV}
              maxLTV={maxLTV}
              tier={tier}
              productType={productType}
              setProductType={setProductType}
              productTypesList={productTypesList}
            />

            <FeesSection
              isOpen={openSections.fees}
              onToggle={() => setOpenSections((s) => ({ ...s, fees: !s.fees }))}
              procFeePctInput={procFeePctInput}
              setProcFeePctInput={setProcFeePctInput}
              effectiveProcFeePct={effectiveProcFeePct}
              brokerFeePct={brokerFeePct}
              setBrokerFeePct={setBrokerFeePct}
              brokerFeeFlat={brokerFeeFlat}
              setBrokerFeeFlat={setBrokerFeeFlat}
              isRetention={isRetention}
            />

            <SummarySection
              bestSummary={bestSummary}
              loanTypeRequired={loanTypeRequired}
              productType={productType}
              tier={tier}
            />

            {canShowMatrix && propertyType === PROPERTY_TYPES.RESIDENTIAL && (
              <ProductGroupToggle
                productGroup={productGroup}
                setProductGroup={setProductGroup}
                isWithinCoreCriteria={isWithinCoreCriteria}
                tier={tier}
              />
            )}

            {canShowMatrix && (
              <>
                <MatrixSection
                  allColumnData={allColumnData}
                  productGroup={productGroup}
                  propertyType={propertyType}
                  isRetention={isRetention}
                  limits={limits}
                  deferredCap={deferredCap}
                  manualSettings={manualSettings}
                  feeOverrides={feeOverrides}
                  tempRateInput={tempRateInput}
                  tempFeeInput={tempFeeInput}
                  handleRateInputChange={handleRateInputChange}
                  handleRateInputBlur={handleRateInputBlur}
                  handleFeeInputChange={handleFeeInputChange}
                  handleFeeInputBlur={handleFeeInputBlur}
                  handleResetFeeOverride={handleResetFeeOverride}
                  handleRolledChange={handleRolledChange}
                  handleDeferredChange={handleDeferredChange}
                  handleResetManual={handleResetManual}
                  handleResetRateOverride={handleResetRateOverride}
                />

                <BasicGrossSection
                  feeColumns={feeColumns}
                  selected={selected}
                  propertyValue={propertyValue}
                  monthlyRent={monthlyRent}
                  specificNetLoan={specificNetLoan}
                  specificGrossLoan={specificGrossLoan}
                  loanTypeRequired={loanTypeRequired}
                  specificLTV={specificLTV}
                  productType={productType}
                  tier={tier}
                  criteria={criteria}
                  propertyType={propertyType}
                  productGroup={productGroup}
                  isRetention={isRetention}
                  retentionLtv={retentionLtv}
                  feeOverrides={feeOverrides}
                  limits={limits}
                />
              </>
            )}

            {/* Action Buttons */}
            {canShowMatrix && bestSummary && (
              <>
                <SaveCalculationButton
                  calculationData={calculationData}
                  allColumnData={allColumnData}
                  bestSummary={bestSummary}
                  userAccessLevel={userAccessLevel}
                  criteria={criteria}
                  existingCaseReference={loadedCaseReference}
                  onSaved={(savedReference) => {
                    setLoadedCaseReference(savedReference);
                  }}
                />

                <button
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '16px 32px',
                    background: '#008891',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#006b73')}
                  onMouseOut={(e) => (e.target.style.background = '#008891')}
                >
                  📧 Email Results
                </button>
              </>
            )}

            <EmailResultsModal
              isOpen={showEmailModal}
              onClose={() => setShowEmailModal(false)}
              calculationData={calculationData}
              allColumnData={allColumnData}
            />
          </div>
        )}

        {/*
          When Bridge or Fusion is selected the criteria questions are
          dynamically adjusted via useCriteriaManagement.  We no longer
          render a separate BridgeFusionCalculator here to avoid
          navigating away from the main BTL layout.  Instead, the
          Property & Product section should be extended to show inputs
          specific to Bridge & Fusion loans (e.g. gross loan, sub‑product,
          monthly rent).  For now we suppress rendering the standalone
          calculator so that only the existing sections remain visible.
        */}
      </main>
    </div>
  );
}

export default App;