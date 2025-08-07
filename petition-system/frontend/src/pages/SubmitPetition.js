import React, { useState } from 'react';
import { submitPetition } from '../utils/api';

const departments = ['Revenue', 'Police', 'Health', 'Education', 'PWD'];

export default function SubmitPetition() {
  const [form, setForm] = useState({
    from_name: '',
    to_department: departments[0],
    whatsapp_number: '',
    petition_text: '',
    priority: 'normal',
  });
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await submitPetition(form);
      setSubmitted(res);
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Petition Submitted</h2>
        <p className="text-gray-700">Your unique Petition ID is:</p>
        <div className="text-2xl font-mono mt-2">{submitted.petition_id}</div>
        <p className="text-gray-600 mt-3">Use this ID to track your petition status.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Submit a Petition</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input value={form.from_name} onChange={update('from_name')} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select value={form.to_department} onChange={update('to_department')} className="w-full border rounded p-2">
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
          <input value={form.whatsapp_number} onChange={update('whatsapp_number')} className="w-full border rounded p-2" placeholder="e.g., 9876543210" required />
          <p className="text-xs text-gray-500 mt-1">10-15 digits</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Petition Text</label>
          <textarea value={form.petition_text} onChange={update('petition_text')} className="w-full border rounded p-2" rows={6} maxLength={2000} required />
          <div className="text-xs text-gray-500 mt-1">{form.petition_text.length}/2000</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select value={form.priority} onChange={update('priority')} className="w-full border rounded p-2">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </form>
    </div>
  );
}