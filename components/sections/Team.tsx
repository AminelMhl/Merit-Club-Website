/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./Team.module.css";

const Team = () => {
  const teamMembers = [
    {
      name: "Azza Jomni",
      role: "President",
      image: "/team/azza.jpeg",
      id: "president",
    },
    {
      name: "Tasnim Msallim",
      role: "Vice President",
      image: "/team/tasnim.jpeg",
      id: "vp",
    },
    {
      name: "Mohamed Omar Soltani",
      role: "General Secretary",
      image: "/team/medomar.jpg",
      id: "gs",
    },
    {
      name: "Ameni Tiba",
      role: "Project Management",
      image: "/team/ameni.jpg",
      id: "pm",
    },
    {
      name: "Arij Ben Aicha",
      role: "Public Relations",
      image: "/team/arij.jpg",
      id: "pr",
    },
    {
      name: "Fedi Feki",
      role: "External Relations",
      image: "/team/fedi.jpg",
      id: "er",
    },
    {
      name: "Ata Bouslah",
      role: "Human Resources",
      image: "/team/ata.jpg",
      id: "hr",
    },
    {
      name: "Mohamed Belgacem",
      role: "Marketing",
      image: "/team/hansoo.jpg",
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
