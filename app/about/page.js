'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Leaf, Anchor, Sun } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] pb-24">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* LOGÓTIPO EM DESTAQUE */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <img 
            src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
            alt="DeWhiteSun Logo" 
            className="h-32 w-auto object-contain mb-6 drop-shadow-sm"
          />
          <div className="w-16 h-1 bg-[#C4A67C] rounded-full"></div>
        </div>

        {/* TEXTO INSPIRADOR */}
        <div className="prose prose-slate mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-ocean-950 mb-8 leading-tight">
            Onde o Sol encontra o Mar.
          </h1>
          
          <div className="text-slate-600 font-light leading-relaxed space-y-6 text-lg">
            <p>
              A <strong>DeWhiteSun</strong> não nasceu numa sala de reuniões, mas sim na beira da água, onde o dourado do sol toca a espuma das ondas. Somos inspirados pela serenidade, pela força e pela beleza intemporal do oceano.
            </p>
            <p>
              Acreditamos que o verdadeiro luxo reside na natureza. Cada peça que desenhamos procura capturar um fragmento dessa magia: a textura da areia, o brilho de uma concha ou o azul profundo do Atlântico.
            </p>
          </div>

          {/* CITAÇÃO */}
          <div className="my-16 p-10 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-[#EBE8E0] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C4A67C] to-transparent"></div>
            <p className="font-serif text-2xl text-ocean-950 italic mb-4">
              "Criamos para a mulher que carrega o verão na alma, independentemente da estação do ano."
            </p>
            <p className="text-xs font-bold tracking-widest text-[#C4A67C] uppercase">
              — Manifesto DeWhiteSun
            </p>
          </div>

          {/* COMPROMISSO SUSTENTABILIDADE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-full shadow-sm text-[#C4A67C] mb-4">
                <Leaf size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-ocean-950 mb-2">Eco-Consciente</h3>
              <p className="text-sm text-slate-500">
                Respeitamos o oceano que nos inspira. Utilizamos materiais éticos e embalagens reduzidas.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-full shadow-sm text-[#C4A67C] mb-4">
                <Anchor size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-ocean-950 mb-2">Artesanal</h3>
              <p className="text-sm text-slate-500">
                Fugimos da produção em massa. Cada peça tem o toque humano e a atenção ao detalhe.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-full shadow-sm text-[#C4A67C] mb-4">
                <Sun size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-ocean-950 mb-2">Durabilidade</h3>
              <p className="text-sm text-slate-500">
                Produtos de alta qualidade para que o seu brilho dure tanto quanto as suas memórias.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}