"use client";

import { useCourse } from "@/components/course-context";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";

export function CourseAnalytics() {
  const { courseId } = useCourse();
  const studyBlocks = useStore((state) =>
    state.studyBlocks.filter((b) => b.courseId === courseId)
  );
  const assignments = useStore((state) =>
    state.assignments.filter((a) => a.courseId === courseId)
  );

  // Mock analytics data
  const minutesStudied = studyBlocks
    .filter((b) => b.status === "done")
    .reduce((acc, block) => {
      const start = new Date(block.startAt);
      const end = new Date(block.endAt);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

  const blocksDone = studyBlocks.filter((b) => b.status === "done").length;
  const retentionPct = 85; // Mock
  const bestHour = 19; // 7 PM

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Study Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(minutesStudied)}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Blocks Done</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocksDone}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Retention</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retentionPct}%</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Best Hour</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestHour > 12 ? `${bestHour - 12} PM` : `${bestHour} AM`}
            </div>
            <p className="text-xs text-muted-foreground">Most productive</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Learning Style:</span>
              <Badge variant="secondary">Visual</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Best Time:</span>
              <Badge variant="secondary">7-9 PM</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Study Frequency:</span>
              <Badge variant="secondary">Daily</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Study Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

