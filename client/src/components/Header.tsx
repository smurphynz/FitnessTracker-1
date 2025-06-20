import React from "react";

/**
 * App-wide header with the new blue palette.
 * Paste this over the existing file (components or layout).
 */
export default function Header() {
  return (
    <header
      className="
      bg-primary-900/80 backdrop-blur-sm sticky top-0 z-10
      flex items-center justify-between
      px-4 py-3 shadow-md border-b border-primary-700/40
    "
    >
      <h1 className="text-2xl font-bold text-primary-50 tracking-wide">
        TEST HEADER
      </h1>

      {/* add any icons/buttons you had before */}
    </header>
  );
}
