'use client';

import { useEffect, useRef, useState } from 'react';

export default function StickySection({ children, zIndexClass, bgClass = 'bg-[#0b1121]', className = '' }) {
  const [topStyle, setTopStyle] = useState('0px');
  const ref = useRef(null);

  useEffect(() => {
    let resizeObserver;
    const handleResize = () => {
      if (ref.current) {
        const elHeight = ref.current.offsetHeight;
        const winHeight = window.innerHeight;
        
        // If content is taller than the window, we want it to stick only AFTER
        // the user has scrolled to the bottom of the content.
        // We do this by setting a negative top value.
        if (elHeight > winHeight) {
          setTopStyle(`${winHeight - elHeight}px`);
        } else {
          setTopStyle('0px');
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (ref.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ top: topStyle }}
      className={`sticky w-full ${bgClass} border-t border-white/5 shadow-none md:shadow-[0_-30px_50px_rgba(0,0,0,0.8)] will-change-transform ${zIndexClass} ${className}`}
    >
      {children}
    </div>
  );
}
