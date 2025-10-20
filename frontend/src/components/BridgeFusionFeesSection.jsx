import React from 'react';

/**
 * Fees section for Bridge & Fusion products.  Allows the user to
 * specify arrangement fee %, deferred interest % (Fusion only) and
 * rolled months (for rolled interest).  Additional broker or proc
 * fees could be added here if required.
 */
export function BridgeFusionFeesSection({
  arrangementPct,
  setArrangementPct,
  deferredPct,
  setDeferredPct,
  rolledMonths,
  setRolledMonths,
}) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        marginTop: '16px',
      }}
    >
      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
        Fees (Bridge & Fusion)
      </h4>
      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
        }}
      >
        {/* Arrangement fee */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Arrangement Fee (%)
          </label>
          <input
            type="number"
            value={(arrangementPct * 100).toFixed(2)}
            onChange={(e) => setArrangementPct(parseFloat(e.target.value) / 100)}
            placeholder="e.g. 2"
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
        {/* Deferred interest */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}
          >
            Deferred Interest (%)
            <span style={{ display: 'block', fontSize: '10px', color: '#6b7280' }}>
              (Only applies to Fusion)
            </span>
          </label>
          <input
            type="number"
            value={(deferredPct * 100).toFixed(2)}
            onChange={(e) => setDeferredPct(parseFloat(e.target.value) / 100)}
            placeholder="e.g. 1"
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
        {/* Rolled months */}
        <div>
          <label
            style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Rolled Months
          </label>
          <input
            type="number"
            value={rolledMonths}
            onChange={(e) => setRolledMonths(parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 0"
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