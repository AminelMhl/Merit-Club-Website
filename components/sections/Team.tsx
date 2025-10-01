/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import styles from "./Team.module.css";

const Team = () => {
  const teamMembers = useMemo(
    () => [
      {
        name: "Azza Jomni",
        role: "President",
        image: "/team/azza.jpg",
        id: "president",
        linkedin: "https://www.linkedin.com/in/azza-jomni/",
      },
      {
        name: "Tasnim Msallim",
        role: "Vice President",
        image: "/team/tasnim.jpg",
        id: "vp",
        linkedin: "https://www.linkedin.com/in/tasnim-msallem-484b46294/",
      },
      {
        name: "Mohamed Omar Soltani",
        role: "General Secretary",
        image: "/team/medomar.jpg",
        id: "gs",
        linkedin: "https://www.linkedin.com/in/mohamed-omar-soltani/",
      },
      {
        name: "Ameni Tiba",
        role: "Project Management",
        image: "/team/ameni.jpg",
        id: "pm",
        linkedin: "https://www.linkedin.com/in/ameni-tiba-b70956343/",
      },
      {
        name: "Arij Ben Aicha",
        role: "Public Relations",
        image: "/team/arij.jpg",
        id: "pr",
        linkedin: "https://www.linkedin.com/in/arij-ben-aicha-08881932b/",
      },
      {
        name: "Fedi Feki",
        role: "External Relations",
        image: "/team/fedi.jpg",
        id: "er",
        linkedin: "https://www.linkedin.com/in/fedi-feki-1a50882a4/",
      },
      {
        name: "Ata Bouslah",
        role: "Human Resources",
        image: "/team/ata.jpg",
        id: "hr",
        linkedin: "https://www.linkedin.com/in/ata-bouslah",
      },
      {
        name: "Mohamed Belgacem",
        role: "Marketing",
        image: "/team/hansoo.png",
        id: "marketing",
        linkedin: "https://www.linkedin.com/in/h4nsoo/",
      },
    ],
    []
  );

  return (
    <main id="team" className={styles.team}>
      <div className={styles.teamHeader}>
        <h1 className={styles.meet}>Meet Our Team</h1>
        <p className={styles.teamSubtitle}>
          The passionate individuals behind Merit Club TBS
        </p>
      </div>

      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={member.id} className={styles.teamCard}>
            <div className={styles.cardImage}>
              <img
                src={member.image}
                alt={member.name}
                onError={(e) => {
                  console.error(`Failed to load image: ${member.image}`);
                  e.currentTarget.style.backgroundColor = "#333";
                  e.currentTarget.style.display = "flex";
                  e.currentTarget.style.alignItems = "center";
                  e.currentTarget.style.justifyContent = "center";
                }}
                onLoad={() => console.log(`Loaded image: ${member.image}`)}
              />
              <div className={styles.cardOverlay}>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinIcon}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Team;
