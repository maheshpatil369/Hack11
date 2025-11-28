import React from 'react';

export default function NavBar({ user, onLogout, onViewChange, active }) {
  return (
    <header className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-semibold">SureSignal</h1>
        <p className="text-sm text-gray-400">Claim verification demo</p>
      </div>

      <div className="flex items-center gap-3">
        <nav className="hidden sm:flex gap-2">
          <button
            onClick={() => onViewChange('verify')}
            className={`px-3 py-2 rounded-md ${active === 'verify' ? 'bg-sky-500 text-slate-900' : 'text-gray-300 hover:bg-white/5'}`}
          >
            Verify
          </button>
          <button
            onClick={() => onViewChange('trending')}
            className={`px-3 py-2 rounded-md ${active === 'trending' ? 'bg-sky-500 text-slate-900' : 'text-gray-300 hover:bg-white/5'}`}
          >
            Trending
          </button>
          <button
            onClick={() => onViewChange('stats')}
            className={`px-3 py-2 rounded-md ${active === 'stats' ? 'bg-sky-500 text-slate-900' : 'text-gray-300 hover:bg-white/5'}`}
          >
            Stats
          </button>
        </nav>

        {user ? (
          <div className="flex items-center gap-3 bg-white/3 px-3 py-2 rounded-md">
            <div className="text-sm">{user.name}</div>
            <button onClick={onLogout} className="text-sm px-2 py-1 bg-red-500 rounded-md text-white">Logout</button>
          </div>
        ) : (
          <div className="text-sm text-gray-300">Not signed in</div>
        )}
      </div>
    </header>
  );
}
