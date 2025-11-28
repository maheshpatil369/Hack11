import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatVerifyPage from "./pages/ChatVerifyPage";
import InfoPage from "./pages/InfoPage";
import { loadChats, saveChats } from "./utils/storage";

function AppLayout() {
  const location = useLocation();
  const isInfoPage = location.pathname === "/info";

  const [chats, setChats] = useState(loadChats());
  const [activeId, setActiveId] = useState(chats[0]?.id || null);

  function createNewChat() {
    const id = Date.now().toString();
    const newChat = { id, title: "New Chat", messages: [] };
    const updated = [newChat, ...chats];
    setChats(updated);
    saveChats(updated);
    setActiveId(id);
  }

  function deleteChat(id) {
    const filtered = chats.filter((c) => c.id !== id);
    setChats(filtered);
    saveChats(filtered);
    if (activeId === id) {
      setActiveId(filtered[0]?.id || null);
    }
  }

  function updateActiveChat(message) {
    const updated = chats.map((c) =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, message], title: c.messages[0]?.content || "Chat" }
        : c
    );
    setChats(updated);
    saveChats(updated);
  }

  function searchChats(q) {
    if (!q.trim()) {
      setChats(loadChats());
      return;
    }
    const all = loadChats();
    const filtered = all.filter((c) =>
      c.messages.some((m) => m.content.toLowerCase().includes(q.toLowerCase()))
    );
    setChats(filtered);
  }

  const activeChat = chats.find((c) => c.id === activeId) || chats[0];

  return (
    <>
      {/* If info page → full screen */}
      {isInfoPage ? (
        <div className="w-full h-full">
          <InfoPage />
        </div>
      ) : (
        // Normal chat layout
        <div className="chat-container mx-auto my-2 flex">
          <Sidebar
            chats={chats}
            activeId={activeId}
            onSelect={setActiveId}
            onNewChat={createNewChat}
            onSearch={searchChats}
            onDeleteChat={deleteChat}
          />

          <Routes>
            <Route
              path="/"
              element={
                activeChat ? (
                  <ChatVerifyPage chat={activeChat} updateChat={updateActiveChat} />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a chat to begin
                  </div>
                )
              }
            />

            {/* Info page fallback */}
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
