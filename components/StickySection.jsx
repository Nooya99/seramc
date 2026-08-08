'use client';

import { useEffect, useRef, useState } from 'react';

export default function StickySection({ children, zIndexClass, bgClass = 'bg-[#0b1121]', className = '' }) {
  const [stickTo, setStickTo] = useState('top-0');
  const ref = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        // If content is taller than the window, stick to bottom so user can see all of it
        // If it's shorter, stick to top
        if (ref.current.offsetHeight > window.innerHeight) {
          setStickTo('bottom-0');
        } else {
          setStickTo('top-0');
        }
      }
    };

    // Initial check
    handleResize();

    // Check on resize
    window.addEventListener('resize', handleResize);
    
    // Also check after a short delay to account for images/content loading
    const timeout = setTimeout(handleResize, 500);

    // Create a MutationObserver to detect content height changes (like FAQ expanding)
    const observer = new MutationObserver(handleResize);
    if (ref.current) {
      observer.observe(ref.current, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`sticky ${stickTo} w-full ${bgClass} shadow-[0_-20px_50px_rgba(0,0,0,0.7)] ${zIndexClass} ${className}`}
    >
      {children}
    </div>
  );
}
