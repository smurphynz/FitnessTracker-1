interface TabNavigationProps {
  activeTab: "workout" | "progress" | "templates" | "photos";
  setActiveTab: (tab: "workout" | "progress" | "templates" | "photos") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="forest-panel border-b border-[#FFEB3B]/20 shadow-md mb-2">
      <div className="container mx-auto">
        <div className="flex">
          <button 
            id="tab-workout" 
            className={`flex-1 py-3 font-medium text-center text-sm ${activeTab === "workout" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("workout")}
          >
            Workout
          </button>
          <button 
            id="tab-progress" 
            className={`flex-1 py-3 font-medium text-center text-sm ${activeTab === "progress" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </button>
          <button 
            id="tab-templates" 
            className={`flex-1 py-3 font-medium text-center text-sm ${activeTab === "templates" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button 
            id="tab-photos" 
            className={`flex-1 py-3 font-medium text-center text-sm ${activeTab === "photos" ? "tab-active" : "opacity-75"}`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
        </div>
      </div>
    </div>
  );
}
