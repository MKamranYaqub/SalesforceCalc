import React from 'react';

/**
 * Output section for Bridge & Fusion calculations.  Displays the best
 * option and a table of results for each LTV band.  The layout
 * mirrors the BTL summary matrix but uses bridge-specific fields.
 */
export function BridgeFusionOutputSection({ results, bestResults }) {
  if (!results || results.length === 0) return null;
  // Determine the product names
  const products = ['Fusion', 'Variable Bridge', 'Fixed Bridge'];
  // If bestResults is not provided, derive best results by highest net loan
  const best = bestResults || {};
  return (
    <div style={{ marginTop: '16px' }}>
      {/* Render each product as its own card stacked vertically */}
      {products.map((product) => {
        // Derive the best result for this product
        const bestForProduct = best[product];
        // Gather per-LTV rows for this product
        const rows = results.map((r) => ({ ltv: r.ltv, ...r[product] }));
        return (
          <div
            key={product}
            style={{
              background: '#fff',
              padding: '24px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <h5 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              {product}
            </h5>
            {bestForProduct && (
              <p
                style={{ fontSize: '14px', color: '#0f172a', marginBottom: '12px' }}
              >
                <strong>Best Option:</strong> {bestForProduct.ltv}% LTV – Net Loan £
                {bestForProduct.netLoanGBP.toLocaleString()}
              </p>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}
              >
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>LTV</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>Net Loan</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>Gross Loan</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>Rate</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>Monthly</th>
                    {product === 'Fusion' && (
                      <>
                        <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>ICR</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>Tier</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.ltv}>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                        {row.ltv}%
                      </td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                        £{row.netLoanGBP.toLocaleString()}
                      </td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                        £{row.gross.toLocaleString()}
                      </td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                        {row.fullRateText}
                      </td>
                      <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                        £{row.monthlyPaymentGBP.toLocaleString()}
                      </td>
                      {product === 'Fusion' && (
                        <>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                            {row.icr ? `${row.icr.toFixed(2)}x` : 'N/A'}
                          </td>
                          <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                            {row.tier || '—'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}