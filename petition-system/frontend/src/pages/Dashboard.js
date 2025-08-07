import React, { useEffect, useState } from 'react';
import { listPetitions, updateStatus, addResponse } from '../utils/api';

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listPetitions({});
        setRows(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changeStatus = async (id, status) => {
    await updateStatus(id, status);
    setRows((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const addNote = async (id) => {
    const text = prompt('Enter response');
    if (!text) return;
    await addResponse(id, { response_text: text, is_final: false });
    alert('Response added');
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Official Dashboard</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Dept</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Priority</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 font-mono">{r.petition_id}</td>
                <td className="p-2">{r.to_department}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.priority}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => changeStatus(r.id, 'in_progress')}>In Progress</button>
                  <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => changeStatus(r.id, 'resolved')}>Resolve</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => changeStatus(r.id, 'rejected')}>Reject</button>
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => addNote(r.id)}>Add Response</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}