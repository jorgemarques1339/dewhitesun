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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 py-4 px-6 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-2xl">
        
        <Link href="/" className="flex flex-col items-center gap-1 group w-16">
          <Home size={24} className={`transition-all duration-300 ${isActive('/') ? 'text-ocean-950 scale-110' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-medium ${isActive('/') ? 'text-ocean-950' : 'text-slate-400'}`}>Início</span>
        </Link>

        <Link href="/#collection" className="flex flex-col items-center gap-1 group w-16">
          <Store size={24} className="text-slate-400 group-hover:text-ocean-800 transition-all duration-300" />
          <span className="text-[10px] font-medium text-slate-400">Loja</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-1 group w-16">
          <User size={24} className={`transition-all duration-300 ${isActive('/profile') ? 'text-ocean-950 scale-110' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-medium ${isActive('/profile') ? 'text-ocean-950' : 'text-slate-400'}`}>Perfil</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center gap-1 group relative w-16">
          <div className="relative">
            <ShoppingBag size={24} className={`transition-all duration-300 ${isActive('/cart') ? 'text-ocean-950 scale-110' : 'text-slate-400'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium ${isActive('/cart') ? 'text-ocean-950' : 'text-slate-400'}`}>Carrinho</span>
        </Link>

      </div>
    </div>
  );
}