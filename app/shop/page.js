'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Heart, Loader2, Search, Filter, X } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext'; // <--- 1. Importar Contexto Wishlist
import toast from 'react-hot-toast';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // <--- 2. Usar Hooks da Wishlist

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.error('Erro:', error);
        toast.error('Erro ao carregar produtos');
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);
        const uniqueCategories = ['Todos', ...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'Todos') {
      result = result.filter(product => product.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-gold-500 uppercase tracking-widest text-xs font-bold">Catálogo Completo</span>
          <h1 className="font-serif text-3xl md:text-4xl text-ocean-950 mt-2 mb-4">Loja Online</h1>
          <div className="w-16 h-0.5 bg-ocean-100 mx-auto rounded-full"></div>
        </div>

        {/* Barra de Filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-24 z-30">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Procurar peças..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-sm text-ocean-950" />
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>)}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter size={20} className="text-slate-400 md:hidden flex-shrink-0 mr-2" />
            {categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-ocean-950 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{cat}</button>))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60"><Loader2 className="animate-spin text-brand" size={40} /></div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400"><p>Nenhum produto encontrado para a sua pesquisa.</p><button onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }} className="mt-4 text-brand font-bold hover:underline">Limpar Filtros</button></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  // 3. Verificar se é favorito para decidir o estilo do botão
                  const isFav = isInWishlist(product.id);
                  
                  return (
                    <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group block hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        
                        {/* BOTÃO FAVORITOS ATUALIZADO */}
                        <button 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            toggleWishlist(product); // Adicionar/Remover da BD
                          }} 
                          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all z-10 
                            ${isFav 
                              ? 'bg-[#C4A67C] text-white hover:bg-[#a58d56]' // Se for favorito: Fundo dourado
                              : 'bg-white/70 backdrop-blur-md text-ocean-900 hover:bg-white hover:text-red-500' // Senão: Branco normal
                            }`}
                        >
                          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>

                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-sm md:text-base text-ocean-950 truncate mb-1 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide mb-3">{product.category || 'Coleção'}</p>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                          <p className="text-ocean-950 font-medium">€{product.price}</p>
                          <button 
                            onClick={(e) => {
                              e.preventDefault(); 
                              addToCart(product);
                              toast.success((t) => (
                                <span className="flex flex-col">
                                  <span className="font-bold">Adicionado ao carrinho</span>
                                  <span className="text-xs text-slate-500">{product.name}</span>
                                </span>
                              ));
                            }}
                            className="p-2 bg-ocean-50 text-ocean-900 rounded-full group-hover:bg-ocean-950 group-hover:text-white transition-colors duration-300"
                          >
                            <ShoppingBag size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}