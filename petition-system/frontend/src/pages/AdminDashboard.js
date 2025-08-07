import React, { useEffect, useState } from 'react';
import { analytics, deletePetition } from '../utils/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await analytics();
        setData(res);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load analytics');
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-semibold">{data.totals.total}</div>
            <div className="text-gray-600 text-sm">Total</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-semibold">{data.totals.resolved}</div>
            <div className="text-gray-600 text-sm">Resolved</div>
          </div>
          {data.byStatus.map((s) => (
            <div key={s.status} className="bg-white p-4 rounded shadow">
              <div className="text-2xl font-semibold">{s.count}</div>
              <div className="text-gray-600 text-sm">{s.status}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-sm text-gray-600">Use APIs to delete petitions if needed.</div>
    </div>
  );
}