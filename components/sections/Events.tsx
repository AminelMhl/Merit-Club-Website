/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback } from "react";
import styles from "./Events.module.css";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  detailedDescription: string;
  highlights: string[];
  participants: number;
  duration: string;
  location: string;
  gallery: string[];
}

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events: Event[] = [
    {
      id: 1,
      title: "FreelanceIT 3.0",
      date: "December 2024",
      description:
        "Explore freelancing and remote work in the field of IT with industry experts and networking opportunities.",
      image: "/Hero.png",
      detailedDescription:
        "Our flagship event focusing on the future of remote work and freelancing in the technology sector with industry leaders.",
      highlights: [
        "Keynote by top freelancers in the IT field",
        "Q&A session",
        "Discussion panel with industry experts",
      ],
      participants: 120,
      duration: "3 hours",
      location: "Ceramonial Amphitheatre",
      gallery: ["/Hero.png", "/about1.png", "/about2.png"],
    },
    {
      id: 2,
      title: "Web Development Competition",
      date: "February 2025",
      description:
        "Contestants try to build the most innovative web application in a 3 hours time span.",
      image: "/about1.png",
      detailedDescription:
        "An intensive coding competition where teams competed to design through Figma and build innovative web applications within a 3-hour timeframe.",
      highlights: [
        "3-hour intense coding challenge",
        "Teams of 4 students",
        "Prizes for top 2 teams",
      ],
      participants: 25,
      duration: "3 hours",
      location: "TBS Smart Center",
      gallery: ["/about1.png", "/Hero.png", "/about3.png"],
    },
    {
      id: 3,
      title: "Code in the Dark",
      date: "May 2025",
      description:
        "Contestants try to recreate a given picture of a web application without checking their output.",
      image: "/about2.png",
      detailedDescription:
        "A unique coding challenge where participants recreated web designs without seeing their output, testing pure coding skills.",
      highlights: [
        "Blind coding challenge",
        "Complex UI recreation",
        "No preview allowed",
      ],
      participants: 30,
      duration: "3 hours",
      location: "GoMyCode Mourouj Center",
      gallery: ["/about2.png", "/Hero.png", "/about1.png"],
    },
  ];

  const openModal = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    document.body.style.overflow = "unset";
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

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
              <div
                className={styles.timelineContent}
                onClick={() => openModal(event)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openModal(event);
                  }
                }}
              >
                <time className={styles.timelineYear}>{event.date}</time>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
                <div className={styles.clickIndicator}>Click for details</div>
              </div>
            </li>
          ))}
          <li className={styles.timelineEnd} />
        </ol>
      </section>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div
          className={styles.modalBackdrop}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <h2 id="modal-title" className={styles.modalTitle}>
                  {selectedEvent.title}
                </h2>
                <time className={styles.modalDate}>{selectedEvent.date}</time>
                <div className={styles.modalMeta}>
                  <span className={styles.metaItem}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {selectedEvent.participants} participants
                  </span>
                  <span className={styles.metaItem}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.67 0-8-1.34-8-4v-2c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v2c0 2.66-5.33 4-8 4z" />
                    </svg>
                    {selectedEvent.duration}
                  </span>
                  <span className={styles.metaItem}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {selectedEvent.location}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalDescription}>
                <p>{selectedEvent.detailedDescription}</p>
              </div>

              <div className={styles.modalHighlights}>
                <h3>Key Highlights</h3>
                <ul>
                  {selectedEvent.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
