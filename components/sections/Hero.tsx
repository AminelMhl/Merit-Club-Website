/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { animated } from "@react-spring/web";
import styles from "./Hero.module.css";
import Scrollindicator from "../ui/Scrollindicator";
import LoginModal from "../ui/LoginModal";
import { useSlideUpAnimation, useFadeInAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";

const Hero = ({ onExploreClick }: { onExploreClick: () => void }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Animation hooks
  const { ref: titleRef, animation: titleAnimation } = useSlideUpAnimation({ threshold: 0.2 });
  const { ref: subtextRef, animation: subtextAnimation } = useStaggeredAnimation(200, { threshold: 0.2 });
  const { ref: buttonsRef, animation: buttonsAnimation } = useStaggeredAnimation(400, { threshold: 0.2 });
  const { ref: imageRef, animation: imageAnimation } = useFadeInAnimation({ threshold: 0.2 });

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div id="home" className={styles.heroSection}>
      <animated.h1 ref={titleRef} style={titleAnimation} className={styles.text}>
        &quot;Make Everything{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            className={styles.related}
            style={{ position: "relative", zIndex: 1 }}
          >
            Related
          </span>
          <animated.img
            src="/circle.svg"
            alt="Emphasis Circle"
            style={{
              ...imageAnimation,
              position: "absolute",
              left: "10px",
              top: "-15px",
              width: "180px",
              transform: "scale(1.2)",
              height: "100px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </span>{" "}
        to IT&quot;
      </animated.h1>
      <animated.p ref={subtextRef} style={subtextAnimation} className={styles.subText}>
        Dive into coding, design, and emerging tech trends
        <br />
        in a practical, fun way.
      </animated.p>
      <animated.div ref={buttonsRef} style={buttonsAnimation} className={styles.buttonContainer}>
        <button className={styles.exploreBtn} onClick={onExploreClick}>
          Explore more
        </button>
        <button
          onClick={handleLoginClick}
          className={styles.loginHeroBtn}
        >
          Login
        </button>
      </animated.div>

      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} />

      <Scrollindicator />
    </div>
  );
};

export default Hero;
