'use client';

import { useState, useEffect } from 'react';
import { Menu, Globe, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Detetar o Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // --- LÓGICA DE ESTILOS ---
  const getNavClasses = () => {
    if (isHomePage) {
      return isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 text-ocean-950' // Ao descer
        : 'bg-transparent py-4 text-white drop-shadow-md'; // No topo
    }
    // Outras páginas
    return 'bg-ocean-950 py-4 text-white shadow-md';
  };

  const hoverClass = (isHomePage && isScrolled) ? 'hover:bg-slate-100' : 'hover:bg-white/20';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out ${getNavClasses()}`}
      >
        
        {/* Lado Esquerdo: Menu */}
        <div className="flex-1 flex justify-start relative z-10">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`p-2 rounded-full transition-colors ${hoverClass}`}
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Centro: Logotipo */}
        <div className="relative z-10 flex-shrink-0 mx-2">
          <Link href="/">
            <img 
              src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
              alt="DeWhiteSun Logo" 
              className="h-24 md:h-28 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm"
            />
          </Link>
        </div>

        {/* Lado Direito: Apenas o Globo (Perfil) */}
        <div className="flex-1 flex justify-end items-center relative z-10 gap-2 md:gap-3">
          <Link 
            href="/profile" 
            className={`p-2 rounded-full transition-colors ${hoverClass}`}
          >
            <Globe size={24} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* --- MENU LATERAL (DRAWER) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={closeMenu}
      ></div>

      <div className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[60] shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
            <span className="font-serif text-xl text-ocean-950">Menu</span>
            <button onClick={closeMenu} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            {[
              { label: 'Início', href: '/' },
              { label: 'Loja', href: '/#collection' },
              { label: 'Sobre Nós', href: '/about' },
              { label: 'Contato', href: '/contact' },
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                onClick={closeMenu}
                className="flex justify-between items-center p-4 text-ocean-950 hover:bg-slate-50 hover:pl-6 transition-all rounded-lg group"
              >
                <span className="font-serif text-lg">{link.label}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-gold-400" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100">
             <Link href="/profile" onClick={closeMenu} className="block text-center bg-ocean-950 text-white py-3 rounded-lg font-bold uppercase text-sm tracking-widest hover:bg-ocean-800 transition-colors">
               A minha Conta
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}