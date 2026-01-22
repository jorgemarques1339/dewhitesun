'use client';

import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ocean-950 text-white pt-20 pb-10 border-t border-[#C4A67C]/30">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Coluna 1: Marca */}
        <div className="space-y-6">
          <div>
             <h3 className="font-serif text-3xl text-[#C4A67C]">DeWhiteSun</h3>
             <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mt-2 font-medium">Ocean Lifestyle</p>
          </div>
          <p className="text-ocean-100 text-sm font-light leading-relaxed max-w-xs opacity-80">
            Peças exclusivas inspiradas na serenidade do oceano e na elegância do sol dourado.
          </p>
          <div className="flex gap-4 text-ocean-200">
            <Instagram size={20} className="hover:text-[#C4A67C] cursor-pointer transition-colors" />
            <Facebook size={20} className="hover:text-[#C4A67C] cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-[#C4A67C] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Coluna 2: Explorar */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-white relative inline-block">
            Explorar
            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C4A67C]"></span>
          </h4>
          <ul className="space-y-3 text-sm text-ocean-100 font-light">
            <li><Link href="/shop" className="hover:text-[#C4A67C] transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-[#C4A67C] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Loja Online</Link></li>
            <li><Link href="/about" className="hover:text-[#C4A67C] transition-colors">A Nossa História</Link></li>
            <li><Link href="/contact" className="hover:text-[#C4A67C] transition-colors">Contactos</Link></li>
            <li><Link href="/profile" className="hover:text-[#C4A67C] transition-colors">Área de Cliente</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Apoio ao Cliente */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-white relative inline-block">
            Apoio ao Cliente
            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C4A67C]"></span>
          </h4>
          <ul className="space-y-3 text-sm text-ocean-100 font-light">
            <li><Link href="/legal/shipping" className="hover:text-[#C4A67C] transition-colors">Envios e Devoluções</Link></li>
            <li><Link href="/legal/terms" className="hover:text-[#C4A67C] transition-colors">Termos e Condições</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-[#C4A67C] transition-colors">Política de Privacidade</Link></li>
            <li><a href="https://www.livroreclamacoes.pt" target="_blank" className="hover:text-[#C4A67C] transition-colors">Livro de Reclamações</a></li>
          </ul>
        </div>

        {/* Coluna 4: Newsletter */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-white relative inline-block">
            Newsletter
            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C4A67C]"></span>
          </h4>
          <p className="text-ocean-100 text-xs mb-4 font-light opacity-80">Junte-se ao clube e receba as novidades em primeira mão.</p>
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="O seu email" 
              className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 w-full rounded-lg focus:outline-none focus:border-[#C4A67C] focus:bg-white/10 transition-all placeholder:text-white/30"
            />
            <button className="bg-[#C4A67C] hover:bg-[#a58d56] text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-[#C4A67C]/20">
              Subscrever
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ocean-400 font-light">
        <p>&copy; {new Date().getFullYear()} DeWhiteSun. Todos os direitos reservados.</p>
        <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="border border-white/20 px-2 py-1 rounded cursor-default">VISA</span>
            <span className="border border-white/20 px-2 py-1 rounded cursor-default">Mastercard</span>
            <span className="border border-white/20 px-2 py-1 rounded cursor-default">MBWay</span>
        </div>
      </div>
    </footer>
  );
}