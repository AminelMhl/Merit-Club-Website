// Smooth scroll utility for navigation
export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  // Try multiple selectors to find the scrollable element
  const simpleBarElement =
    document.querySelector(".simplebar-content-wrapper") ||
    document
      .querySelector("[data-simplebar]")
      ?.querySelector(".simplebar-content-wrapper") ||
    document
      .querySelector(".custom-scrollbar")
      ?.querySelector(".simplebar-content-wrapper");

  if (section && simpleBarElement) {
    const sectionTop = section.offsetTop;
    // Precise offset calculation to avoid overlap
    let offset = 0;

    if (sectionId === "home") {
      offset = 0; // Home section starts at the very top
    } else {
      offset = 0; // No negative offset to prevent overlap
    }

    simpleBarElement.scrollTo({
      top: sectionTop + offset,
      behavior: "smooth",
    });
  }
};

export const scrollToTop = () => {
  const simpleBarElement =
    document.querySelector(".simplebar-content-wrapper") ||
    document
      .querySelector("[data-simplebar]")
      ?.querySelector(".simplebar-content-wrapper") ||
    document
      .querySelector(".custom-scrollbar")
      ?.querySelector(".simplebar-content-wrapper");

  if (simpleBarElement) {
    simpleBarElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
