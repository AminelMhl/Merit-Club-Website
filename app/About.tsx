import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const About = () => {
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
            <Link href="/your-target-page">
              <img src="/expbtn.png" alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
