/**
 * Fees section for Bridge & Fusion products.  Allows the user to
 * specify arrangement fee %, deferred interest % (Fusion only) and
 * rolled months (for rolled interest).  Additional broker or proc
 * fees could be added here if required.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from './UI/Collapsible';
import { ErrorMessage } from './UI/ErrorMessage';
import { useValidation } from '../hooks/useValidation';

export function BridgeFusionFeesSection({
  isOpen = false,
  onToggle = () => {},
  arrangementPct,
  setArrangementPct,
  deferredPct,
  setDeferredPct,
  rolledMonths,
  setRolledMonths,
}) {
  const { errors, validateField } = useValidation();

  const handleArrangementPctChange = (value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setArrangementPct(numValue / 100);
      validateField('arrangementPct', value);
    } else {
      setArrangementPct(0);
    }
  };

  const handleDeferredPctChange = (value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setDeferredPct(numValue / 100);
      validateField('deferredPct', value);
    } else {
      setDeferredPct(0);
    }
  };

  const handleRolledMonthsChange = (value) => {
    const numValue = parseInt(value, 10);
    setRolledMonths(!isNaN(numValue) ? numValue : 0);
    if (value) validateField('rolledMonths', value);
  };

  return (
    <Collapsible
      title="💰 Fees (Bridge & Fusion)"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
        }}
      >
        {/* Arrangement Fee */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Arrangement Fee (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={(arrangementPct * 100).toFixed(2)}
            onChange={(e) => handleArrangementPctChange(e.target.value)}
            onBlur={(e) => validateField('arrangementPct', e.target.value)}
            placeholder="e.g. 2.00"
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: errors.arrangementPct ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
          <ErrorMessage error={errors.arrangementPct} />
        </div>

        {/* Deferred Interest */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Deferred Interest (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={(deferredPct * 100).toFixed(2)}
            onChange={(e) => handleDeferredPctChange(e.target.value)}
            onBlur={(e) => validateField('deferredPct', e.target.value)}
            placeholder="e.g. 1.00"
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: errors.deferredPct ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
            (Only applies to Fusion)
          </div>
          <ErrorMessage error={errors.deferredPct} />
        </div>

        {/* Rolled Months */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Rolled Months
          </label>
          <input
            type="number"
            step="1"
            value={rolledMonths}
            onChange={(e) => handleRolledMonthsChange(e.target.value)}
            onBlur={(e) => validateField('rolledMonths', e.target.value)}
            placeholder="e.g. 0"
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: errors.rolledMonths ? "1px solid #ef4444" : "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
          <ErrorMessage error={errors.rolledMonths} />
        </div>
      </div>
    </Collapsible>
  );
}

BridgeFusionFeesSection.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  arrangementPct: PropTypes.number.isRequired,
  setArrangementPct: PropTypes.func.isRequired,
  deferredPct: PropTypes.number.isRequired,
  setDeferredPct: PropTypes.func.isRequired,
  rolledMonths: PropTypes.number.isRequired,
  setRolledMonths: PropTypes.func.isRequired,
};