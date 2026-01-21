'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/app/context/CartContext';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast'; // <--- 1. Importar toast

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart(); 

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar produto:', error);
        toast.error('Erro ao carregar o produto.'); // Exemplo de erro
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-500">
        <p>Produto não encontrado.</p>
        <Link href="/" className="mt-4 text-brand font-bold">Voltar à Loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 animate-fade-in">
      {/* Barra Superior */}
      <div className="absolute top-0 left-0 p-4 z-20 w-full flex justify-between items-center">
        <Link href="/" className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg shadow-ocean-900/5 hover:scale-105 transition-all">
          <ArrowLeft size={24} className="text-ocean-950" />
        </Link>
        <button 
          onClick={() => toast.success('Adicionado aos favoritos!')} // <--- Toast nos favoritos
          className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg shadow-ocean-900/5 hover:scale-105 transition-all"
        >
          <Heart size={24} className="text-ocean-950 hover:text-red-500 hover:fill-red-500 transition-colors" />
        </button>
      </div>

      {/* Imagem */}
      <div className="h-[50vh] w-full bg-slate-100 relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Detalhes */}
      <div className="px-8 py-8 -mt-8 relative bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center text-center min-h-[50vh]">
        <div className="w-12 h-1 bg-slate-200 rounded-full mb-6"></div>

        {/* Categoria e Rating */}
        <div className="flex flex-col items-center mb-4 gap-2">
          <span className="inline-block px-3 py-1 bg-ocean-50 text-ocean-800 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-ocean-100">
            {product.category || 'Exclusivo'}
          </span>
          <div className="flex items-center text-gold-500 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200 fill-current'} />
            ))}
            <span className="text-xs font-bold text-slate-400 ml-1">({product.rating})</span>
          </div>
        </div>

        {/* Título */}
        <div className="flex items-center justify-center gap-3 mb-6 w-full relative">
          <h1 className="font-serif text-2xl md:text-3xl text-ocean-950 leading-tight">
            {product.name}
          </h1>
          <button 
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copiado!');
            }}
            className="absolute right-0 p-2 text-ocean-900/50 hover:text-ocean-900 transition-colors"
          >
            <Share2 size={22} />
          </button>
        </div>

        {/* Descrição */}
        <div className="mb-8 max-w-sm">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Descrição</h3>
          <p className="text-slate-600 leading-relaxed font-light text-sm">
            {product.description}
          </p>
        </div>

        {/* Rodapé Fixo */}
        <div className="w-full flex flex-col items-center pt-6 border-t border-slate-100 gap-4 mt-auto">
          <div className="flex flex-col items-center">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Preço</p>
            <p className="font-serif text-4xl text-ocean-950">€{product.price}</p>
          </div>
          
          <button 
            onClick={() => {
              addToCart(product);
              // 2. USAR TOAST AQUI - Notificação personalizada
              toast.success((t) => (
                <span className="flex flex-col">
                  <span className="font-bold">Adicionado ao carrinho</span>
                  <span className="text-xs text-slate-500">{product.name}</span>
                </span>
              ));
            }}
            className="w-full max-w-xs py-4 rounded-full flex items-center justify-center space-x-2 bg-ocean-950 hover:bg-ocean-800 shadow-xl shadow-ocean-900/20 active:scale-95 transition-all text-white"
          >
            <ShoppingBag size={18} />
            <span className="uppercase tracking-widest text-sm font-bold">Adicionar</span>
          </button>
        </div>

      </div>
    </div>
  );
}