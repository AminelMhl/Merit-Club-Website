"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();

  // Hide footer on dashboard and profile pages
  const hiddenPages = ["/dashboard", "/Profile"];
  const shouldHideFooter = hiddenPages.some((page) =>
    pathname.startsWith(page)
  );

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
};

export default FooterWrapper;
