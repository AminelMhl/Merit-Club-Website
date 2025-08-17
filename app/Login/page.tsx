import Navbar from "@/components/ui/layout/Navbar";
import styles from "./page.module.css";
import { Text_Me_One } from "next/font/google";

export default function Home() {
  return (
    <main>
      <>
        <Navbar />
      </>
      <h1>Login</h1>
      <p>Please enter your credentials to access your account.</p>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
