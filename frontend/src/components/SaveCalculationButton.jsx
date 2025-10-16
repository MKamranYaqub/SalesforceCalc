import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SaveCalculationButton = ({ 
  calculationData, 
  allColumnData, 
  bestSummary,
  userAccessLevel 
}) => {
  const [saving, setSaving] = useState(false);
  const [savedReference, setSavedReference] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAccessLevel,
          calculationData,
          results: allColumnData,
          bestSummary
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSavedReference(result.caseReference);
      } else {
        throw new Error(result.message || 'Failed to save calculation');
      }
    } catch (err) {
      console.error('Error saving calculation:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (savedReference) {
    return (
      <div style={{
        gridColumn: "1 / -1",
        padding: "16px",
        background: "#f0fdf4",
        border: "2px solid #86efac",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#166534", marginBottom: "8px" }}>
          ✅ Calculation Saved Successfully!
        </div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#15803d", marginBottom: "8px" }}>
          Reference: {savedReference}
        </div>
        <div style={{ fontSize: "14px", color: "#166534" }}>
          Save this reference number to access your calculation later
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(savedReference);
            alert('Reference copied to clipboard!');
          }}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          📋 Copy Reference
        </button>
      </div>
    );
  }

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
      }}
      onMouseOver={(e) => !saving && (e.target.style.background = "#15803d")}
      onMouseOut={(e) => !saving && (e.target.style.background = "#16a34a")}
    >
      {saving ? (
        <>
          <span style={{
            width: '16px',
            height: '16px',
            border: '2px solid #fff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}></span>
          Saving...
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
  userAccessLevel: PropTypes.string
};