import { useEffect, useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.3, rootMargin = '0px', once = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
};

// Pre-configured animation variants
export const useSlideUpAnimation = (options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(60px)',
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};

export const useFadeInAnimation = (options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};

export const useSlideInFromLeftAnimation = (options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0px)' : 'translateX(-40px)',
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};

export const useSlideInFromRightAnimation = (options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0px)' : 'translateX(40px)',
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};

export const useScaleAnimation = (options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.8)',
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};

export const useStaggeredAnimation = (delay: number = 0, options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(40px)',
    delay: isVisible ? delay : 0,
    config: {
      tension: 120,
      friction: 25,
    },
  });

  return { ref, animation };
};