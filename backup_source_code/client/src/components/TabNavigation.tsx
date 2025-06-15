interface TabNavigationProps {
  activeTab: "workout" | "progress";
  setActiveTab: (tab: "workout" | "progress") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="forest-panel border-b border-[#FFEB3B]/20 shadow-md mb-2">
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
        </div>
      </div>
    </div>
  );
}
