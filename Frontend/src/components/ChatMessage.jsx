import React from 'react';

export default function ChatMessage({ m }) {
  const isUser = m.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`${isUser ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg max-w-[75%]`}>
        <div className="text-sm">{m.text}</div>
      </div>
    </div>
  );
}
