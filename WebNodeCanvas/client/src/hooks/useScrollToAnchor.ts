import { useCallback, useEffect } from "react";
import { useLocation } from "wouter";

export const useScrollToAnchor = () => {
  const [location] = useLocation();

  const scrollToAnchor = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Handle hash changes in URL for direct links
  useEffect(() => {
    if (location.includes("#")) {
      const id = location.split("#")[1];
      scrollToAnchor(id);
    }
  }, [location, scrollToAnchor]);

  return { scrollToAnchor };
};
