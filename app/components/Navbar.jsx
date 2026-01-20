'use client';

import { useState, useEffect } from 'react';
import { Menu, Globe, ShoppingBag, X, ChevronRight } from 'lucide-react'; // Adicionei X e ChevronRight
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Novo estado para o menu

  // Detetar o Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar o menu ao clicar num link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md py-2 text-ocean-950' 
            : 'bg-transparent py-6 text-white' 
          }`}
      >
        
        {/* Botão Menu (Hambúrguer) */}
        <div className="flex-1 flex justify-start relative z-10">
          <button 
            onClick={() => setIsMenuOpen(true)} // Abre o menu
            className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'}`}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logotipo */}
        <div className="relative z-10 flex-shrink-0 mx-2">
          <Link href="/">
            <img 
              src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
              alt="DeWhiteSun Logo" 
              className={`h-12 w-auto object-contain transition-all duration-300
                ${isScrolled ? '' : 'brightness-0 invert'} 
              `}
            />
          </Link>
        </div>

        {/* Lado Direito */}
        <div className="flex-1 flex justify-end items-center relative z-10 gap-3">
          <Link 
            href="/profile" 
            className={`p-2 rounded-full transition-colors hidden md:block ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'}`}
          >
            <Globe size={20} />
          </Link>
          
          <Link 
            href="/cart" 
            className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-white/20'}`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* --- MENU LATERAL (OVERLAY) --- */}
      
      {/* Fundo Escuro (clicar aqui fecha o menu) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={closeMenu}
      ></div>

      {/* A Barra Lateral Branca */}
      <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[60] shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 flex flex-col h-full">
          {/* Cabeçalho do Menu */}
          <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
            <span className="font-serif text-xl text-ocean-950">Menu</span>
            <button onClick={closeMenu} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* Links de Navegação */}
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

          {/* Rodapé do Menu */}
          <div className="mt-auto pt-8 border-t border-slate-100">
             <Link href="/profile" onClick={closeMenu} className="block text-center bg-ocean-950 text-white py-3 rounded-lg font-bold uppercase text-sm tracking-widest">
               A minha Conta
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}