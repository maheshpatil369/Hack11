import React from 'react';

export default function LoadingDots({ className='' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
      <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150" />
      <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-300" />
    </span>
  );
}
