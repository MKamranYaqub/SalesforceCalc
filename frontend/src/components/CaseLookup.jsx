import React, { useState } from 'react';

export const CaseLookup = ({ onCaseLoaded, onNewCalculation }) => {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLookup = async () => {
    console.log('🔍 Looking up case:', reference);
    
    if (!reference.trim()) {
      setError('Please enter a reference number');
      return;
    }

    if (!reference.trim().startsWith('MFS')) {
      setError('Reference must start with MFS (e.g., MFS10001)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = `http://localhost:3001/api/cases/${reference.trim()}`;
      console.log('📤 Fetching from:', url);

      const response = await fetch(url);
      console.log('📥 Response status:', response.status);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (result.success && result.data) {
        console.log('✅ Case found:', result.data);
        console.log('📊 Case details:', {
          reference: result.data.case_reference,
          property_value: result.data.property_value,
          monthly_rent: result.data.monthly_rent,
          product_type: result.data.product_type,
          has_calculation_data: !!result.data.calculation_data
        });
        
        setSuccess(true);
        onCaseLoaded(result.data);
        
        // Clear reference after 2 seconds
        setTimeout(() => {
          setReference('');
          setSuccess(false);
        }, 2000);
      } else {
        throw new Error(result.message || 'Case not found');
      }
    } catch (err) {
      console.error('❌ Error loading case:', err);
      setError(err.message || 'Failed to load case. Please check the reference number.');
      
      // Show detailed error in alert
      alert(`Error loading case: ${err.message}\n\nPlease check:\n1. Backend is running on port 3001\n2. Reference number is correct (e.g., MFS10001)\n3. Check browser console for details`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      gridColumn: "1 / -1",
      padding: "20px",
      background: "#ffffff",
      border: "2px solid #e2e3e4",
      borderRadius: "12px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div style={{ 
        marginBottom: "16px", 
        fontSize: "18px", 
        fontWeight: 700, 
        color: "#334155",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        🔍 Load Saved Calculation
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: "12px", 
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: "1", minWidth: "250px" }}>
          <input
            type="text"
            value={reference}
            onChange={(e) => {
              setReference(e.target.value.toUpperCase());
              setError(null);
              setSuccess(false);
            }}
            placeholder="Enter reference (e.g., MFS10001)"
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleLookup();
              }
            }}
            style={{
              width: "100%",
              height: 48,
              padding: "12px 16px",
              border: error 
                ? "2px solid #ef4444" 
                : success 
                ? "2px solid #10b981"
                : "2px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "1px",
              fontFamily: "monospace",
              transition: "all 0.2s ease",
              outline: "none"
            }}
          />
          
          {error && (
            <div style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              fontSize: 13,
              color: "#991b1b",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 6,
              fontSize: 13,
              color: "#166534",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>✅</span>
              <span>Case loaded successfully!</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLookup}
          disabled={loading || !reference.trim()}
          style={{
            height: 48,
            padding: "0 32px",
            background: loading 
              ? "#64748b" 
              : !reference.trim() 
              ? "#cbd5e1"
              : "#008891",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !reference.trim() ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: !loading && reference.trim() ? "0 2px 8px rgba(0, 136, 145, 0.3)" : "none"
          }}
          onMouseOver={(e) => {
            if (!loading && reference.trim()) {
              e.target.style.background = "#006b73";
            }
          }}
          onMouseOut={(e) => {
            if (!loading && reference.trim()) {
              e.target.style.background = "#008891";
            }
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}></span>
              Loading...
            </>
          ) : (
            'Load Case'
          )}
        </button>
      </div>
      
      <div style={{
        marginTop: 12,
        padding: "10px 12px",
        background: "#f8fafc",
        borderRadius: 6,
        fontSize: 12,
        color: "#64748b",
        border: "1px solid #e2e8f0"
      }}>
        💡 <strong>Tip:</strong> Reference numbers start with "MFS" followed by numbers (e.g., MFS10001)
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CaseLookup;