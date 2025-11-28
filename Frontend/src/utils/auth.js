// local auth helpers (localStorage)
const KEY = 'suresignal_user';

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function loadUser() {
  try {
    const txt = localStorage.getItem(KEY);
    return txt ? JSON.parse(txt) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(KEY);
}
