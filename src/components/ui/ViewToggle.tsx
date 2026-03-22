"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onToggle: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-lg border border-border/50">
      <button
        onClick={() => onToggle("grid")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "grid" 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        aria-label="Grid view"
        title="Grid view"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => onToggle("list")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "list" 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        aria-label="List view"
        title="List view"
      >
        <List size={18} />
      </button>
    </div>
  );
}
