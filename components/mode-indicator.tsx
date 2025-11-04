"use client";

import { Badge } from "@/components/ui/badge";
import { Cloud, Database, WifiOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeIndicator() {
  // Default to demo mode for now
  const mode = "demo";
  
  const modeConfig = {
    demo: {
      icon: Database,
      label: "Demo",
      color: "bg-blue-500",
      description: "Running with localStorage. Data is saved in your browser only.",
    },
    cloud: {
      icon: Cloud,
      label: "Cloud",
      color: "bg-green-500",
      description: "Connected to Supabase. Data syncs across devices.",
    },
    offline: {
      icon: WifiOff,
      label: "Offline",
      color: "bg-gray-500",
      description: "Offline mode. No network calls, deterministic responses.",
    },
  };

  const config = modeConfig[mode as keyof typeof modeConfig] || modeConfig.demo;
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1.5 cursor-help">
            <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
            <Icon className="w-3 h-3" />
            <span className="text-xs">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

