/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import styles from "./Hero.module.css";
import Scrollindicator from "../Scrollindicator";

const Hero = ({ onExploreClick }: { onExploreClick: () => void }) => {
  return (
    <div id="home" className={styles.heroSection}>
      <h1 className={styles.text}>
        &quot;Make Everything{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            className={styles.related}
            style={{ position: "relative", zIndex: 1 }}
          >
            Related
          </span>
          <img
            src="/circle.svg"
            alt="Emphasis Circle"
            style={{
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
      </h1>
      <p className={styles.subText}>
        Dive into coding, design, and emerging tech trends
        <br />
        in a practical, fun way.
      </p>
      <div className={styles.buttonContainer}>
        <button className={styles.exploreBtn} onClick={onExploreClick}>
          Explore more
        </button>
        <Link href="/login" className={styles.loginHeroBtn}>
          Login
        </Link>
      </div>
      <Scrollindicator />
    </div>
  );
};

export default Hero;
