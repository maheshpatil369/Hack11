import React from 'react';

export default function ResultBubble({ result }) {
  if (!result) return null;

  // expected result shape from backend: { verdict: 'TRUE'|'FALSE'|'MIXED', explanation: '', eli12: '', sources: [] }
  const verdict = (result.verdict || result.label || '').toString().toUpperCase();
  const colorClass =
    verdict === 'TRUE' ? 'text-green-500' : verdict === 'FALSE' ? 'text-red-400' : 'text-yellow-300';

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        <div className={`font-bold text-lg ${colorClass}`}>Verdict: {verdict || 'UNKNOWN'}</div>
        <div className="text-sm text-gray-400">Confidence: {result.confidence ? Math.round(result.confidence * 100) + '%' : '—'}</div>
      </div>

      {result.explanation && (
        <div className="mt-3 p-3 bg-white/3 rounded-md">
          <div className="font-semibold mb-1">Explanation</div>
          <div className="text-sm text-gray-200">{result.explanation}</div>
        </div>
      )}

      {result.eli12 && (
        <div className="mt-3 p-3 bg-white/3 rounded-md">
          <div className="font-semibold mb-1">Explain like I'm 12</div>
          <div className="text-sm text-gray-200">{result.eli12}</div>
        </div>
      )}

      {result.sources && result.sources.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold mb-2">Sources</div>
          <div className="space-y-2">
            {result.sources.map((s, idx) => (
              <div key={idx} className="text-sm text-gray-300 p-2 bg-white/2 rounded-md">
                <div className="text-xs text-gray-400">{s.title || s.domain || s.url || `Source ${idx+1}`}</div>
                <div className="truncate text-sm">{s.url || s.link || s.domain}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
