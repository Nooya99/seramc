'use client';

import { useEffect, useRef, useState } from 'react';

export default function StickySection({ children, zIndexClass, bgClass = 'bg-[#0b1121]', className = '' }) {
  const [stickTo, setStickTo] = useState('top-0');
  const ref = useRef(null);

  useEffect(() => {
    // Force bottom-0 so that the section always scrolls completely into view 
    // before the next section starts overlapping it from the bottom.
    setStickTo('bottom-0');
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
