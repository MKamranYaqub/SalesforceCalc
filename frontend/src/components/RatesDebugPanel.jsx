import React, { useState } from 'react';
import { ratesStore, loadRatesFromSupabase } from '../services/ratesService';

export default function RatesDebugPanel() {
  const [snapshot, setSnapshot] = useState(() => ({
    sampleCoreTier: ratesStore.RATES_CORE ? Object.keys(ratesStore.RATES_CORE)[0] : null,
  }));

  const refresh = async () => {
    await loadRatesFromSupabase();
    setSnapshot({
      sampleCoreTier: ratesStore.RATES_CORE ? Object.keys(ratesStore.RATES_CORE)[0] : null,
      // shallow copy of a small sample to avoid huge dumps
      coreSample: ratesStore.RATES_CORE ? Object.keys(ratesStore.RATES_CORE).slice(0, 2) : null,
    });
  };

  return (
    <div style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div>Rates Debug:</div>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: 6 }}>
        <div style={{ fontWeight: 600 }}>{snapshot.sampleCoreTier || 'No core rates'}</div>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>{snapshot.coreSample ? snapshot.coreSample.join(', ') : ''}</div>
      </div>
      <button
        onClick={refresh}
        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
      >
        Refresh Rates
      </button>
    </div>
  );
}
