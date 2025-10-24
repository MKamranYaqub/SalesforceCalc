/**
 * Property & Product section for Bridge & Fusion products.  Displays
 * input fields for property value, gross loan, property type and
 * sub‑product, as well as optional rent and top slicing for Fusion.
 * The component accepts all relevant state and setter functions as
 * props (usually provided by useBridgeFusionCalculator).
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from './UI/Collapsible';
import { CurrencyInput } from './UI/CurrencyInput';
import { ErrorMessage } from './UI/ErrorMessage';
import { useValidation } from '../hooks/useValidation';

export function BridgeFusionPropertyProductSection({
  isOpen = true,
  onToggle = () => {},
  propertyValue,
  setPropertyValue,
  grossLoan,
  setGrossLoan,
  propertyType,
  setPropertyType,
  subProduct,
  setSubProduct,
  subProductOptions,
  rent,
  setRent,
  topSlicing,
  setTopSlicing,
  bbr,
  setBbr,
  overrideRate,
  setOverrideRate,
  calculatorId,
}) {
  const { errors, validateField } = useValidation();

  const headingLabel = (() => {
    if (calculatorId === 'bridge') return '🏦 Property & Product (Bridge)';
    if (calculatorId === 'fusion') return '🏦 Property & Product (Fusion)';
    return '🏦 Property & Product (Bridge & Fusion)';
  })();
  const showFusionSpecificFields = calculatorId !== 'bridge';

  const handlePropertyValueChange = (value) => {
    setPropertyValue(value);
    if (value) validateField('propertyValue', value);
  };

  const handleGrossLoanChange = (value) => {
    setGrossLoan(value);
    if (value) validateField('grossLoan', value);
  };

  const handleRentChange = (value) => {
    setRent(value);
    if (value) validateField('monthlyRent', value);
  };

  return (
    <Collapsible title={headingLabel} isOpen={isOpen} onToggle={onToggle}>
      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
        }}
      >
        {/* Property Value with Currency Formatting */}
        <div>
          <CurrencyInput
            label="Property Value"
            value={propertyValue}
            onChange={handlePropertyValueChange}
            onBlur={(value) => validateField('propertyValue', value)}
            placeholder="e.g. 500,000"
            error={!!errors.propertyValue}
            required
            min={50000}
            max={10000000}
          />
          <ErrorMessage error={errors.propertyValue} />
        </div>

        {/* Gross Loan with Currency Formatting */}
        <div>
          <CurrencyInput
            label="Gross Loan"
            value={grossLoan}
            onChange={handleGrossLoanChange}
            onBlur={(value) => validateField('grossLoan', value)}
            placeholder="e.g. 300,000"
            error={!!errors.grossLoan}
            required
            min={50000}
            max={10000000}
          />
          <ErrorMessage error={errors.grossLoan} />
        </div>
        {/* Property Type */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          >
            <option>Residential</option>
            <option>Semi-Commercial</option>
            <option>Full Commercial</option>
          </select>
        </div>

        {/* Sub-Product */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Sub‑Product
          </label>
          <select
            value={subProduct}
            onChange={(e) => setSubProduct(e.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          >
            {subProductOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Monthly Rent with Currency Formatting */}
        {showFusionSpecificFields && (
          <>
            <div>
              <CurrencyInput
                label="Monthly Rent"
                value={rent}
                onChange={handleRentChange}
                onBlur={(value) => validateField('monthlyRent', value)}
                placeholder="e.g. 2,000"
                error={!!errors.monthlyRent}
                min={100}
                max={50000}
              />
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
                (Only used for Fusion)
              </div>
              <ErrorMessage error={errors.monthlyRent} />
            </div>
            {/* Top Slicing */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
              <input
                type="checkbox"
                id="topSlicing"
                checked={topSlicing}
                onChange={(e) => setTopSlicing(e.target.checked)}
                style={{ marginRight: 6, height: 16, width: 16 }}
              />
              <label htmlFor="topSlicing" style={{ fontSize: 12, color: "#334155" }}>
                Top Slicing?
                <span style={{ display: "block", fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                  (Only used for Fusion)
                </span>
              </label>
            </div>
          </>
        )}

        {/* Base Rate */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Base Rate (BBR) %
          </label>
          <input
            type="number"
            step="0.01"
            value={bbr}
            onChange={(e) => setBbr(e.target.value)}
            placeholder="e.g. 5.25"
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
        </div>

        {/* Override Rate */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
            Override Rate (% pm)
          </label>
          <input
            type="number"
            step="0.01"
            value={overrideRate}
            onChange={(e) => setOverrideRate(e.target.value)}
            placeholder="Leave blank to use table"
            style={{
              width: "100%",
              height: 36,
              padding: "6px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              background: "#fff",
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </Collapsible>
  );
}

BridgeFusionPropertyProductSection.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  propertyValue: PropTypes.string.isRequired,
  setPropertyValue: PropTypes.func.isRequired,
  grossLoan: PropTypes.string.isRequired,
  setGrossLoan: PropTypes.func.isRequired,
  propertyType: PropTypes.string.isRequired,
  setPropertyType: PropTypes.func.isRequired,
  subProduct: PropTypes.string.isRequired,
  setSubProduct: PropTypes.func.isRequired,
  subProductOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  rent: PropTypes.string.isRequired,
  setRent: PropTypes.func.isRequired,
  topSlicing: PropTypes.bool.isRequired,
  setTopSlicing: PropTypes.func.isRequired,
  bbr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setBbr: PropTypes.func.isRequired,
  overrideRate: PropTypes.string.isRequired,
  setOverrideRate: PropTypes.func.isRequired,
  calculatorId: PropTypes.string,
};

BridgeFusionPropertyProductSection.defaultProps = {
  calculatorId: undefined,
};