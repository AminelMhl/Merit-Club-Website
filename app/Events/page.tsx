import Navbar from "@/components/ui/layout/Navbar";
import styles from "./page.module.css";
import { Text_Me_One } from "next/font/google";

export default function Home() {
  return (
    <main>
      <>
        <Navbar />
      </>
      <h1>our Events!</h1>
      <p>Check out our upcoming events and join us for exciting activities!</p>
      <p>We organize workshops, community service, and fun gatherings.</p>
      <p>Stay tuned for more details and be part of our vibrant community!</p>
      <p>Follow us on social media for the latest updates!</p>
      <p>We look forward to seeing you at our events!</p>
    </main>
  );
}
