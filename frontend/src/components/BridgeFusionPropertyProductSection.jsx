import React from 'react';

/**
 * Property & Product section for Bridge & Fusion products.  Displays
 * input fields for property value, gross loan, property type and
 * sub‑product, as well as optional rent and top slicing for Fusion.
 * The component accepts all relevant state and setter functions as
 * props (usually provided by useBridgeFusionCalculator).
 */
export function BridgeFusionPropertyProductSection({
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
}) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
        Property & Product (Bridge & Fusion)
      </h4>
      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))',
        }}
      >
        {/* Property Value */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Property Value (£)
          </label>
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            placeholder="e.g. 500000"
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          />
        </div>
        {/* Gross Loan */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Gross Loan (£)
          </label>
          <input
            type="number"
            value={grossLoan}
            onChange={(e) => setGrossLoan(e.target.value)}
            placeholder="e.g. 300000"
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          />
        </div>
        {/* Property Type */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          >
            <option>Residential</option>
            <option>Semi-Commercial</option>
            <option>Full Commercial</option>
          </select>
        </div>
        {/* Sub-Product */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Sub‑Product
          </label>
          <select
            value={subProduct}
            onChange={(e) => setSubProduct(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          >
            {subProductOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {/* Monthly Rent */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}
          >
            Monthly Rent (£)
            <span style={{ display: 'block', fontSize: '10px', color: '#6b7280' }}>
              (Only used for Fusion)
            </span>
          </label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="e.g. 2000"
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          />
        </div>
        {/* Top Slicing */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
          <input
            type="checkbox"
            id="topSlicing"
            checked={topSlicing}
            onChange={(e) => setTopSlicing(e.target.checked)}
            style={{ marginRight: 6, height: 16, width: 16 }}
          />
          <label htmlFor="topSlicing" style={{ fontSize: 12 }}>
            Top Slicing?
            <span style={{ display: 'block', fontSize: '10px', color: '#6b7280' }}>
              (Only used for Fusion)
            </span>
          </label>
        </div>
        {/* Base Rate */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Base Rate (BBR) %
          </label>
          <input
            type="number"
            value={bbr}
            onChange={(e) => setBbr(e.target.value)}
            placeholder="e.g. 5.25"
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          />
        </div>
        {/* Override Rate */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Override Rate (% pm)
          </label>
          <input
            type="number"
            value={overrideRate}
            onChange={(e) => setOverrideRate(e.target.value)}
            placeholder="Leave blank to use table"
            style={{
              width: '100%',
              height: 36,
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              background: '#fff',
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );
}