import React from "react";

export default function Header() {
  return (
    <header className="bg-primary-900/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-md border-b border-primary-700/40">
      <h1 className="text-2xl font-bold text-primary-50 tracking-wide">
        Cali Fitness Tracker
      </h1>
      {/* whatever buttons / icons you had can stay here */}
    </header>
  );
}
