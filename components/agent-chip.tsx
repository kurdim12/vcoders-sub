import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Agent } from "@/lib/types";
import {
  Calendar,
  BookOpen,
  FileText,
  GraduationCap,
  StickyNote,
  Search,
  MapPin,
} from "lucide-react";

const agentConfig: Record<
  Agent,
  { label: string; icon: React.ComponentType<any>; color: string }
> = {
  planner: {
    label: "Planner",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
  },
  course: {
    label: "Course",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  assignment: {
    label: "Assignment",
    icon: FileText,
    color: "from-orange-500 to-red-500",
  },
  exam: { label: "Exam", icon: GraduationCap, color: "from-red-500 to-rose-500" },
  notes: {
    label: "Notes",
    icon: StickyNote,
    color: "from-yellow-500 to-amber-500",
  },
  research: {
    label: "Research",
    icon: Search,
    color: "from-green-500 to-emerald-500",
  },
  campus: {
    label: "Campus",
    icon: MapPin,
    color: "from-indigo-500 to-blue-500",
  },
};

interface AgentChipProps {
  agent: Agent;
  className?: string;
}

export function AgentChip({ agent, className }: AgentChipProps) {
  const config = agentConfig[agent];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "bg-gradient-to-r",
        config.color,
        "text-white border-0 animate-glow",
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

