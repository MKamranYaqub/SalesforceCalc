import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SaveCalculationButton = ({ 
  calculationData, 
  allColumnData, 
  bestSummary,
  userAccessLevel,
  criteria 
}) => {
  const [saving, setSaving] = useState(false);
  const [savedReference, setSavedReference] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    console.log('🔵 Save button clicked');
    setSaving(true);
    setError(null);

    try {
      // Helper function to extract numeric value from percentage strings
      const parseNumeric = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          // Remove % and any other non-numeric characters except decimal point
          const cleaned = value.replace(/[^0-9.-]/g, '');
          return cleaned ? parseFloat(cleaned) : null;
        }
        return value;
      };

      // Prepare the data to send
      const dataToSend = {
        userAccessLevel: userAccessLevel || 'web_customer',
        calculationData: {
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
          criteria: criteria || {}
        },
        results: allColumnData.map(data => ({
          colKey: parseNumeric(data.colKey),
          gross: data.gross,
          net: data.net,
          ltv: data.ltv,
          icr: data.icr,
          actualRateUsed: data.actualRateUsed,
          payRateText: data.payRateText,
          rolledMonths: data.rolledMonths,
          deferredCapPct: data.deferredCapPct,
          feeAmt: data.feeAmt,
          rolled: data.rolled,
          deferred: data.deferred,
          directDebit: data.directDebit,
          productName: data.productName,
          fullRateText: data.fullRateText
        })),
        bestSummary: bestSummary ? {
          gross: bestSummary.gross,
          net: bestSummary.net,
          colKey: parseNumeric(bestSummary.colKey)
        } : null
      };

      console.log('📋 Cleaned data:', dataToSend);

      console.log('📤 Sending data to backend:', dataToSend);

      const response = await fetch('http://localhost:3001/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('📥 Response status:', response.status);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success) {
        setSavedReference(result.caseReference);
        console.log('✅ Case saved successfully:', result.caseReference);
      } else {
        throw new Error(result.message || 'Failed to save calculation');
      }
    } catch (err) {
      console.error('❌ Error saving calculation:', err);
      setError(err.message);
      
      // Show user-friendly error
      alert(`Error saving calculation: ${err.message}\n\nPlease check:\n1. Backend is running on port 3001\n2. Check browser console for details`);
    } finally {
      setSaving(false);
    }
  };

  // Success state - show reference number
  if (savedReference) {
    return (
      <div style={{
        gridColumn: "1 / -1",
        padding: "24px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "2px solid #86efac",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)"
      }}>
        <div style={{ 
          fontSize: "48px", 
          marginBottom: "12px",
          animation: "bounce 1s ease-in-out"
        }}>
          ✅
        </div>
        
        <div style={{ 
          fontSize: "20px", 
          fontWeight: 700, 
          color: "#166534", 
          marginBottom: "12px" 
        }}>
          Calculation Saved Successfully!
        </div>
        
        <div style={{ 
          fontSize: "32px", 
          fontWeight: 800, 
          color: "#15803d", 
          marginBottom: "8px",
          padding: "12px 20px",
          background: "white",
          borderRadius: "8px",
          display: "inline-block",
          letterSpacing: "2px"
        }}>
          {savedReference}
        </div>
        
        <div style={{ 
          fontSize: "14px", 
          color: "#166534",
          marginBottom: "16px"
        }}>
          Save this reference number to access your calculation later
        </div>
        
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => {
              navigator.clipboard.writeText(savedReference);
              alert('✅ Reference copied to clipboard!');
            }}
            style={{
              padding: "12px 24px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#15803d"}
            onMouseOut={(e) => e.target.style.background = "#16a34a"}
          >
            📋 Copy Reference
          </button>
          
          <button
            onClick={() => setSavedReference(null)}
            style={{
              padding: "12px 24px",
              background: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#e2e8f0"}
            onMouseOut={(e) => e.target.style.background = "#f1f5f9"}
          >
            Save Another
          </button>
        </div>
        
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        gridColumn: "1 / -1",
        marginBottom: "16px"
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "16px 32px",
            background: saving ? "#64748b" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => !saving && (e.target.style.background = "#15803d")}
          onMouseOut={(e) => !saving && (e.target.style.background = "#16a34a")}
        >
          {saving ? (
            <>
              <span style={{
                width: '20px',
                height: '20px',
                border: '3px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}></span>
              Saving...
            </>
          ) : (
            <>💾 Try Save Again</>
          )}
        </button>
        
        <div style={{
          marginTop: "12px",
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          color: "#991b1b",
          fontSize: "14px"
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
        
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Default state - show save button
  return (
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        gridColumn: "1 / -1",
        padding: "16px 32px",
        background: saving ? "#64748b" : "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 600,
        cursor: saving ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        boxShadow: saving ? "none" : "0 2px 8px rgba(22, 163, 74, 0.3)"
      }}
      onMouseOver={(e) => !saving && (e.target.style.background = "#15803d")}
      onMouseOut={(e) => !saving && (e.target.style.background = "#16a34a")}
    >
      {saving ? (
        <>
          <span style={{
            width: '20px',
            height: '20px',
            border: '3px solid #fff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}></span>
          Saving Calculation...
        </>
      ) : (
        <>💾 Save Calculation</>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

SaveCalculationButton.propTypes = {
  calculationData: PropTypes.object.isRequired,
  allColumnData: PropTypes.array.isRequired,
  bestSummary: PropTypes.object,
  userAccessLevel: PropTypes.string,
  criteria: PropTypes.object
};

SaveCalculationButton.defaultProps = {
  bestSummary: null,
  userAccessLevel: 'web_customer',
  criteria: {}
};