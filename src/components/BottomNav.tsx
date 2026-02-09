"use client";

import { Home, Flame, User, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBuildClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onBuildClick }: BottomNavProps) {
  const tabs = [
    { id: "today", icon: Home, label: "Aujourd'hui" },
    { id: "forge", icon: Flame, label: "La Forge" },
    { id: "identities", icon: User, label: "Identités" },
    { id: "settings", icon: Settings, label: "Réglages" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/20 z-50">
      <div className="flex items-center justify-around h-16 px-2 pb-6 md:pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-all",
                isActive
                  ? "text-neon-gold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}

        {/* Bouton central BUILD */}
        <button
          onClick={onBuildClick}
          className="relative -top-6 w-16 h-16 bg-gradient-to-br from-neon-gold to-yellow-500 rounded-full shadow-lg shadow-neon-gold/50 flex items-center justify-center border-4 border-background transition-transform active:scale-95 hover:scale-105"
        >
          <Plus className="w-8 h-8 text-background" />
          <div className="absolute inset-0 rounded-full bg-neon-gold animate-ping opacity-20" />
        </button>
      </div>
    </div>
  );
}
