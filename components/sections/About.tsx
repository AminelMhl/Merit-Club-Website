/* eslint-disable @next/next/no-img-element */
import React from "react";
import { animated } from "@react-spring/web";
import styles from "./About.module.css";
import Link from "next/link";
import { useSlideInFromLeftAnimation, useSlideInFromRightAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const About = ({ onTeamClick }: { onTeamClick: () => void }) => {
  // Animation hooks
  const { ref: imageRef, animation: imageAnimation } = useSlideInFromLeftAnimation({ threshold: 0.3 });
  const { ref: textRef, animation: textAnimation } = useSlideInFromRightAnimation({ threshold: 0.3 });
  const { ref: titleRef, animation: titleAnimation } = useStaggeredAnimation(200, { threshold: 0.3 });
  const { ref: buttonRef, animation: buttonAnimation } = useStaggeredAnimation(600, { threshold: 0.3 });

  return (
    <div id="about">
      <div className={styles["about-container"]}>
        <animated.div ref={imageRef} style={imageAnimation} className={styles.images}>
          <img src="/aboutImages.png" alt="" width={500} />
        </animated.div>
        <animated.div ref={textRef} style={textAnimation} className={styles["about-text"]}>
          <animated.p ref={titleRef} style={titleAnimation} className={styles.bit}>A BIT</animated.p>
          <animated.h1 style={titleAnimation} className={styles.aboutH1}>ABOUT US:</animated.h1>
          <animated.p style={textAnimation} className={styles.aboutText}>
            MERIT TBS is a vibrant club at Tunis Business School that brings
            together students who are passionate about IT and digital
            innovation. With the motto “Make Everything Related to IT,” the club
            offers hands-on workshops, engaging bootcamps, and collaborative
            projects that let members dive into coding, design, and emerging
            tech trends in a practical, fun way. Led by President Achref Msekni
            and a dedicated team of VPs, MERIT TBS creates a friendly, dynamic
            space where everyone can grow and thrive in today’s digital age.
          </animated.p>
          <animated.div ref={buttonRef} style={buttonAnimation} className={styles.explorebtn}>
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
          </animated.div>
        </animated.div>
      </div>
    </div>
  );
};

export default About;
