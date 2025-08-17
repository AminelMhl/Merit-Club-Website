import Navbar from "@/components/ui/layout/Navbar";
import styles from "./page.module.css";
import { Text_Me_One } from "next/font/google";

export default function Home() {
  return (
    <main>
      <>
        <Navbar />
      </>
      <h1>About Merit TBS</h1>
      <p>Merit TBS is a club dedicated to excellence and community service.</p>
      <p>We focus on developing skills, leadership, and making a positive impact.</p>
      <p>Join us to be part of something great!</p>
    </main>
  );
}
