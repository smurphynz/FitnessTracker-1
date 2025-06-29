import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import WeightTrendCard from "./WeightTrendCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import PRBadges from "./PRBadges";
import StreakPanel from "./StreakPanel";

import type { Summary } from "@shared/schema";

export default function SummaryTab() {
  const { data: summary, isLoading } = useQuery<Summary>({
    queryKey: ["/api/summary"],
  });

  const { data: currentWeight } = useQuery<{ weight: number | null }>({
    queryKey: ["/api/weight/current"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-primary-600">Loading summary...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-primary-600">No summary data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Summary Grid */}
      <div className="space-y-6">
        {/* Top Row - Weight Trend and PR Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Trend */}
          <div className="forest-panel rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Weight Trend</h3>
            <WeightTrendCard data={summary.weightTrend} currentWeight={summary.currentWeight} />
          </div>

          {/* PR Badges */}
          <div className="forest-panel rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">Personal Records</h3>
            <PRBadges badges={summary.prBadges} />
          </div>
        </div>

        {/* Streak Panel - Full Width */}
        <div className="forest-panel rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary-600 mb-4">Workout Streaks</h3>
          <StreakPanel streaks={summary.streaks} />
        </div>
      </div>

      {/* Recent Workouts List */}
      <div className="forest-panel rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary-600 mb-4">Recent Workouts</h3>
        <RecentWorkoutsList workouts={summary.recentWorkouts} />
      </div>
    </div>
  );
}