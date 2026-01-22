'use client';

import { useState, useEffect } from 'react';
import { Menu, Globe, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [language, setLanguage] = useState('pt');
  const [pathname, setPathname] = useState('/');

  // Obter o caminho atual (compatível com o ambiente de preview)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);
  
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

  // --- LÓGICA DE ESTILOS CORRIGIDA ---
  const getNavClasses = () => {
    if (isHomePage && !isScrolled) {
      return 'bg-transparent py-4 text-white drop-shadow-md';
    }
    return 'bg-white/95 backdrop-blur-md shadow-sm py-2 text-ocean-950';
  };

  const shouldInvertLogo = isHomePage && !isScrolled;
  const hoverClass = (isHomePage && !isScrolled) ? 'hover:bg-white/20' : 'hover:bg-slate-100';

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
          <a href="/">
            <img 
              src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
              alt="DeWhiteSun Logo" 
              className={`h-24 md:h-28 w-auto object-contain transition-all duration-300 hover:scale-105 drop-shadow-sm
                ${shouldInvertLogo ? 'brightness-0 invert' : ''} 
              `}
            />
          </a>
        </div>

        {/* Lado Direito: Apenas o Globo */}
        <div className="flex-1 flex justify-end items-center relative z-10 gap-2 md:gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`p-2 rounded-full transition-colors flex items-center gap-1 ${hoverClass}`}
            >
              <Globe size={24} strokeWidth={1.5} />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-32 animate-fade-in text-ocean-950">
                {['pt', 'en', 'fr'].map((lang) => (
                  <button key={lang} onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 uppercase font-bold">
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu Lateral (Drawer) */}
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
              { label: 'Loja', href: '/shop' },
              { label: 'Sobre Nós', href: '/about' },
              { label: 'Contato', href: '/contact' },
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={closeMenu}
                className="flex justify-between items-center p-4 text-ocean-950 hover:bg-slate-50 hover:pl-6 transition-all rounded-lg group"
              >
                <span className="font-serif text-lg">{link.label}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-gold-400" />
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100">
             <a href="/profile" onClick={closeMenu} className="block text-center bg-ocean-950 text-white py-3 rounded-lg font-bold uppercase text-sm tracking-widest hover:bg-ocean-800 transition-colors">
               A minha Conta
             </a>
          </div>
        </div>
      </div>
    </>
  );
}