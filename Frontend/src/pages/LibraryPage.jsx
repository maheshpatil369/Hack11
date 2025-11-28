import React, { useState, useEffect } from 'react';
import { loadLibrary, saveLibrary } from '../utils/storage';

export default function LibraryPage() {
  const [items, setItems] = useState(loadLibrary());
  const [q, setQ] = useState('');

  useEffect(()=> saveLibrary(items), [items]);

  const filtered = items.filter(it => it.title.toLowerCase().includes(q.toLowerCase()) || (it.content || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-4">
      <div className="mb-3 flex gap-2">
        <input placeholder="Search library..." value={q} onChange={e=>setQ(e.target.value)} className="flex-1 px-3 py-2 border rounded" />
        <button onClick={()=> {
          const title = prompt('Title for new library item') || `Item ${items.length+1}`;
          const content = prompt('Content') || '';
          const newItem = { id:`lib-${Date.now()}`, title, content, savedAt: Date.now() };
          setItems(prev => { const n=[newItem, ...prev]; saveLibrary(n); return n; });
        }} className="px-3 py-2 bg-sky-500 text-white rounded">Add</button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-gray-500">No library items</div>}
        {filtered.map(it => (
          <div key={it.id} className="p-3 border rounded bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-600">{it.content}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="text-xs text-gray-400">{new Date(it.savedAt).toLocaleString()}</div>
                <div className="flex gap-2">
                  <button className="text-sm text-red-500" onClick={()=> {
                    if (!confirm('Delete?')) return;
                    const next = items.filter(x=>x.id!==it.id);
                    setItems(next);
                    saveLibrary(next);
                  }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
