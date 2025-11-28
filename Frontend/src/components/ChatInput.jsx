import React, { useState } from "react";
import { PaperClipIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    onSend(`file:${file.name}`);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 p-3 border-t bg-white">
      
      {/* Upload Button */}
      <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded">
        <PaperClipIcon className="w-5 h-5 text-gray-700" />
        <input type="file" className="hidden" onChange={uploadFile} />
      </label>

      <input
        type="text"
        className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Send a message or paste a URL…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
        <span>Send</span>
        <PaperAirplaneIcon className="w-4 h-4 rotate-45" />
      </button>
    </form>
  );
}
