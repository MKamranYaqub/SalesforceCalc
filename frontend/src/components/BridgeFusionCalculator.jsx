import React from 'react';
import { useBridgeFusionCalculator } from '../hooks/useBridgeFusionCalculator';

export const BridgeFusionCalculator = () => {
  const {
    selectedProduct,
    setSelectedProduct,
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
    results,
    bestResult,
  } = useBridgeFusionCalculator();

  return (
    <div className="app-container">
      <h2>Bridge & Fusion Calculator</h2>

      {/* Product selector */}
      <div>
        <label>Product:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option>Fusion</option>
          <option>Fixed Bridge</option>
          <option>Variable Bridge</option>
        </select>
      </div>

      {/* Input fields */}
      <div>
        <label>Property Value (£)</label>
        <input
          type="number"
          value={propertyValue}
          onChange={(e) => setPropertyValue(e.target.value)}
        />
      </div>
      <div>
        <label>Gross Loan (£)</label>
        <input
          type="number"
          value={grossLoan}
          onChange={(e) => setGrossLoan(e.target.value)}
        />
      </div>
      <div>
        <label>Property Type</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option>Residential</option>
          <option>Semi-Commercial</option>
          <option>Full Commercial</option>
        </select>
      </div>
      <div>
        <label>Sub-Product</label>
        <select
          value={subProduct}
          onChange={(e) => setSubProduct(e.target.value)}
        >
          {subProductOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Fusion-specific fields */}
      {selectedProduct === 'Fusion' && (
        <>
          <div>
            <label>Monthly Rent (£)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>
          <div>
            <label>Top Slicing?</label>
            <input
              type="checkbox"
              checked={topSlicing}
              onChange={(e) => setTopSlicing(e.target.checked)}
            />
          </div>
        </>
      )}

      {/* Rate overrides & BBR */}
      <div>
        <label>Base Rate (BBR) %</label>
        <input
          type="number"
          value={bbr}
          onChange={(e) => setBbr(e.target.value)}
        />
      </div>
      <div>
        <label>Override Rate (% pm)</label>
        <input
          type="number"
          value={overrideRate}
          onChange={(e) => setOverrideRate(e.target.value)}
          placeholder="Leave blank to use table"
        />
      </div>

      {/* Results */}
      {results && results.length > 0 && (
        <>
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                <th>LTV</th>
                <th>Net Loan</th>
                <th>Gross Loan</th>
                <th>Rate</th>
                <th>Monthly Payment</th>
                {selectedProduct === 'Fusion' && <th>ICR</th>}
                {selectedProduct === 'Fusion' && <th>Tier</th>}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.ltv}>
                  <td>{r.ltv}%</td>
                  <td>£{(r.netLoanGBP || 0).toLocaleString()}</td>
                  <td>£{(r.gross || 0).toLocaleString()}</td>
                  <td>{r.fullRateText}</td>
                  <td>£{(r.monthlyPaymentGBP || 0).toLocaleString()}</td>
                  {selectedProduct === 'Fusion' && (
                    <>
                      <td>
                        {r.icr
                          ? `${r.icr.toFixed(2)}x (${(r.icr * 100).toFixed(0)}%)`
                          : 'N/A'}
                      </td>
                      <td>{r.tier}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {bestResult && (
            <div>
              <strong>Best Option:</strong> {bestResult.ltv}% LTV –
              Net Loan £{bestResult.netLoanGBP.toLocaleString()}
            </div>
          )}
        </>
      )}
    </div>
  );
};
