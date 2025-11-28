// localStorage helpers for chats and library
const CHATS_KEY = 'suresignal_chats_v1';
const LIB_KEY = 'suresignal_library_v1';
const USER_KEY = 'suresignal_user';

export function loadChats() {
  try { return JSON.parse(localStorage.getItem(CHATS_KEY)) || []; } catch { return []; }
}
export function saveChats(chats) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function loadLibrary() {
  try { return JSON.parse(localStorage.getItem(LIB_KEY)) || []; } catch { return []; }
}
export function saveLibrary(items) {
  localStorage.setItem(LIB_KEY, JSON.stringify(items));
}

export function loadUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
}
export function saveUser(u) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}
export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}
