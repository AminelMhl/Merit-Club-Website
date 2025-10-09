import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";

interface TeamMemberAnimationProps {
  index: number;
  threshold?: number;
}

export const useTeamMemberAnimation = ({
  index,
  threshold = 0.2,
}: TeamMemberAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0px)" : "translateY(40px)",
    delay: isVisible ? Math.min(index * 50, 400) : 0, // Reduced delay and capped
    config: {
      tension: 150,
      friction: 20,
    },
  });

  return { ref, animation };
};
