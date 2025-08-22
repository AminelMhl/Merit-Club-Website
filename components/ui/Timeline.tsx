// Merit Club Timeline Component

"use client";

import { useEffect, useRef } from "react";
import styles from "./Timeline.module.css";

export default function Timeline() {
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (itemsRef.current.length > 0) {
      let maxHeight = 0;
      itemsRef.current.forEach((el) => {
        if (el) {
          const h = el.offsetHeight;
          if (h > maxHeight) maxHeight = h;
        }
      });
      itemsRef.current.forEach((el) => {
        if (el) el.style.height = `${maxHeight}px`;
      });
    }
  }, []);

  return (
    <main>
      <section className={styles.timeline}>
        <ol>
          {[
            {
              year: "2020",
              text: "Merit Club TBS was founded with a vision to empower students",
            },
            {
              year: "2021",
              text: "First coding workshop series launched with 100+ participants",
            },
            {
              year: "2022",
              text: "FreelanceIT competition series began, connecting students with industry",
            },
          ].map((item, i) => (
            <li key={i}>
              <div
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
              >
                <time className={styles.time}>{item.year}</time> {item.text}
              </div>
            </li>
          ))}
          <li></li>
        </ol>
      </section>

      <footer className={styles.pageFooter}>
        <span>Merit Club TBS </span>
      </footer>
    </main>
  );
}
