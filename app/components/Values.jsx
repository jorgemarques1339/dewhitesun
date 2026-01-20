'use client';

import { Gem, Droplets, ShieldCheck } from 'lucide-react';

export default function Values() {
  const values = [
    {
      icon: <Gem size={32} strokeWidth={1.5} />,
      title: "Qualidade Premium",
      description: "Tudo feito de maneira artesanal e produtos premium."
    },
    {
      icon: <Droplets size={32} strokeWidth={1.5} />,
      title: "Alma Oceânica",
      description: "Design inspirado na fluidez das ondas, trazendo a calma do mar para o seu dia a dia."
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Confiança Absoluta",
      description: "Garantia de satisfação em cada detalhe e pagamentos 100% seguros."
    }
  ];

  return (
    // Fundo Bege Claro (#F9F8F6) para o ar luxuoso e clean
    <section className="bg-[#F9F8F6] py-24 relative overflow-hidden">
      
      {/* Elemento decorativo de fundo (círculo subtil) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabeçalho da Secção */}
        <div className="text-center mb-16">
          <h2 className="text-[17px] font-bold tracking-[0.3em] text-[#C4A67C] uppercase">
            OS NOSSOS VALORES
          </h2>
        </div>

        {/* Grid de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {values.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              
              {/* Círculo do Ícone: Branco com borda dourada subtil */}
              <div className="mb-6 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-[#C4A67C] border border-[#F0EBE0] group-hover:border-[#C4A67C] group-hover:scale-110 transition-all duration-500 ease-out">
                {item.icon}
              </div>
              
              <h3 className="font-serif text-xl mb-3 text-ocean-950 group-hover:text-[#C4A67C] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs font-light">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}