import React, { useState } from 'react';
import { saveUser } from '../utils/auth';

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    const user = {
      id: `${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      name: name || 'Anonymous',
      email: email || '',
    };
    saveUser(user);
    onLogin(user);
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/3 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Sign in to SureSignal</h2>
        <p className="text-sm text-gray-400 mb-4">Local demo auth — stored in your browser only</p>

        <form onSubmit={handleLogin} className="space-y-3">
          <input className="w-full px-3 py-2 rounded bg-transparent border border-white/5" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full px-3 py-2 rounded bg-transparent border border-white/5" placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button type="submit" className="w-full bg-sky-500 text-slate-900 py-2 rounded font-semibold">Sign in</button>
        </form>
      </div>
    </div>
  );
}
