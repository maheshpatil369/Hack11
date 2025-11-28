import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  ShareIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({
  chats,
  activeId,
  onSelect,
  onNewChat,
  onSearch,
  onDeleteChat
}) {
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  // ✅ CLICK OUTSIDE HANDLER
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e) {
    setQ(e.target.value);
    onSearch(e.target.value);
  }

  function copyLink(chatId) {
    const url = `${window.location.origin}/?chatId=${chatId}`;
    navigator.clipboard.writeText(url);
    alert("Chat link copied!");
  }

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col">

      {/* LOGO */}
      <div className="p-4 flex items-center gap-3 border-b bg-white">
        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
          SS
        </div>
        <div className="text-xl font-bold text-gray-800">SureSignal</div>
      </div>

      {/* TOP BUTTONS */}
      <div className="p-3 border-b bg-white">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-500 text-white py-2 rounded mb-3 hover:bg-blue-600 transition"
        >
          + New Chat
        </button>

        <Link
          to="/info"
          className="block w-full text-center py-2 rounded border text-gray-700 hover:bg-gray-100 transition"
        >
          ℹ More Info
        </Link>

        <input
          value={q}
          onChange={handleSearch}
          placeholder="Search chats..."
          className="w-full mt-3 px-3 py-2 border rounded bg-white"
        />
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-auto px-2 py-3">
        {chats.length === 0 && (
          <div className="p-3 text-gray-500 text-sm">No chats yet</div>
        )}

        {chats.map((c) => (
          <div
            key={c.id}
            className={`relative group p-3 rounded cursor-pointer mb-2 transition 
              ${activeId === c.id ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"}
            `}
            onClick={() => {
              onSelect(c.id);
              setOpenMenu(null);
            }}
          >
            <div className="font-semibold text-gray-800">
              {c.title || "New chat"}
            </div>

            <div className="text-xs text-gray-500 truncate">
              {c.messages[c.messages.length - 1]?.content}
            </div>

            {/* 3 DOT ICON */}
            <EllipsisVerticalIcon
              className="w-5 h-5 text-gray-600 absolute top-3 right-2 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === c.id ? null : c.id);
              }}
            />

            {/* MENU */}
            {openMenu === c.id && (
              <div
                ref={menuRef}
                className="absolute top-8 right-2 bg-white shadow-md border rounded w-40 py-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Share */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: c.title,
                        url: `${window.location.origin}/?chatId=${c.id}`,
                      });
                    } else {
                      alert("Sharing not supported on this device.");
                    }
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <ShareIcon className="w-4 h-4 text-gray-700" />
                  Share
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    copyLink(c.id);
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <LinkIcon className="w-4 h-4 text-gray-700" />
                  Copy Link
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm("Delete this chat?")) {
                      onDeleteChat(c.id);
                    }
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-600 w-full text-left"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
