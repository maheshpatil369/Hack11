import React, { useState, useMemo } from 'react';

/**
 * Props:
 * - chats: array of { id, title, messages:[{role,text}], createdAt }
 * - onSelect(chatId)
 * - onCreate()
 * - onDelete(chatId)
 * - onRename(chatId, newTitle)
 */
export default function Sidebar({ chats, onSelect, onCreate, onDelete, onRename, activeId }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q.trim()) return chats;
    const s = q.toLowerCase();
    return chats.filter(c => (c.title && c.title.toLowerCase().includes(s)) || (c.messages && c.messages.some(m => m.text.toLowerCase().includes(s))));
  }, [chats, q]);

  return (
    <aside className="w-80 p-3">
      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-3 py-2 rounded border border-gray-200"
        />
      </div>

      <div className="mb-3">
        <button onClick={onCreate} className="w-full px-3 py-2 bg-sky-500 text-white rounded">New chat</button>
      </div>

      <div className="space-y-2 overflow-auto max-h-[56vh]">
        {filtered.length === 0 && <div className="text-gray-500 text-sm">No chats yet</div>}
        {filtered.map(chat => (
          <div key={chat.id} className={`p-2 rounded border ${chat.id === activeId ? 'border-sky-300 bg-sky-50' : 'border-transparent hover:bg-gray-50'}`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 cursor-pointer" onClick={() => onSelect(chat.id)}>
                <div className="font-medium text-sm">{chat.title || 'Untitled chat'}</div>
                <div className="text-xs text-gray-500 truncate">{chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button title="Rename" onClick={() => {
                  const t = prompt('New chat title', chat.title || '');
                  if (t !== null) onRename(chat.id, t);
                }} className="text-xs text-gray-500 hover:text-gray-700">✏️</button>
                <button title="Delete" onClick={() => {
                  if (confirm('Delete this chat?')) onDelete(chat.id);
                }} className="text-xs text-red-500">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
