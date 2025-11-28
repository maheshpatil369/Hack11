import React, { useState } from "react";
import { PaperClipIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  function upload(e) {
    const file = e.target.files[0];
    if (file) onSend(`file:${file.name}`);
  }

  return (
    <form 
      onSubmit={submit}
      className="p-4 border-t bg-white flex items-center gap-3"
    >
      {/* Upload */}
      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-xl">
        <PaperClipIcon className="w-5 h-5 text-gray-700" />
        <input type="file" className="hidden" onChange={upload} />
      </label>

      {/* Input */}
      <input
        className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message or paste a URL…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Send Button */}
      <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-md">
        <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
      </button>
    </form>
  );
}
