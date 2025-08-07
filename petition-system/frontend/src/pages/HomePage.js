import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <section className="text-center py-10">
        <h1 className="text-3xl font-bold mb-3">Tenkasi District Petition Redressal System</h1>
        <p className="text-gray-700 mb-6">Submit petitions, track status, and view official responses.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Petition</Link>
          <Link to="/track" className="px-4 py-2 bg-gray-200 rounded">Track Petition</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Total Petitions', value: '—' },
          { label: 'Resolved', value: '—' },
          { label: 'In Progress', value: '—' },
          { label: 'Pending', value: '—' },
        ].map((c) => (
          <div key={c.label} className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-semibold">{c.value}</div>
            <div className="text-gray-600 text-sm">{c.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">This system helps citizens file petitions and lets officials manage them efficiently.</p>
      </section>
    </div>
  );
}