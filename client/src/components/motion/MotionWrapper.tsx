import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motion;
}

/**
 * Motion Wrapper for entrance animations
 * - Soft opacity transition (0 → 1)
 * - Slight vertical movement (12px)
 * - Duration: 300ms
 * - Ease-out curve
 * - Respects prefers-reduced-motion
 * - Triggers once per session
 */
export function MotionWrapper({
  children,
  className = "",
  delay = 0,
  as = "div",
}: MotionWrapperProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion[as] as any;

  // If user prefers reduced motion, render without animation
  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // ease-out curve
      }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Stagger children animations
 * Use for lists and grids
 */
export function MotionStagger({
  children,
  className = "",
  staggerDelay = 0.05,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item
 * Use inside MotionStagger
 */
export function MotionStaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
