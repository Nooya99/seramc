'use client';

import { useEffect, useRef, useState } from 'react';

export default function StickySection({ children, zIndexClass, bgClass = 'bg-[#0b1121]', className = '' }) {
  const [stickTo, setStickTo] = useState('top-0');
  const ref = useRef(null);

  useEffect(() => {
    let resizeObserver;
    const handleResize = () => {
      if (ref.current) {
        if (ref.current.offsetHeight > window.innerHeight) {
          setStickTo('bottom-0');
        } else {
          setStickTo('top-0');
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
      className={`sticky ${stickTo} w-full ${bgClass} border-t border-white/5 shadow-[0_-30px_50px_rgba(0,0,0,0.8)] ${zIndexClass} ${className}`}
    >
      {children}
    </div>
  );
}
