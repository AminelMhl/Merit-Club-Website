"use client";

import Hero from "@/components/ui/layout/Hero";
import About from "@/components/sections/About";
import Team from "@/components/sections/Team";
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
        <div
          id="events"
          style={{
            height: "100vh",
            padding: "100px 20px",
            textAlign: "center",
            background: "#000000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{ fontSize: "3rem", marginBottom: "2rem", color: "#fccc06" }}
          >
            Events
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Stay tuned for exciting upcoming events, workshops, and bootcamps
            organized by Merit Club TBS.
          </p>
        </div>
        <div
          id="contact"
          style={{
            height: "100vh",
            padding: "100px 20px",
            textAlign: "center",
            background: "#000000",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{ fontSize: "3rem", marginBottom: "2rem", color: "#fccc06" }}
          >
            Contact Us
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#ccc",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Get in touch with Merit Club TBS for collaborations, questions, or
            to join our community.
          </p>
        </div>
      </SimpleBar>
    </main>
  );
}
