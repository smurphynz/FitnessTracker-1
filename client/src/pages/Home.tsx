import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import WorkoutTab from "@/components/WorkoutTab";

import SummaryTab from "@/components/SummaryTab";
import { workoutSchema, type Workout } from "@shared/schema";

// Define API response types
interface LastDayResponse {
  lastDay: number | null;
}

const workoutsArraySchema = z.array(workoutSchema);

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("70");
  const [activeTab, setActiveTab] = useState<"workout" | "summary">("workout");

  // Get all workouts
  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts"],
    select: (data) => {
      try {
        return workoutsArraySchema.parse(data);
      } catch (error) {
        console.error("Failed to parse workouts:", error);
        return [];
      }
    },
  });

  // Get last mobility and strength days
  const { data: lastMobilityDayData } = useQuery<LastDayResponse>({
    queryKey: ["/api/last-mobility-day"],
  });

  const { data: lastStrengthDayData } = useQuery<LastDayResponse>({
    queryKey: ["/api/last-strength-day"],
  });

  const lastMobilityDay = lastMobilityDayData?.lastDay ?? null;
  const lastStrengthDay = lastStrengthDayData?.lastDay ?? null;



  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md" style={{height: "auto", overflow: "visible", position: "relative"}}>
      <Header
        date={date}
        setDate={setDate}
        weight={weight}
        setWeight={setWeight}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "workout" ? (
        <WorkoutTab
          date={date}
          weight={weight}
          lastMobilityDay={lastMobilityDay}
          lastStrengthDay={lastStrengthDay}
        />
      ) : (
        <SummaryTab />
      )}
    </div>
  );
}