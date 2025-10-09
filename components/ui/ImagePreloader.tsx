"use client";

import { useEffect } from "react";
import {
  preloadTeamImages,
  preloadCriticalImages,
} from "@/utils/imagePreloader";

export default function ImagePreloader() {
  useEffect(() => {
    // Start preloading images immediately when the app loads
    const preloadImages = async () => {
      try {
        // Preload critical images first (Hero, About, etc.)
        await preloadCriticalImages();

        // Then preload team images
        await preloadTeamImages();

        console.log("All images preloaded successfully");
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      }
    };

    preloadImages();
  }, []);

  return null; // This component doesn't render anything
}
