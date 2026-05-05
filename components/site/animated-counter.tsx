'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export function AnimatedCounter({ 
  from = 0, 
  to, 
  duration = 1.5, 
  prefix = '', 
  suffix = '',
  isNumeric = true
}: { 
  from?: number; 
  to: number | string; 
  duration?: number;
  prefix?: string;
  suffix?: string;
  isNumeric?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(isNumeric ? from.toString() : to);

  useEffect(() => {
    if (isInView && isNumeric && typeof to === 'number') {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          setDisplay(Math.round(value).toString());
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration, isNumeric]);

  return (
    <span ref={ref}>
      {prefix}{isNumeric ? display : to}{suffix}
    </span>
  );
}
