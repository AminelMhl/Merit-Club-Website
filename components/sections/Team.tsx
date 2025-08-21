/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Team.module.css";

const Team = () => {
  const teamMembers = [
    {
      name: "Azza Jomni",
      role: "President",
      image: "/amn.png",
      id: "president",
    },
    {
      name: "Tasnim Msallim",
      role: "Vice President",
      image: "/amn.png",
      id: "vp",
    },
    {
      name: "Mohamed Omar Soltani",
      role: "General Secretary",
      image: "/amn.png",
      id: "gs",
    },
    {
      name: "Ameni Tiba",
      role: "Project Management",
      image: "/amn.png",
      id: "pm",
    },
    {
      name: "Arij Ben Aicha",
      role: "Public Relations",
      image: "/amn.png",
      id: "pr",
    },
    {
      name: "Fedi",
      role: "External Relations",
      image: "/amn.png",
      id: "er",
    },
    {
      name: "Ata Bouslah",
      role: "Human Resources",
      image: "/amn.png",
      id: "hr",
    },
    {
      name: "Mohamed Belgacem",
      role: "Marketing",
      image: "/amn.png",
      id: "marketing",
    },
  ];

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
              <img src={member.image} alt={member.name} />
              <div className={styles.cardOverlay}></div>
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
