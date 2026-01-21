'use client';

import { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Heart, Loader2, ArrowRight } from 'lucide-react';

// Importar os Componentes
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Values from './components/Values';

export default function Home() {
  // CORREÇÃO: Adicionado <any[]> para evitar erro de tipo nos produtos
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CORREÇÃO: Adicionado <HTMLDivElement> para evitar erro "Property does not exist on type 'never'"
  const carouselRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        // O "|| []" garante que não passamos null
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Lógica de Movimento Automático (Auto-Scroll)
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        // CORREÇÃO: Forçar o tipo HTMLElement para aceder ao offsetWidth sem erro
        const card = container.firstElementChild as HTMLElement;
        const cardWidth = card ? card.offsetWidth : 0;
        const gap = 24; // gap-6 do tailwind equivale a 24px
        
        // Verifica se chegou ao fim (com uma margem de erro pequena)
        const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

        if (isAtEnd) {
          // Se chegou ao fim, volta ao início suavemente
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Senão, desliza um cartão para a direita
          container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
      }
    }, 3000); // 3 segundos

    return () => clearInterval(interval); // Limpa o timer ao sair da página
  }, [loading]); // Recomeça quando o loading termina

  // SELEÇÃO EXCLUSIVA: Apenas os primeiros 4 produtos
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* 1. Banner Principal */}
      <Hero />

      {/* 2. NOSSOS VALORES */}
      <Values />

      {/* 3. Destaques (Carrossel Horizontal) */}
      {/* MUDANÇA: Reduzido py-24 para py-12 para diminuir o espaço */}
      <div id="collection" className="py-12 px-4 max-w-7xl mx-auto overflow-hidden">
        
        {/* CSS para esconder a barra de scroll e manter a elegância */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}</style>

        {/* Cabeçalho da Secção */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-5xl text-ocean-950 mt-3 mb-6">
            Novos Lançamentos
          </h2>
          <div className="w-24 h-1 bg-[#C4A67C] mx-auto rounded-full opacity-60"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-[#C4A67C]" size={32} />
          </div>
        ) : (
          <div className="relative">
            
            {/* CARROSSEL DE PRODUTOS */}
            <div 
              ref={carouselRef} // Ligar a referência aqui
              className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            >
              {featuredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.id}`}
                  // MUDANÇA AQUI: Reduzi de min-w-[85%] para min-w-[65%] em mobile
                  className="min-w-[65%] md:min-w-[350px] snap-center bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(196,166,124,0.15)] transition-all duration-500 group flex flex-col border border-slate-50"
                >
                  {/* Imagem */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F8F6]">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* Overlay suave ao passar o rato */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>

                    {/* Botão de Favoritos (Aparece no Hover em Desktop) */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Adicionado aos favoritos!');
                      }}
                      className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-[#C4A67C] opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-[#C4A67C] hover:text-white shadow-sm"
                    >
                      <Heart size={20} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Informação */}
                  <div className="p-6 flex flex-col flex-1 relative">
                    <div className="mb-2">
                       <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                         {product.category || 'Exclusivo'}
                       </span>
                    </div>
                    <h3 className="font-serif text-xl text-ocean-950 mb-2 group-hover:text-[#C4A67C] transition-colors leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-50">
                      <p className="text-ocean-950 font-medium text-lg">
                        €{product.price}
                      </p>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C4A67C] group-hover:underline decoration-[#C4A67C] underline-offset-4 flex items-center gap-1">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Link para a Loja Completa */}
            <div className="text-center mt-4">
              <Link 
                href="/shop" 
                className="inline-block bg-ocean-950 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C4A67C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Ver Toda a Coleção
              </Link>
            </div>

          </div>
        )}
      </div>
      
      {/* 4. Secção Sobre Nós / Manifesto (NOVA) */}
      {/* MUDANÇA: Reduzido py-24 para py-12 */}
      <section className="py-12 px-4 bg-[#F9F8F6]">
        <div className="max-w-4xl mx-auto text-center">
          
          <span className="text-[#C4A67C] uppercase tracking-[0.2em] text-xs font-bold">
            A Nossa História
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-ocean-950 mt-3 mb-10">
            Sobre a DeWhiteSun
          </h2>

          {/* Manifesto Card (Layout Luxuoso Igual à página Sobre) */}
          <div className="p-10 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-[#EBE8E0] relative overflow-hidden mb-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C4A67C] to-transparent"></div>
            <p className="font-serif text-2xl text-ocean-950 italic mb-4 leading-relaxed">
              "Criamos para a mulher que carrega o verão na alma, independentemente da estação do ano."
            </p>
          </div>

          <p className="text-slate-600 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Não nascemos numa sala de reuniões, mas sim na beira da água. 
            Descubra como transformamos a serenidade do oceano em peças eternas.
          </p>

          <Link 
            href="/about" 
            className="inline-block bg-ocean-950 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C4A67C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Conheça a Marca
          </Link>
        </div>
      </section>

    </main>
  );
}