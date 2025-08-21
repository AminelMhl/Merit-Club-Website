"use client"
import React, { createContext, useContext, useState } from "react";

const ScrollContext = createContext<{ scrolled: boolean; setScrolled: (v: boolean) => void }>({
  scrolled: false,
  setScrolled: () => {},
});

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState(false);
  return (
    <ScrollContext.Provider value={{ scrolled, setScrolled }}>
      {children}
    </ScrollContext.Provider>
  );
};