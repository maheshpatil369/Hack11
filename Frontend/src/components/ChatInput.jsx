import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled=false }) {
  const [text, setText] = useState('');
  function submit(e) {
    e && e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }
  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        className="flex-1 px-3 py-2 rounded border border-gray-200"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter claim to verify or paste text..."
        disabled={disabled}
      />
      <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded" disabled={disabled}>Send</button>
    </form>
  );
}
