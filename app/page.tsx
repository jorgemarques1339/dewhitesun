'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Heart, Loader2 } from 'lucide-react';

// Importar os Componentes
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Values from './components/Values'; // <--- IMPORTAR AQUI
// Footer removido daqui pois está no layout ou já não queres na home

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Erro:', error);
      else setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* 1. Banner Principal */}
      <Hero />

      {/* 2. NOSSOS VALORES (Inserido aqui) */}
      <Values />

      {/* 3. Lista de Produtos */}
      <div id="collection" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 mb-4">
            NOVOS LANÇAMENTOS
          </h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-500 font-light max-w-lg mx-auto">
            Peças selecionadas à mão para trazer a elegância do oceano até si.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-brand" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group block hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Adicionado aos favoritos!');
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/70 backdrop-blur-md rounded-full text-ocean-900 hover:bg-white hover:text-red-500 shadow-sm transition-all z-10"
                  >
                    <Heart size={16} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-sm md:text-base text-ocean-950 truncate mb-1 group-hover:text-gold-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide mb-3">
                    {product.category || 'Coleção'}
                  </p>
                  
                  <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                    <p className="text-ocean-950 font-medium">
                      €{product.price}
                    </p>
                    <div className="p-2 bg-ocean-50 text-ocean-900 rounded-full group-hover:bg-ocean-950 group-hover:text-white transition-colors duration-300">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
    </main>
  );
}