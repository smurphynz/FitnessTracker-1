import React from "react";

interface Props {
  current: string;
  onSelect: (key: string) => void;
}

const tabs = [
  { key: "workout", label: "Workout" },
  { key: "progress", label: "Progress" },
];

export default function TabNavigation({ current, onSelect }: Props) {
  return (
    <nav className="bg-primary-900/80 backdrop-blur-sm border-b border-primary-700/40 shadow-md mb-2 flex">
      {tabs.map((t) => {
        const active = current === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            className={[
              "flex-1 py-3 text-sm font-medium",
              active
                ? "bg-primary-700 text-primary-50"
                : "bg-transparent text-primary-300 hover:bg-primary-700/40",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
