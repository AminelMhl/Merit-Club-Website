/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const About = ({ onTeamClick }: { onTeamClick: () => void }) => {
  return (
    <div id="about">
      <div className={styles["about-container"]}>
        <div className={styles.images}>
          <img src="/aboutImages.png" alt="" width={500} />
        </div>
        <div className={styles["about-text"]}>
          <p className={styles.bit}>A BIT</p>
          <h1 className={styles.aboutH1}>ABOUT US:</h1>
          <p className={styles.aboutText}>
            MERIT TBS is a vibrant club at Tunis Business School that brings
            together students who are passionate about IT and digital
            innovation. With the motto “Make Everything Related to IT,” the club
            offers hands-on workshops, engaging bootcamps, and collaborative
            projects that let members dive into coding, design, and emerging
            tech trends in a practical, fun way. Led by President Achref Msekni
            and a dedicated team of VPs, MERIT TBS creates a friendly, dynamic
            space where everyone can grow and thrive in today’s digital age.
          </p>
          <div className={styles.explorebtn}>
            <button
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              onClick={onTeamClick}
              aria-label="Go to team section"
            >
              <img src="/expbtn.png" alt="#team" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
