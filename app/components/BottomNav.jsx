'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-ocean-100/30 py-3 pb-safe px-6 z-50 shadow-[0_-10px_40px_-15px_rgba(186,230,253,0.3)] overflow-hidden bg-white/95 backdrop-blur-xl">
      
      {/* --- CSS das Ondas --- */}
      <style jsx>{`
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(
            to top,
            rgba(224, 242, 254, 0.4) 0%,
            rgba(255, 255, 255, 0.98) 100%
          );
          pointer-events: none;
        }
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background-repeat: repeat-x;
          background-position: 0 bottom;
          transform-origin: center bottom;
        }
        .wave-back {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2338bdf8' fill-opacity='0.4'/%3E%3C/svg%3E");
          background-size: 50% 100%;
          animation: moveWave 20s linear infinite;
          opacity: 0.6;
          z-index: 1;
        }
        .wave-front {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%237dd3fc' fill-opacity='0.5'/%3E%3C/svg%3E");
          background-size: 50% 100%;
          animation: moveWave 12s linear infinite reverse;
          z-index: 2;
          height: 100%;
        }
        @keyframes moveWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="wave-container">
        <div className="wave wave-back"></div>
        <div className="wave wave-front"></div>
      </div>

      <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-2xl relative z-10">
        
        {/* 1. INÍCIO */}
        <Link href="/" className="flex flex-col items-center gap-1 group w-16 py-1">
          <Home 
            size={28} 
            className={`transition-all duration-300 ${isActive('/') ? 'text-ocean-950 fill-ocean-950/10 scale-110' : 'text-slate-400/80 group-hover:text-ocean-800 group-hover:scale-105'}`} 
            strokeWidth={isActive('/') ? 2.5 : 2}
          />
          <span className={`text-[11px] font-medium transition-colors ${isActive('/') ? 'text-ocean-950' : 'text-slate-400/80'}`}>
            Início
          </span>
        </Link>

        {/* 2. LOJA - Redireciona para /shop */}
        <Link href="/shop" className="flex flex-col items-center gap-1 group w-16 py-1">
          <Store 
            size={28} 
            className={`transition-all duration-300 ${isActive('/shop') ? 'text-ocean-950 fill-ocean-950/10 scale-110' : 'text-slate-400/80 group-hover:text-ocean-800 group-hover:scale-105'}`} 
            strokeWidth={isActive('/shop') ? 2.5 : 2}
          />
          <span className={`text-[11px] font-medium transition-colors ${isActive('/shop') ? 'text-ocean-950' : 'text-slate-400/80'}`}>
            Loja
          </span>
        </Link>

        {/* 3. PERFIL */}
        <Link href="/profile" className="flex flex-col items-center gap-1 group w-16 py-1">
          <User 
            size={28} 
            className={`transition-all duration-300 ${isActive('/profile') ? 'text-ocean-950 fill-ocean-950/10 scale-110' : 'text-slate-400/80 group-hover:text-ocean-800 group-hover:scale-105'}`} 
            strokeWidth={isActive('/profile') ? 2.5 : 2}
          />
          <span className={`text-[11px] font-medium transition-colors ${isActive('/profile') ? 'text-ocean-950' : 'text-slate-400/80'}`}>
            Perfil
          </span>
        </Link>

        {/* 4. CARRINHO */}
        <Link href="/cart" className="flex flex-col items-center gap-1 group relative w-16 py-1">
          <div className="relative">
            <ShoppingBag 
              size={28} 
              className={`transition-all duration-300 ${isActive('/cart') ? 'text-ocean-950 fill-ocean-950/10 scale-110' : 'text-slate-400/80 group-hover:text-ocean-800 group-hover:scale-105'}`} 
              strokeWidth={isActive('/cart') ? 2.5 : 2}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-medium transition-colors ${isActive('/cart') ? 'text-ocean-950' : 'text-slate-400/80'}`}>
            Carrinho
          </span>
        </Link>

      </div>
    </div>
  );
}