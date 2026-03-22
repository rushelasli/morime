import { useState } from "react";
import { setViewPreferenceCookie } from "@/actions/CookieActions";

type ViewMode = "grid" | "list";

export function useViewToggle(storageKey: string, defaultView: ViewMode = "grid") {
  const [view, setView] = useState<ViewMode>(defaultView);

  const toggleView = async (newView: ViewMode) => {
    // Optimistic UI update
    setView(newView);
    
    // Persist to cookie for SSR
    try {
      await setViewPreferenceCookie(storageKey, newView);
    } catch (error) {
      console.error("Failed to set view preference cookie:", error);
    }
  };

  return { view, toggleView };
}