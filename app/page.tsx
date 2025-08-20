"use client";

import Hero from "@/components/ui/layout/Hero";
import About from "./About";
import Team from "./Team";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useEffect, useRef } from "react";
import { useScroll } from "@/components/ui/layout/ScrollContext";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const simpleBarRef = useRef<any>(null);
  const { setScrolled } = useScroll();

  useEffect(() => {
    const scrollElement = simpleBarRef.current?.getScrollElement?.();
    if (!scrollElement) return;
    const handleScroll = () => {
      setScrolled(scrollElement.scrollTop > 20);
    };
    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [setScrolled]);

  const handleExploreClick = () => {
    const aboutSection = document.getElementById("about");
    const simpleBarContent = simpleBarRef.current?.getScrollElement?.();
    if (aboutSection && simpleBarContent) {
      const aboutTop = aboutSection.offsetTop;
      simpleBarContent.scrollTo({
        top: aboutTop,
        behavior: "smooth",
      });
    }
  };

  const handleTeamClick = () => {
    const teamSection = document.getElementById("team");
    const simpleBarContent = simpleBarRef.current?.getScrollElement?.();
    if (teamSection && simpleBarContent) {
      const containerRect = simpleBarContent.getBoundingClientRect();
      const teamRect = teamSection.getBoundingClientRect();
      const offset =
        teamRect.top - containerRect.top + simpleBarContent.scrollTop;
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
        <About onTeamClick={handleTeamClick} />
        <Team />
      </SimpleBar>
    </main>
  );
}
