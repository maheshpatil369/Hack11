import React, { useEffect, useRef, useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import { postVerify } from '../api/api';
import { loadChats, saveChats } from '../utils/storage';

export default function ChatVerifyPage({ activeChatId, setChats, chats, onAddToLibrary }) {
  const [localChats, setLocalChats] = useState(chats || []);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  useEffect(()=> setLocalChats(chats), [chats]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [localChats, loading]);

  function updateChat(chatId, patch) {
    const all = localChats.map(c => c.id === chatId ? { ...c, ...patch } : c);
    setLocalChats(all);
    setChats(all);
    saveChats(all);
  }

  async function handleSend(text) {
    if (!activeChatId) return;
    // add user message
    const chat = localChats.find(c => c.id === activeChatId);
    const updatedMessages = [...(chat?.messages || []), { role: 'user', text, time: Date.now() }];
    updateChat(activeChatId, { messages: updatedMessages, updatedAt: Date.now() });

    setLoading(true);
    try {
      const payload = await postVerify(text, chat?.userId || null); // call backend
      // create assistant message
      const assistantText = payload.summary || payload.verdict || 'Result below';
      const assistantMsg = { role: 'assistant', text: assistantText, meta: payload, time: Date.now() };
      const newMessages = [...updatedMessages, assistantMsg];
      updateChat(activeChatId, { messages: newMessages, updatedAt: Date.now() });

      // Optionally, add to library automatically? leave to UI action
    } catch (err) {
      const errMsg = { role: 'assistant', text: `Error: ${err.message}`, time: Date.now() };
      const newMessages = [...updatedMessages, errMsg];
      updateChat(activeChatId, { messages: newMessages, updatedAt: Date.now() });
    } finally {
      setLoading(false);
    }
  }

  const activeChat = localChats.find(c => c.id === activeChatId) || null;

  if (!activeChat) {
    return <div className="p-6">Select or create a chat to start verifying claims.</div>;
  }

  return (
    <div className="flex flex-col h-[72vh]">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="font-semibold">{activeChat.title || 'Untitled chat'}</div>
          <div className="text-xs text-gray-500">{new Date(activeChat.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=> {
            // add last assistant message to library
            const last = activeChat.messages && [...activeChat.messages].reverse().find(m => m.role === 'assistant');
            if (last && last.meta) {
              onAddToLibrary({ id: `lib-${Date.now()}`, title: activeChat.title || 'Saved item', content: last.meta.explanation || last.text, savedAt: Date.now() });
              alert('Added to library');
            } else alert('No assistant result to save');
          }} className="text-sm px-3 py-1 border border-gray-200 rounded">Save to library</button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-4 bg-gray-50">
        {activeChat.messages && activeChat.messages.length === 0 && (
          <div className="text-gray-500">No messages yet. Ask something to verify.</div>
        )}
        {activeChat.messages && activeChat.messages.map((m, idx) => <ChatMessage key={idx} m={m} />)}
      </div>

      <div className="p-4 border-t bg-white">
        <ChatInput onSend={handleSend} disabled={loading} />
        {loading && <div className="text-sm text-gray-500 mt-2">Checking...</div>}
      </div>
    </div>
  );
}
