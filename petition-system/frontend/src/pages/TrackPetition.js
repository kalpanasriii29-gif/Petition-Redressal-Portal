import React, { useState } from 'react';
import { trackPetition } from '../utils/api';

const statusColors = {
  pending: 'bg-yellow-400',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-500',
  rejected: 'bg-red-500',
};

export default function TrackPetition() {
  const [petitionId, setPetitionId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await trackPetition(petitionId.trim());
      setData(res);
    } catch (err) {
      setData(null);
      setError(err?.response?.data?.message || 'Not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Track Petition</h1>
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input value={petitionId} onChange={(e) => setPetitionId(e.target.value)} className="flex-1 border rounded p-2" placeholder="Enter Petition ID (e.g., TNK-2025-001)" />
        <button className="px-4 py-2 bg-gray-900 text-white rounded">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {data && (
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Petition ID</div>
              <div className="font-mono text-lg">{data.petition.petition_id}</div>
            </div>
            <span className={`inline-block px-3 py-1 text-white rounded ${statusColors[data.petition.status]}`}>{data.petition.status.replace('_',' ')}</span>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">Department</div>
            <div>{data.petition.to_department}</div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">Submitted By</div>
            <div>{data.petition.from_name}</div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">Petition</div>
            <div className="whitespace-pre-wrap">{data.petition.petition_text}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Responses</h3>
            <div className="space-y-3">
              {data.responses.length === 0 && <div className="text-gray-500 text-sm">No responses yet.</div>}
              {data.responses.map((r) => (
                <div key={r.id} className="border rounded p-3">
                  <div className="text-xs text-gray-500">{new Date(r.response_date).toLocaleString()} • {r.responded_by}</div>
                  <div className="mt-1 whitespace-pre-wrap">{r.response_text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}