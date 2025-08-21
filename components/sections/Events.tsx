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

const Events = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "FreelaceIT 3.0",
      date: "March 2024",
      description: "Explore freelancing and remote work in the field of IT",
      image: "/Hero.png",
    },
    {
      id: 2,
      title: "Web Development Competition",
      date: "April 2024",
      description:
        "Contestants try to build the most innovative web application in a 3 hours time span",
      image: "/about1.png",
    },
    {
      id: 3,
      title: "Code in the Dark",
      date: "May 2024",
      description: "Contestants try to recreate a given picture of a web application.",
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

        <div className={styles.timeline}>
          <div className={styles.timelineLine}></div>
          {events.map((event, index) => (
            <div key={event.id} className={styles.timelineItem}>
              <div className={styles.timelineContent}>
                <div className={styles.timelineImage}>
                  <img src={event.image} alt={event.title} />
                </div>
                <div className={styles.timelineInfo}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <span className={styles.eventDate}>{event.date}</span>
                  <p className={styles.eventDescription}>{event.description}</p>
                </div>
              </div>
              <div className={styles.timelineDot}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
