import Link from "next/link";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={styles.heroSection}>
      <h1 className={styles.text}>
        &quot;Make Everything <span className={styles.related}>Related</span> to
        IT&quot;
      </h1>
      <p className={styles.subText}>
        Dive into coding, design, and emerging tech trends in a practical, fun
        way
      </p>
      <div className={styles.buttonContainer}>
        <Link href="/explore-more" className={styles.exploreBtn}>
          Explore more
        </Link>
        <Link href="/login" className={styles.loginHeroBtn}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Hero;
