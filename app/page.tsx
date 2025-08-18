"use client";

/* eslint-disable @next/next/no-img-element */
import Hero from "@/components/ui/layout/Hero";
import About from "./About";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function Home() {
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
        timeout={1000}
      >
        <Hero />
        <About />
      </SimpleBar>
    </main>
  );
}