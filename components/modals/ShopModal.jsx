'use client';

import { useEffect, useState } from 'react';
import PixelIcon from '@/components/PixelIcon';

const ShopCountdown = ({ expiresAt, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft('');
      return;
    }

    const calculateTimeLeft = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) return '';
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      const ss = seconds.toString().padStart(2, '0');
      
      return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return null;

  return (
    <span className={`font-mono inline-block ${className}`}>
      {timeLeft}
    </span>
  );
};

// Style helper for Ranks
const getRankStyle = (name) => {
  const upper = name.toUpperCase();
  if (upper.includes('LUX')) {
    return {
      iconName: 'star',
      badge: 'LUX',
      bgClass: 'bg-orange-500/10 text-orange-400 border-orange-400/40',
      btnClass: 'bg-[#3b2314] hover:bg-orange-900 text-orange-200 border border-orange-500/20'
    };
  }
  if (upper.includes('VEIL')) {
    return {
      iconName: 'shield',
      badge: 'VEIL',
      bgClass: 'bg-gray-400/10 text-gray-400 border-gray-400/40',
      btnClass: 'bg-[#2b2f3a] hover:bg-gray-700 text-gray-200 border border-gray-500/20'
    };
  }
  if (upper.includes('RIFT')) {
    return {
      iconName: 'trophy',
      badge: 'RIFT',
      bgClass: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/40',
      btnClass: 'bg-[#3d3315] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
    };
  }
  if (upper.includes('CORE')) {
    return {
      iconName: 'diamond-gem',
      badge: 'CORE',
      bgClass: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/40',
      btnClass: 'bg-[#15323d] hover:bg-cyan-900 text-cyan-200 border border-cyan-500/20'
    };
  }
  if (upper.includes('ARCH')) {
    return {
      iconName: 'crown',
      badge: 'ARCH',
      bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/40',
      btnClass: 'bg-[#2d153d] hover:bg-purple-900 text-purple-200 border border-purple-500/20'
    };
  }
  if (upper.includes('CUSTOM')) {
    return {
      iconName: 'fire',
      badge: 'CUSTOM',
      bgClass: 'bg-pink-500/10 text-pink-400 border-pink-400/40',
      btnClass: 'bg-[#3d152a] hover:bg-pink-900 text-pink-200 border border-pink-500/20'
    };
  }
  return {
    iconName: 'star',
    badge: name,
    bgClass: 'bg-sky-500/10 text-sky-400 border-sky-400/40',
    btnClass: 'bg-[#0f2d3d] hover:bg-sky-900 text-sky-200 border border-sky-500/20'
  };
};

// Style helper for Keys
const getKeyStyle = (name) => {
  const upper = name.toUpperCase();
  if (upper.includes('PEASANT')) {
    return {
      iconName: 'unlock',
      badge: 'PEASANT',
      bgClass: 'bg-stone-500/10 text-stone-400 border-stone-400/40',
      btnClass: 'bg-[#292524] hover:bg-stone-800 text-stone-200 border border-stone-500/20'
    };
  }
  if (upper.includes('NOBLE')) {
    return {
      iconName: 'unlock',
      badge: 'NOBLE',
      bgClass: 'bg-slate-500/10 text-slate-400 border-slate-400/40',
      btnClass: 'bg-[#1e293b] hover:bg-slate-800 text-slate-200 border border-slate-500/20'
    };
  }
  if (upper.includes('IMPERIAL')) {
    return {
      iconName: 'unlock',
      badge: 'IMPERIAL',
      bgClass: 'bg-amber-500/10 text-amber-400 border-amber-400/40',
      btnClass: 'bg-[#451a03] hover:bg-amber-900 text-amber-200 border border-amber-500/20'
    };
  }
  if (upper.includes('SERA')) {
    return {
      iconName: 'unlock',
      badge: 'SERA',
      bgClass: 'bg-violet-500/10 text-violet-400 border-violet-400/40',
      btnClass: 'bg-[#2e1065] hover:bg-violet-900 text-violet-200 border border-violet-500/20'
    };
  }
  if (upper.includes('ULTIMATE')) {
    return {
      iconName: 'unlock',
      badge: 'ULTIMATE',
      bgClass: 'bg-rose-500/10 text-rose-400 border-rose-400/40',
      btnClass: 'bg-[#4c0519] hover:bg-rose-900 text-rose-200 border border-rose-500/20'
    };
  }
  return {
    iconName: 'unlock',
    badge: name.replace(/key/i, '').trim(),
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-400/40',
    btnClass: 'bg-[#0d2e27] hover:bg-teal-900 text-teal-200 border border-teal-500/20'
  };
};

// Style helper for Others
const getOtherStyle = (name) => {
  const upper = name.toUpperCase();
  if (upper.includes('CLAIM')) {
    return {
      iconName: 'repeat',
      badge: name,
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/40',
      btnClass: 'bg-[#064e3b] hover:bg-emerald-900 text-emerald-200 border border-emerald-500/20'
    };
  }
  if (upper.includes('PASS')) {
    return {
      iconName: 'membercard',
      badge: name,
      bgClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-400/40',
      btnClass: 'bg-[#4a044e] hover:bg-fuchsia-900 text-fuchsia-200 border border-fuchsia-500/20'
    };
  }
  if (upper.includes('SKILL')) {
    return {
      iconName: 'sword',
      badge: name,
      bgClass: 'bg-red-500/10 text-red-400 border-red-400/40',
      btnClass: 'bg-[#7f1d1d] hover:bg-red-900 text-red-200 border border-red-500/20'
    };
  }
  if (upper.includes('COIN')) {
    return {
      iconName: 'coins',
      badge: name,
      bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/40',
      btnClass: 'bg-[#422006] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
    };
  }
  return {
    iconName: 'package',
    badge: name,
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-400/40',
    btnClass: 'bg-[#0f2537] hover:bg-blue-900 text-blue-200 border border-blue-500/20'
  };
};

// Style helper for Races
const getRaceStyle = (name) => {
  const upper = name.toUpperCase();
  if (upper.includes('BARD')) {
    return {
      iconName: 'music',
      badge: name,
      bgClass: 'bg-pink-500/10 text-pink-400 border-pink-400/40',
      btnClass: 'bg-[#3d152a] hover:bg-pink-900 text-pink-200 border border-pink-500/20'
    };
  }
  if (upper.includes('CENTAUR')) {
    return {
      iconName: 'fire',
      badge: name,
      bgClass: 'bg-orange-500/10 text-orange-400 border-orange-400/40',
      btnClass: 'bg-[#3b2314] hover:bg-orange-900 text-orange-200 border border-orange-500/20'
    };
  }
  if (upper.includes('DRAGON')) {
    return {
      iconName: 'fire',
      badge: name,
      bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/40',
      btnClass: 'bg-[#2d153d] hover:bg-purple-900 text-purple-200 border border-purple-500/20'
    };
  }
  if (upper.includes('DWARF')) {
    return {
      iconName: 'script',
      badge: name,
      bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/40',
      btnClass: 'bg-[#422006] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
    };
  }
  if (upper.includes('ELF')) {
    return {
      iconName: 'leaf',
      badge: name,
      bgClass: 'bg-green-500/10 text-green-400 border-green-400/40',
      btnClass: 'bg-[#064e3b] hover:bg-green-900 text-green-200 border border-green-500/20'
    };
  }
  if (upper.includes('GIANT')) {
    return {
      iconName: 'image',
      badge: name,
      bgClass: 'bg-red-500/10 text-red-400 border-red-400/40',
      btnClass: 'bg-[#7f1d1d] hover:bg-red-900 text-red-200 border border-red-500/20'
    };
  }
  if (upper.includes('VAMPIRE')) {
    return {
      iconName: 'user-x',
      badge: name,
      bgClass: 'bg-rose-500/10 text-rose-400 border-rose-400/40',
      btnClass: 'bg-[#4c0519] hover:bg-rose-900 text-rose-200 border border-rose-500/20'
    };
  }
  return {
    iconName: 'user',
    badge: name,
    bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/40',
    btnClass: 'bg-[#15323d] hover:bg-cyan-900 text-cyan-200 border border-cyan-500/20'
  };
};

const initialRanks = [
  {
    name: 'LUX',
    iconName: 'star',
    badge: 'LUX',
    color: 'orange',
    prices: [
      { duration: '1 Bulan', price: '25.000', fullName: 'LUX Rank (1 Bulan)' },
      { duration: 'Permanen', price: '45.000', fullName: 'LUX Rank (Permanen)' },
    ],
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-400/40',
    btnClass: 'bg-[#3b2314] hover:bg-orange-900 text-orange-200 border border-orange-500/20'
  },
  {
    name: 'VEIL',
    iconName: 'shield',
    badge: 'VEIL',
    color: 'gray',
    prices: [
      { duration: '1 Bulan', price: '40.000', fullName: 'VEIL Rank (1 Bulan)' },
      { duration: 'Permanen', price: '65.000', fullName: 'VEIL Rank (Permanen)' },
    ],
    bgClass: 'bg-gray-400/10 text-gray-400 border-gray-400/40',
    btnClass: 'bg-[#2b2f3a] hover:bg-gray-700 text-gray-200 border border-gray-500/20'
  },
  {
    name: 'RIFT',
    iconName: 'trophy',
    badge: 'RIFT',
    color: 'yellow',
    prices: [
      { duration: '1 Bulan', price: '65.000', fullName: 'RIFT Rank (1 Bulan)' },
      { duration: 'Permanen', price: '90.000', fullName: 'RIFT Rank (Permanen)' },
    ],
    bgClass: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/40',
    btnClass: 'bg-[#3d3315] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
  },
  {
    name: 'CORE',
    iconName: 'diamond-gem',
    badge: 'CORE',
    color: 'cyan',
    prices: [
      { duration: '1 Bulan', price: '90.000', fullName: 'CORE Rank (1 Bulan)' },
      { duration: 'Permanen', price: '120.000', fullName: 'CORE Rank (Permanen)' },
    ],
    bgClass: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/40',
    btnClass: 'bg-[#15323d] hover:bg-cyan-900 text-cyan-200 border border-cyan-500/20'
  },
  {
    name: 'ARCH',
    iconName: 'crown',
    badge: 'ARCH',
    color: 'purple',
    prices: [
      { duration: '1 Bulan', price: '120.000', fullName: 'ARCH Rank (1 Bulan)' },
      { duration: 'Permanen', price: '160.000', fullName: 'ARCH Rank (Permanen)' },
    ],
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/40',
    btnClass: 'bg-[#2d153d] hover:bg-purple-900 text-purple-200 border border-purple-500/20'
  },
  {
    name: 'CUSTOM',
    iconName: 'fire',
    badge: 'CUSTOM',
    color: 'pink',
    isSpecial: true,
    prices: [
      { duration: '1 Bulan', price: '300.000', fullName: 'CUSTOM Rank (1 Bulan)' },
      { duration: 'Permanen', price: '450.000', fullName: 'CUSTOM Rank (Permanen)' },
    ],
    bgClass: 'bg-pink-500/10 text-pink-400 border-pink-400/40',
    btnClass: 'bg-[#3d152a] hover:bg-pink-900 text-pink-200 border border-pink-500/20'
  }
];

const initialKeysData = [
  {
    name: 'PEASANT Key',
    iconName: 'unlock',
    badge: 'PEASANT',
    color: 'stone',
    price: '13.000',
    benefit: '5 Key',
    bgClass: 'bg-stone-500/10 text-stone-400 border-stone-400/40',
    btnClass: 'bg-[#292524] hover:bg-stone-800 text-stone-200 border border-stone-500/20'
  },
  {
    name: 'NOBLE Key',
    iconName: 'unlock',
    badge: 'NOBLE',
    color: 'slate',
    price: '20.000',
    benefit: '5 Key',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-400/40',
    btnClass: 'bg-[#1e293b] hover:bg-slate-800 text-slate-200 border border-slate-500/20'
  },
  {
    name: 'IMPERIAL Key',
    iconName: 'unlock',
    badge: 'IMPERIAL',
    color: 'amber',
    price: '24.000',
    benefit: '5 Key',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-400/40',
    btnClass: 'bg-[#451a03] hover:bg-amber-900 text-amber-200 border border-amber-500/20'
  },
  {
    name: 'SERA Key',
    iconName: 'unlock',
    badge: 'SERA',
    color: 'violet',
    price: '28.000',
    benefit: '5 Key',
    bgClass: 'bg-violet-500/10 text-violet-400 border-violet-400/40',
    btnClass: 'bg-[#2e1065] hover:bg-violet-900 text-violet-200 border border-violet-500/20'
  },
  {
    name: 'ULTIMATE Key',
    iconName: 'unlock',
    badge: 'ULTIMATE',
    color: 'rose',
    price: '45.000',
    benefit: '9 Key',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-400/40',
    btnClass: 'bg-[#4c0519] hover:bg-rose-900 text-rose-200 border border-rose-500/20'
  }
];

const initialOthersData = [
  {
    name: 'Unlimited Claim',
    iconName: 'repeat',
    badge: 'Unlimited Claim',
    price: '35.000',
    duration: 'Permanen',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/40',
    btnClass: 'bg-[#064e3b] hover:bg-emerald-900 text-emerald-200 border border-emerald-500/20'
  },
  {
    name: 'Premium Pass',
    iconName: 'membercard',
    badge: 'Premium Pass',
    price: '30.000',
    duration: '1 Bulan',
    bgClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-400/40',
    btnClass: 'bg-[#4a044e] hover:bg-fuchsia-900 text-fuchsia-200 border border-fuchsia-500/20'
  },
  {
    name: 'Max Skills',
    iconName: 'sword',
    badge: 'Max Skills',
    price: '300.000',
    duration: 'Per Season',
    bgClass: 'bg-red-500/10 text-red-400 border-red-400/40',
    btnClass: 'bg-[#7f1d1d] hover:bg-red-900 text-red-200 border border-red-500/20'
  },
  {
    name: 'Coin Bundle',
    iconName: 'coins',
    badge: 'Coin Bundle',
    price: '1.000',
    benefit: '35 Coin',
    bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/40',
    btnClass: 'bg-[#422006] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
  }
];

export default function ShopModal({ isOpen, onClose, cart = [], playerContext, onLoginClick, onAddToCart, onViewCart, onViewStatus }) {
  const [ranks, setRanks] = useState(initialRanks);
  const [keysData, setKeysData] = useState(initialKeysData);
  const [othersData, setOthersData] = useState(initialOthersData);
  const [racesData, setRacesData] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountExpiry, setGlobalDiscountExpiry] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchDbProducts();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchDbProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const dbProducts = await res.json();
        if (dbProducts && dbProducts.length > 0) {
          const now = new Date().getTime();
          // Filter out expired discounts
          const activeProducts = dbProducts.map(p => {
            if (p.discount > 0 && p.discountExpiresAt && new Date(p.discountExpiresAt).getTime() <= now) {
              return { ...p, discount: 0, discountExpiresAt: null };
            }
            return p;
          });

          const maxDiscount = Math.max(...activeProducts.map(p => p.discount || 0));
          const allHaveDiscount = maxDiscount > 0 && activeProducts.every(p => p.discount === maxDiscount);
          
          setGlobalDiscount(allHaveDiscount ? maxDiscount : 0);
          
          if (allHaveDiscount) {
            // Find if all have the same expiry, or take the max expiry
            const expiries = activeProducts.map(p => p.discountExpiresAt).filter(Boolean);
            if (expiries.length > 0) {
              // Just pick one if they are part of global discount, usually they are set together
              setGlobalDiscountExpiry(expiries[0]);
            } else {
              setGlobalDiscountExpiry(null);
            }
          } else {
            setGlobalDiscountExpiry(null);
          }

          // 1. Ranks Mapping (Grouped dynamically by base name)
          const rankItems = activeProducts.filter(p => (p.category || '').toLowerCase() === 'rank');
          if (rankItems.length > 0) {
            const groupedRanks = {};
            rankItems.forEach(p => {
              const baseName = p.name.split('(')[0].replace(/rank/i, '').trim();
              if (!groupedRanks[baseName]) {
                groupedRanks[baseName] = [];
              }
              groupedRanks[baseName].push(p);
            });

            const updatedRanks = Object.keys(groupedRanks).map(baseName => {
              const items = groupedRanks[baseName];
              const style = getRankStyle(baseName);
              const sortedPrices = items.sort((a, b) => a.price - b.price).map(p => {
                const isDiscounted = p.discount > 0;
                const finalPrice = isDiscounted ? p.price * (1 - p.discount / 100) : p.price;
                return {
                  duration: p.duration || 'Permanen',
                  originalPrice: isDiscounted ? p.price.toLocaleString('id-ID') : null,
                  price: finalPrice ? finalPrice.toLocaleString('id-ID') : '0',
                  numericPrice: finalPrice,
                  fullName: p.name,
                  discount: p.discount,
                  discountExpiresAt: p.discountExpiresAt
                };
              });

              return {
                name: baseName,
                ...style,
                isPopular: items.some(p => p.isPopular),
                prices: sortedPrices
              };
            });
            setRanks(updatedRanks);
          } else {
            setRanks(initialRanks);
          }

          // 2. Keys Mapping
          const keyItems = dbProducts.filter(p => (p.category || '').toLowerCase().includes('key') || (p.category || '').toLowerCase().includes('crate'));
          if (keyItems.length > 0) {
            const updatedKeys = keyItems.map(p => {
              const style = getKeyStyle(p.name);
              const isDiscounted = p.discount > 0;
              const finalPrice = isDiscounted ? p.price * (1 - p.discount / 100) : p.price;
              return {
                name: p.name,
                ...style,
                originalPrice: isDiscounted ? p.price.toLocaleString('id-ID') : null,
                price: finalPrice ? finalPrice.toLocaleString('id-ID') : '0',
                numericPrice: finalPrice,
                benefit: p.duration || 'Key',
                isPopular: p.isPopular,
                discount: p.discount,
                discountExpiresAt: p.discountExpiresAt
              };
            });
            setKeysData(updatedKeys);
          } else {
            setKeysData(initialKeysData);
          }

          // 3. Others Mapping
          const otherItems = dbProducts.filter(p => (p.category || '').toLowerCase() === 'others' || (p.category || '').toLowerCase() === 'other');
          if (otherItems.length > 0) {
            const updatedOthers = otherItems.map(p => {
              const style = getOtherStyle(p.name);
              const isDiscounted = p.discount > 0;
              const finalPrice = isDiscounted ? p.price * (1 - p.discount / 100) : p.price;
              return {
                name: p.name,
                ...style,
                originalPrice: isDiscounted ? p.price.toLocaleString('id-ID') : null,
                price: finalPrice ? finalPrice.toLocaleString('id-ID') : '0',
                numericPrice: finalPrice,
                duration: p.duration || 'Permanen',
                isPopular: p.isPopular,
                discount: p.discount,
                discountExpiresAt: p.discountExpiresAt
              };
            });
            setOthersData(updatedOthers);
          } else {
            setOthersData(initialOthersData);
          }

          // 4. Races Mapping
          const raceItems = dbProducts.filter(p => (p.category || '').toLowerCase() === 'race');
          if (raceItems.length > 0) {
            const updatedRaces = raceItems.map(p => {
              const style = getRaceStyle(p.name);
              const isDiscounted = p.discount > 0;
              const finalPrice = isDiscounted ? p.price * (1 - p.discount / 100) : p.price;
              return {
                name: p.name,
                ...style,
                originalPrice: isDiscounted ? p.price.toLocaleString('id-ID') : null,
                price: finalPrice ? finalPrice.toLocaleString('id-ID') : '0',
                numericPrice: finalPrice,
                duration: p.duration || 'Permanen',
                isPopular: p.isPopular,
                discount: p.discount,
                discountExpiresAt: p.discountExpiresAt
              };
            });
            setRacesData(updatedRaces);
          } else {
            setRacesData([]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching DB products for modal:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content flex flex-col relative w-full max-w-7xl max-h-[85vh] rounded-3xl bg-[#0b1120] border border-white/20 shadow-2xl"
      >
        {/* Navbar inside Modal */}
        <div className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-[#0b1120] z-20 shrink-0 rounded-t-3xl min-h-[72px] md:min-h-[88px]">
          
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full glass-pill text-blue-400 shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={onViewCart}
            >
              <PixelIcon name="shopping-cart" className="w-5 h-5 md:w-6 md:h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-lg">
                  {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
                </span>
              )}
            </div>
            
            {playerContext ? (
              <div 
                className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-full py-1.5 px-2 md:py-2 md:px-3 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={onLoginClick}
              >
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden border-[2.5px] border-white shrink-0 bg-[#0b1120]">
                  <img src={playerContext.avatarUrl} alt={playerContext.nickname} className="w-full h-full object-cover rendering-pixelated" style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-white font-bold text-sm md:text-base font-poppins">{playerContext.nickname}</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-2 px-4 transition-colors"
              >
                <PixelIcon name="user" className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">Set Nickname</span>
              </button>
            )}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img 
              src="/serashop.png" 
              alt="Sera Shop Logo" 
              className="h-12 md:h-16 object-contain drop-shadow-xl scale-[1.8] md:scale-[2.2] pointer-events-auto"
            />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 flex items-center gap-3 z-50">
            <button 
              onClick={() => {
                if (onViewStatus) onViewStatus();
              }}
              className="flex items-center gap-1.5 bg-[#f2e28a]/10 text-[#f2e28a] border border-[#f2e28a]/30 hover:bg-[#f2e28a]/20 hover:text-white rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(242,226,138,0.1)]"
            >
              <PixelIcon name="script" className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline font-bold text-xs md:text-sm tracking-wide">Cek Pesanan</span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 md:p-2.5 transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
            >
              <PixelIcon name="close" className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 rounded-b-3xl">

        {globalDiscount > 0 && (
          <div className="mb-8 p-4 md:p-6 rounded-3xl bg-gradient-to-r from-red-600/20 via-rose-500/20 to-red-600/20 border border-red-500/40 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(225,29,72,0.15)] relative overflow-hidden">
            <PixelIcon name="tag" className="w-8 h-8 md:w-12 md:h-12 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)] z-10" />
            <div className="text-center z-10">
              <h3 className="text-white font-black text-xl md:text-3xl font-poppins drop-shadow-md">
                GLOBAL DISCOUNT {globalDiscount}% OFF!
                {globalDiscountExpiry && (
                  <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-red-500/30 text-red-200">
                    <PixelIcon name="clock" className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                    <ShopCountdown expiresAt={globalDiscountExpiry} />
                  </span>
                )}
              </h3>
              <p className="text-red-200 text-xs md:text-sm font-medium mt-1">Semua item di shop sedang diskon besar-besaran!</p>
            </div>
            <PixelIcon name="tag" className="w-8 h-8 md:w-12 md:h-12 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)] z-10" />
          </div>
        )}

        {/* Ranks Header */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <PixelIcon name="star" className="w-8 h-8 text-orange-400 hidden sm:block" />
          <h2 className="text-2xl md:text-3xl font-black text-white font-poppins tracking-wider text-center">RANK PACKAGES</h2>
          <PixelIcon name="star" className="w-8 h-8 text-orange-400 hidden sm:block" />
        </div>

        {/* Grid Area for Ranks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-16">
          {ranks.flatMap((item) => {
            return item.prices.map((p) => (
              <div 
                key={`${item.name}-${p.duration}`} 
                className="bg-[#0f1422] rounded-[1.5rem] p-6 md:p-8 flex flex-col relative overflow-hidden border border-white/5 shadow-xl transition-transform hover:-translate-y-1"
              >
                {p.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-black flex items-center gap-1 shadow-lg shadow-red-500/20 z-10 border border-white/10">
                    <PixelIcon name="tag" className="w-3 h-3" />
                    -{p.discount}%
                    {p.discountExpiresAt && (
                      <span className="ml-1 pl-1 border-l border-white/30 flex items-center gap-1 text-[9px] md:text-[10px]">
                        <ShopCountdown expiresAt={p.discountExpiresAt} />
                      </span>
                    )}
                  </div>
                )}
                {item.isPopular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-1 rounded-full text-[10px] md:text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-500/20 z-10">
                    <PixelIcon name="fire" className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-950" />
                    POPULER
                  </div>
                )}
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border ${item.bgClass}`}>
                  <PixelIcon name={item.iconName} className="w-6 h-6" />
                </div>
                
                {/* Rank Name & Duration */}
                <div className="mb-6">
                  <h3 className="font-black text-3xl md:text-4xl text-white font-poppins tracking-wide">
                    {item.badge}
                  </h3>
                  <p className="text-gray-400 font-medium mt-1">{p.duration}</p>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-4 mb-8 mt-auto">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-gray-300 text-[14px] md:text-[15px] font-medium">
                      Harga
                    </span>
                    <div className="flex flex-col items-end">
                      {p.originalPrice && (
                        <span className="text-xs text-rose-400 line-through">Rp {p.originalPrice}</span>
                      )}
                      <span className="text-[#f2e28a] font-bold text-3xl">
                        {p.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button 
                  onClick={() => onAddToCart({ name: p.fullName || `${item.name} Rank (${p.duration})`, duration: p.duration, price: p.price, category: 'rank' })}
                  className={`w-full font-bold py-3.5 rounded-2xl transition-all duration-300 ease-in-out text-[14px] md:text-[15px] active:scale-95 ${item.btnClass}`}
                >
                  TAMBAH KE KERANJANG
                </button>
              </div>
            ));
          })}
        </div>

        {/* Keys Header */}
        <div className="mt-16 mb-8 flex items-center justify-center gap-3">
          <PixelIcon name="unlock" className="w-8 h-8 text-yellow-400 hidden sm:block" />
          <h2 className="text-2xl md:text-3xl font-black text-white font-poppins tracking-wider text-center">DAFTAR HARGA KEY</h2>
          <PixelIcon name="unlock" className="w-8 h-8 text-yellow-400 hidden sm:block" />
        </div>

        {/* Grid Area for Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full mb-16">
          {keysData.map((item) => {
            return (
              <div 
                key={item.name} 
                className="bg-[#0f1422] rounded-[1.5rem] p-4 xl:p-5 flex flex-col relative overflow-hidden border border-white/5 shadow-xl transition-transform hover:-translate-y-1"
              >
                {item.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-0.5 rounded-full text-[9px] xl:text-[10px] font-black flex items-center gap-1 shadow-lg shadow-red-500/20 z-10 border border-white/10">
                    <PixelIcon name="tag" className="w-2.5 h-2.5" />
                    -{item.discount}%
                    {item.discountExpiresAt && (
                      <span className="ml-1 pl-1 border-l border-white/30 flex items-center gap-1 text-[8px] xl:text-[9px]">
                        <ShopCountdown expiresAt={item.discountExpiresAt} />
                      </span>
                    )}
                  </div>
                )}
                {item.isPopular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] xl:text-[10px] font-black flex items-center gap-1 shadow-lg shadow-amber-500/20 z-10">
                    <PixelIcon name="fire" className="w-2.5 h-2.5 text-slate-950" />
                    POPULER
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 border ${item.bgClass}`}>
                  <PixelIcon name={item.iconName} className="w-5 h-5" />
                </div>
                <div className="mb-5">
                  <h3 className="font-black text-2xl text-white font-poppins tracking-wide">
                    {item.badge}
                  </h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">{item.benefit}</p>
                </div>
                <div className="flex flex-col gap-4 mb-6 mt-auto">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-gray-300 text-sm font-medium">Harga</span>
                    <div className="flex flex-col items-end">
                      {item.originalPrice && (
                        <span className="text-xs text-rose-400 line-through">Rp {item.originalPrice}</span>
                      )}
                      <span className="text-[#f2e28a] font-bold text-2xl">{item.price}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onAddToCart({ name: item.name, duration: item.benefit, price: item.price, category: 'key' })}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ease-in-out text-[11px] xl:text-[12px] whitespace-nowrap active:scale-95 ${item.btnClass}`}
                >
                  TAMBAH KE KERANJANG
                </button>
              </div>
            );
          })}
        </div>

        {/* Others Header */}
        <div className="mt-16 mb-8 flex items-center justify-center gap-3">
          <PixelIcon name="package" className="w-8 h-8 text-blue-400 hidden sm:block" />
          <h2 className="text-2xl md:text-3xl font-black text-white font-poppins tracking-wider text-center">[ OTHERS ]</h2>
          <PixelIcon name="package" className="w-8 h-8 text-blue-400 hidden sm:block" />
        </div>

        {/* Grid Area for Others */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
          {othersData.map((item) => {
            return (
              <div 
                key={item.name} 
                className="bg-[#0f1422] rounded-[1.5rem] p-6 flex flex-col relative overflow-hidden border border-white/5 shadow-xl transition-transform hover:-translate-y-1"
              >
                {item.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg shadow-red-500/20 z-10 border border-white/10">
                    <PixelIcon name="tag" className="w-3 h-3" />
                    -{item.discount}%
                    {item.discountExpiresAt && (
                      <span className="ml-1 pl-1 border-l border-white/30 flex items-center gap-1 text-[9px]">
                        <ShopCountdown expiresAt={item.discountExpiresAt} />
                      </span>
                    )}
                  </div>
                )}
                {item.isPopular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg shadow-amber-500/20 z-10">
                    <PixelIcon name="fire" className="w-3 h-3 text-slate-950" />
                    POPULER
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 border ${item.bgClass}`}>
                  <PixelIcon name={item.iconName} className="w-5 h-5" />
                </div>
                <div className="mb-5">
                  <h3 className="font-black text-xl md:text-2xl text-white font-poppins tracking-wide leading-tight">
                    {item.badge}
                  </h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">{item.duration || item.benefit}</p>
                </div>
                <div className="flex flex-col gap-4 mb-6 mt-auto">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-gray-300 text-sm font-medium">Harga</span>
                    <div className="flex flex-col items-end">
                      {item.originalPrice && (
                        <span className="text-xs text-rose-400 line-through">Rp {item.originalPrice}</span>
                      )}
                      <span className="text-[#f2e28a] font-bold text-2xl">{item.price}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onAddToCart({ name: item.name, duration: item.duration || item.benefit, price: item.price, category: 'other' })}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ease-in-out text-sm active:scale-95 ${item.btnClass}`}
                >
                  TAMBAH KE KERANJANG
                </button>
              </div>
            );
          })}
        </div>

        {/* Races Header */}
        {racesData.length > 0 && (
          <>
            <div className="mt-16 mb-8 flex items-center justify-center gap-3">
              <PixelIcon name="user" className="w-8 h-8 text-cyan-400 hidden sm:block" />
              <h2 className="text-2xl md:text-3xl font-black text-white font-poppins tracking-wider text-center">[ RACES ]</h2>
              <PixelIcon name="user" className="w-8 h-8 text-cyan-400 hidden sm:block" />
            </div>

            {/* Grid Area for Races */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {racesData.map((item) => {
                return (
                  <div 
                    key={item.name} 
                    className="bg-[#0f1422] rounded-[1.5rem] p-6 flex flex-col relative overflow-hidden border border-white/5 shadow-xl transition-transform hover:-translate-y-1"
                  >
                    {item.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg shadow-red-500/20 z-10 border border-white/10">
                        <PixelIcon name="tag" className="w-3 h-3" />
                        -{item.discount}%
                      </div>
                    )}
                    {item.isPopular && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg shadow-amber-500/20 z-10">
                        <PixelIcon name="fire" className="w-3 h-3 text-slate-950" />
                        POPULER
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 border ${item.bgClass}`}>
                      <PixelIcon name={item.iconName} className="w-5 h-5" />
                    </div>
                    <div className="mb-5">
                      <h3 className="font-black text-xl md:text-2xl text-white font-poppins tracking-wide leading-tight">
                        {item.badge}
                      </h3>
                      <p className="text-gray-400 font-medium text-sm mt-1">{item.duration}</p>
                    </div>
                    <div className="flex flex-col gap-4 mb-6 mt-auto">
                      <div className="flex justify-between items-end border-b border-white/5 pb-3">
                        <span className="text-gray-300 text-sm font-medium">Harga</span>
                        <div className="flex flex-col items-end">
                          {item.originalPrice && (
                            <span className="text-xs text-rose-400 line-through">Rp {item.originalPrice}</span>
                          )}
                          <span className="text-[#f2e28a] font-bold text-2xl">{item.price}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onAddToCart({ name: item.name, duration: item.duration, price: item.price, category: 'race' })}
                      className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ease-in-out text-sm active:scale-95 ${item.btnClass}`}
                    >
                      TAMBAH KE KERANJANG
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
