import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    // MUDANÇA: Reduzi de h-[90vh] para h-[60vh] para tornar o banner mais pequeno
    <section className="relative h-[60vh] w-full overflow-hidden">
      {/* Imagem de Fundo */}
      <div className="absolute inset-0">
        {/* IMPORTANTE: 
           Certifica-te que guardaste a imagem gerada na pasta 'public' 
           do teu projeto com o nome 'hero-ocean.jpg'.
        */}
        <img 
          src="/hero-ocean.jpg" 
          alt="Nova Coleção Oceano" 
          className="w-full h-full object-cover"
        />
        {/* Overlay Escura (Gradiente) para o texto se ler melhor */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      </div>

      {/* Conteúdo de Texto */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white mt-4">
        
        <span className="uppercase tracking-[0.4em] text-xs md:text-sm mb-4 animate-fade-in font-medium text-gold-400 drop-shadow-md">
          Edição Limitada
        </span>
        
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-down drop-shadow-lg">
          Nova Coleção <br />
          <span className="italic font-light">2026</span>
        </h1>
        
        <p className="max-w-md text-sm md:text-base font-light mb-8 text-white/90 animate-fade-in drop-shadow-md leading-relaxed">
          Mergulhe na elegância
        </p>
        <p className="max-w-md text-sm md:text-base font-light mb-8 text-white/90 animate-fade-in drop-shadow-md leading-relaxed">
          Peças sustentavéis inspiradas no Oceano.
        </p>
        <button 
          onClick={() => {
            const element = document.getElementById('collection');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-ocean-950 transition-all transform hover:scale-105 shadow-xl"
        >
          Descobrir Peças
        </button>
      </div>

      {/* Seta a indicar para baixo - Ajustada a posição */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/80">
        <ArrowDown size={24} strokeWidth={1.5} />
      </div>
    </section>
  );
}