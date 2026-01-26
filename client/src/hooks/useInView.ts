import { useEffect, useState, useRef, RefObject } from "react";

/**
 * Custom hook to detect when an element enters the viewport
 * Triggers only once per element (entrance animation)
 * 
 * @param options - IntersectionObserver options
 * @param triggerOnce - Whether to trigger only once (default: true)
 * @returns [ref, inView]
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
  triggerOnce: boolean = true
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // If already triggered and triggerOnce is true, don't observe
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered, triggerOnce, options]);

  return [ref, inView];
}
