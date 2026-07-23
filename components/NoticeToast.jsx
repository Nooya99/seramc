'use client';

import { useState, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';

export default function NoticeToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="toast-notice show fixed top-24 md:top-28 right-4 md:right-8 z-40 w-[90%] md:w-[380px] max-w-sm bubble-glass p-4 md:p-5 flex gap-4">
      <div className="text-[#f2e28a] text-lg mt-0.5">
        <PixelIcon name="info-box" className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-white text-[14px] mb-1">Notice</h4>
        <p className="text-[12px] text-gray-300 leading-relaxed">
          Pastikan menggunakan Minecraft versi 1.21.11 (Latest) untuk pengalaman bermain yang optimal!
        </p>
      </div>
      <button 
        onClick={() => setShow(false)} 
        className="text-gray-400 hover:text-white absolute top-4 right-4 transition-colors p-2 z-50 active:scale-95"
      >
        <PixelIcon name="close" className="w-4 h-4" />
      </button>
    </div>
  );
}
