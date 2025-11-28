const CHAT_KEY = "suresignal_chats_v1";

export function loadChats() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveChats(chats) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(chats));
}
