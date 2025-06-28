interface TabNavigationProps {
  activeTab: "workout" | "progress" | "summary";
  setActiveTab: (tab: "workout" | "progress" | "summary") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="forest-panel border-b border-primary-600/30 shadow-md mb-2">
      <div className="container mx-auto">
        <div className="flex">
          <button 
            id="tab-workout" 
            className={`flex-1 py-3 font-medium text-center ${activeTab === "workout" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("workout")}
          >
            Log Workout
          </button>
          <button 
            id="tab-progress" 
            className={`flex-1 py-3 font-medium text-center ${activeTab === "progress" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </button>
          <button 
            id="tab-summary" 
            className={`flex-1 py-3 font-medium text-center ${activeTab === "summary" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  );
}
