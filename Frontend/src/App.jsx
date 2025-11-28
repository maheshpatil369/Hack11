import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import ChatVerifyPage from './pages/ChatVerifyPage';
import LibraryPage from './pages/LibraryPage';
import { loadChats, saveChats, loadUser, saveUser, loadLibrary } from './utils/storage';

export default function App() {
  // app-level state
  const [view, setView] = useState('verify'); // verify | history | library
  const [chats, setChats] = useState(loadChats());
  const [activeChatId, setActiveChatId] = useState(chats.length ? chats[0].id : null);
  const [user, setUser] = useState(loadUser());
  const [library, setLibrary] = useState(loadLibrary());

  useEffect(() => {
    // persist chats to localStorage whenever changed
    saveChats(chats);
    if (!activeChatId && chats.length) setActiveChatId(chats[0].id);
  }, [chats]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  function createNewChat() {
    const id = `chat-${Date.now()}`;
    const newChat = { id, title: 'New chat', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: user?.id || null };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(id);
    setView('verify');
  }

  function selectChat(id) {
    setActiveChatId(id);
    setView('verify');
  }

  function deleteChat(id) {
    const next = chats.filter(c => c.id !== id);
    setChats(next);
    if (activeChatId === id) setActiveChatId(next[0]?.id || null);
  }

  function renameChat(id, title) {
    setChats(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }

  function onAddToLibrary(item) {
    const next = [item, ...library];
    setLibrary(next);
    localStorage.setItem('suresignal_library_v1', JSON.stringify(next));
  }

  // very simple local "login"
  useEffect(() => {
    if (!user) {
      const name = prompt('Enter your name for local demo (stored in browser)', 'Guest');
      if (name !== null) {
        const u = { id: `u-${Date.now()}`, name };
        setUser(u);
        saveUser(u);
      }
    }
  }, []);

  return (
    <div className="container">
      <div className="card p-4 flex gap-4">
        <div className="flex-1">
          <NavBar onNewChat={createNewChat} onViewChange={setView} active={view === 'verify' ? 'verify' : view === 'history' ? 'history' : (view === 'library' ? 'library' : view)} />
          <div className="mt-3">
            {view === 'library' ? (
              <LibraryPage />
            ) : (
              <div className="flex gap-4">
                <Sidebar chats={chats} onSelect={selectChat} onCreate={createNewChat} onDelete={deleteChat} onRename={renameChat} activeId={activeChatId} />
                <div className="flex-1">
                  <ChatVerifyPage activeChatId={activeChatId} setChats={setChats} chats={chats} onAddToLibrary={onAddToLibrary} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* small right column for quick history view when 'history' clicked */}
        <div style={{width:260}} className="hidden lg:block">
          <div className="p-3">
            <h3 className="font-semibold mb-2">Quick history</h3>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {chats.length === 0 && <div className="text-gray-500">No chats yet</div>}
              {chats.map(c => (
                <div key={c.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer" onClick={()=> selectChat(c.id)}>
                  <div className="font-medium text-sm">{c.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-500 truncate">{c.messages?.[c.messages.length-1]?.text || ''}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold mb-2">Library</h3>
            <div className="space-y-2 max-h-[30vh] overflow-auto">
              {library.length === 0 && <div className="text-gray-500">No saved items</div>}
              {library.slice(0,6).map(it => (
                <div key={it.id} className="p-2 border rounded bg-white">
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-gray-500 truncate">{it.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
