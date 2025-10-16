import React, { useState } from 'react';

export const CaseLookup = ({ onCaseLoaded }) => {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    if (!reference.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/cases/${reference.trim()}`);
      const result = await response.json();

      if (result.success) {
        onCaseLoaded(result.data);
      } else {
        setError(result.message || 'Case not found');
      }
    } catch (err) {
      console.error('Error loading case:', err);
      setError('Failed to load case. Please check the reference number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      gridColumn: "1 / -1",
      padding: "16px",
      background: "#ffffff",
      border: "1px solid #e2e3e4",
      borderRadius: "8px",
      marginBottom: "16px"
    }}>
      <div style={{ marginBottom: "12px", fontSize: "15px", fontWeight: 700, color: "#334155" }}>
        🔍 Load Saved Calculation
      </div>
      
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="Enter reference (e.g., MFS10001)"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            style={{
              width: "100%",
              height: 40,
              padding: "8px 12px",
              border: error ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}
          />
          {error && (
            <div style={{
              marginTop: 6,
              padding: "6px 8px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 4,
              fontSize: 12,
              color: "#991b1b"
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
        
        <button
          onClick={handleLookup}
          disabled={loading}
          style={{
            height: 40,
            padding: "0 24px",
            background: loading ? "#64748b" : "#008891",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </div>
    </div>
  );
};