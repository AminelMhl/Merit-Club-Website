"use client";

import Hero from "@/components/ui/layout/Hero";
import About from "./About";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useRef } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const simpleBarRef = useRef<any>(null);

  const handleExploreClick = () => {
  const aboutSection = document.getElementById("about");
  const simpleBarContent = simpleBarRef.current?.getScrollElement?.();
  if (aboutSection && simpleBarContent) {
    // Calculate offset relative to the scroll container
    const containerRect = simpleBarContent.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();
    const offset = aboutRect.top - containerRect.top + simpleBarContent.scrollTop;

    simpleBarContent.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
};
  return (
    <main>
      <style jsx global>{`
        .custom-scrollbar .simplebar-scrollbar::before {
          background-color: #fdc703 !important;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .custom-scrollbar .simplebar-scrollbar:hover::before {
          background-color: #fcaa00 !important;
          opacity: 1;
        }
        .custom-scrollbar.simplebar-scrolling .simplebar-scrollbar::before {
          opacity: 0.8;
        }
        .custom-scrollbar .simplebar-track {
          background-color: transparent !important;
        }
      `}</style>
      <SimpleBar
        className="custom-scrollbar"
        style={{
          maxHeight: "100vh",
          height: "100vh",
          width: "100%",
        }}
        autoHide={true}
        ref={simpleBarRef}
      >
        <Hero onExploreClick={handleExploreClick} />
        <About />
      </SimpleBar>
    </main>
  );
}