'use client';

import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ocean-950 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Coluna 1: Marca */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl">DeWhiteSun</h3>
          <p className="text-ocean-100 text-sm font-light leading-relaxed">
            Inspirado na serenidade do oceano e na elegância do sol dourado. 
            Peças exclusivas para quem vive o verão o ano todo.
          </p>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-gold-400">Explorar</h4>
          <ul className="space-y-3 text-sm text-ocean-100 font-light">
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Nova Coleção</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Best Sellers</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Sobre Nós</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Diário de Bordo (Blog)</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Apoio ao Cliente */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-gold-400">Ajuda</h4>
          <ul className="space-y-3 text-sm text-ocean-100 font-light">
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Envios e Devoluções</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Guia de Tamanhos</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Perguntas Frequentes</Link></li>
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Contactos</Link></li>
          </ul>
        </div>

        {/* Coluna 4: Newsletter */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-gold-400">Newsletter</h4>
          <p className="text-ocean-100 text-xs mb-4 font-light">Receba novidades e ofertas exclusivas.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="O seu email" 
              className="bg-ocean-900 border border-ocean-800 text-white text-sm px-4 py-2 w-full rounded focus:outline-none focus:border-gold-400"
            />
            <button className="bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded text-white transition-colors">
              <Mail size={16} />
            </button>
          </div>
          <div className="flex gap-4 mt-6 text-ocean-200">
            <Instagram size={20} className="hover:text-gold-400 cursor-pointer transition-colors" />
            <Facebook size={20} className="hover:text-gold-400 cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-gold-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      <div className="border-t border-ocean-900 mt-16 pt-8 text-center text-ocean-400 text-xs font-light">
        <p>&copy; {new Date().getFullYear()} DeWhiteSun. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}