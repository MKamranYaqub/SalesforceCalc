import React, { useEffect, useState } from 'react';

export default function RatesAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [query, setQuery] = useState('');
  const [uniqueLists, setUniqueLists] = useState({ product_groups: [], property_types: [], tiers: [], rate_types: [] });
  const [newRow, setNewRow] = useState({ product_group_id: '', property_type_id: '', tier_id: '', rate_type_id: '', fee_percentage: 0, rate_value: 0, is_active: true, is_retention: false, retention_ltv: null, effective_from: new Date().toISOString().slice(0,10) });

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${API_BASE}/api/rates/list`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed');
      const data = json.data || [];
      setRows(data);

      // build unique lookup lists from returned rows
      const pgMap = {};
      const propMap = {};
      const tierMap = {};
      const rtMap = {};
      data.forEach(r => {
        if (r.product_group) pgMap[r.product_group.id] = r.product_group.name;
        if (r.property_type) propMap[r.property_type.id] = r.property_type.name;
        if (r.tier) tierMap[r.tier.id] = r.tier.name;
        if (r.rate_type) rtMap[r.rate_type.id] = r.rate_type.name;
      });
      setUniqueLists({ product_groups: Object.entries(pgMap).map(([id,name])=>({id,name})), property_types: Object.entries(propMap).map(([id,name])=>({id,name})), tiers: Object.entries(tierMap).map(([id,name])=>({id,name})), rate_types: Object.entries(rtMap).map(([id,name])=>({id,name})) });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const saveRow = async (id, patch) => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${API_BASE}/api/rates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to save');
      // update local
      setRows((rs) => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));
      return true;
    } catch (err) {
      alert('Save failed: ' + (err.message || err));
      return false;
    }
  };

  const deleteRow = async (id) => {
    if (!window.confirm('Delete this rate?')) return;
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${API_BASE}/api/rates/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to delete');
      setRows((rs) => rs.filter(r => r.id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.message || err));
    }
  };

  const handleChange = (id, field, value) => {
    setRows((rs) => rs.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const renderRow = (r) => (
    <tr key={r.id}>
      <td style={{ fontSize:12 }}>{r.id}</td>
      <td style={{ fontSize:12 }}>{r.product_group?.name}</td>
      <td style={{ fontSize:12 }}>{r.property_type?.name}</td>
      <td style={{ fontSize:12 }}>{r.tier?.name}</td>
      <td style={{ fontSize:12 }}>{r.rate_type?.name}</td>
      <td>
        <input type="number" step="0.0001" value={r.rate_value} onChange={(e)=>handleChange(r.id,'rate_value', parseFloat(e.target.value))} style={{width:80}} />
      </td>
      <td>
        <input type="checkbox" checked={!!r.is_active} onChange={(e)=>handleChange(r.id,'is_active', e.target.checked)} />
      </td>
      <td>
        <button onClick={()=>saveRow(r.id, { rate_value: r.rate_value, is_active: r.is_active })}>Save</button>
        <button onClick={()=>deleteRow(r.id)} style={{ marginLeft: 8 }}>Delete</button>
      </td>
    </tr>
  );

  const filteredRows = rows.filter(r => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (r.rate_type?.name || '').toLowerCase().includes(q) || (r.product_group?.name || '').toLowerCase().includes(q) || (r.tier?.name || '').toLowerCase().includes(q) || String(r.fee_percentage || '').includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page-1)*pageSize, page*pageSize);

  const handleAdd = async () => {
    // build payload
    const payload = { ...newRow };
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${API_BASE}/api/rates/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([payload]) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to add');
      // refresh
      await fetchRows();
      alert('Added');
    } catch (err) {
      alert('Add failed: ' + (err.message || err));
    }
  };

  return (
    <div style={{ padding: 12, background:'#fff', border:'1px solid #e5e7eb', borderRadius:8 }}>
      <h3 style={{ marginTop:0 }}>Rates Admin</h3>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <div>
          <input placeholder="Search (type/product/tier/fee)" value={query} onChange={(e)=>{setQuery(e.target.value); setPage(1);}} />
        </div>
        <div>
          <button onClick={fetchRows}>Refresh</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ marginTop:12, marginBottom:12 }}>
        <strong>Add new rate</strong>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
          <select value={newRow.product_group_id} onChange={(e)=>setNewRow({...newRow, product_group_id: e.target.value})}>
            <option value="">Product group</option>
            {uniqueLists.product_groups.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
          </select>
          <select value={newRow.property_type_id} onChange={(e)=>setNewRow({...newRow, property_type_id: e.target.value})}>
            <option value="">Property type</option>
            {uniqueLists.property_types.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
          </select>
          <select value={newRow.tier_id} onChange={(e)=>setNewRow({...newRow, tier_id: e.target.value})}>
            <option value="">Tier</option>
            {uniqueLists.tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={newRow.rate_type_id} onChange={(e)=>setNewRow({...newRow, rate_type_id: e.target.value})}>
            <option value="">Rate type</option>
            {uniqueLists.rate_types.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
          </select>
          <input type="number" value={newRow.fee_percentage} onChange={(e)=>setNewRow({...newRow, fee_percentage: Number(e.target.value)})} style={{width:80}} />
          <input type="number" step="0.0001" value={newRow.rate_value} onChange={(e)=>setNewRow({...newRow, rate_value: Number(e.target.value)})} style={{width:100}} />
          <button onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left' }}>id</th>
              <th>product_group</th>
              <th>property_type</th>
              <th>tier</th>
              <th>rate_type</th>
              <th>rate_value</th>
              <th>active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(renderRow)}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8, display:'flex', gap:8, alignItems:'center' }}>
        <div>Page {page} / {totalPages}</div>
        <button onClick={()=>setPage(1)} disabled={page===1}>First</button>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
        <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
        <button onClick={()=>setPage(totalPages)} disabled={page===totalPages}>Last</button>
      </div>
    </div>
  );
}
