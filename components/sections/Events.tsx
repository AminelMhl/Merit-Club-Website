/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Events.module.css";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

const Events: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "FreelanceIT 3.0",
      date: "December 2024",
      description:
        "Explore freelancing and remote work in the field of IT with industry experts and networking opportunities.",
      image: "/Hero.png",
    },
    {
      id: 2,
      title: "Web Development Competition",
      date: "February 2025",
      description:
        "Contestants try to build the most innovative web application in a 3 hours time span.",
      image: "/about1.png",
    },
    {
      id: 3,
      title: "Code in the Dark",
      date: "May 2025",
      description:
        "Contestants try to recreate a given picture of a web application without checking their output.",
      image: "/about2.png",
    },
  ];

  return (
    <div id="events" className={styles.eventsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Previous Events</h2>
        <p className={styles.subtitle}>
          Explore our journey through past workshops, bootcamps, and tech events
        </p>
      </div>

      <section className={styles.timeline}>
        <ol className={styles.timelineList}>
          {events.map((event, index) => (
            <li key={event.id} className={styles.timelineItem}>
              <div className={styles.timelineContent}>
                <time className={styles.timelineYear}>{event.date}</time>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
              </div>
            </li>
          ))}
          <li className={styles.timelineEnd} />
        </ol>
      </section>
    </div>
  );
};

export default Events;
