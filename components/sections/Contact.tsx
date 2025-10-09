"use client";
import React, { useState } from "react";
import { animated } from "@react-spring/web";
import styles from "./Contact.module.css";
import { useSlideUpAnimation, useSlideInFromLeftAnimation, useSlideInFromRightAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  // Animation hooks
  const { ref: headerRef, animation: headerAnimation } = useSlideUpAnimation({ threshold: 0.2 });
  const { ref: infoRef, animation: infoAnimation } = useSlideInFromLeftAnimation({ threshold: 0.3 });
  const { ref: formRef, animation: formAnimation } = useSlideInFromRightAnimation({ threshold: 0.3 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <animated.div ref={headerRef} style={headerAnimation} className={styles.header}>
          <h2 className={styles.title}>Get In Touch</h2>
          <p className={styles.subtitle}>
            Have a question or want to collaborate? We'd love to hear from you.
          </p>
        </animated.div>

        <div className={styles.content}>
          <animated.div ref={infoRef} style={infoAnimation} className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h3>Location</h3>
              <p>
                Tunis Business School
                <br />
                Tunis, Tunisia
              </p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <h3>Phone</h3>
              <p>+216 97 158 090</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h3>Email</h3>
              <p>geeks.merittbs@gmail.com</p>
            </div>
          </animated.div>

          <animated.div ref={formRef} style={formAnimation} className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className={styles.textareaField}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus === "success" && (
              <div className={styles.successMessage}>
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div className={styles.errorMessage}>
                Sorry, there was an error sending your message. Please try
                again.
              </div>
            )}
            </form>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
