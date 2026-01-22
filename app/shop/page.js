'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Heart, Loader2, Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import toast from 'react-hot-toast';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState(['Todos']);
  const [sortBy, setSortBy] = useState('newest'); 
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [showFilters, setShowFilters] = useState(false); 

  // Contextos
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 1. Buscar produtos ao Supabase
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
        
        if (data.length > 0) {
          const maxPrice = Math.max(...data.map(p => p.price));
          setPriceRange(prev => ({ ...prev, max: Math.ceil(maxPrice) }));
        }
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // 2. Lógica Central de Filtragem e Ordenação
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'Todos') {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products, sortBy, priceRange.min, priceRange.max]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <span className="text-[#C4A67C] uppercase tracking-widest text-xs font-bold">
            Catálogo Completo
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-ocean-950 mt-2 mb-4">
            Loja Online
          </h1>
          <div className="w-16 h-0.5 bg-ocean-100 mx-auto rounded-full"></div>
        </div>

        {/* --- BARRA DE FERRAMENTAS --- */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-24 z-30">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Pesquisa */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Procurar peça..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C4A67C] text-sm text-ocean-950"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>
              )}
            </div>

            {/* Filtros Mobile Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <SlidersHorizontal size={14} /> Filtros & Ordenação
            </button>

            {/* Controlos Desktop e Mobile Expandido */}
            <div className={`flex-col md:flex-row gap-4 w-full md:w-auto items-center ${showFilters ? 'flex' : 'hidden md:flex'}`}>
              
              {/* Categorias */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-ocean-950 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Ordenação */}
              <div className="relative w-full md:w-auto">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-auto appearance-none bg-slate-50 border border-slate-200 text-ocean-950 text-xs font-bold uppercase tracking-wide py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#C4A67C]"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price_asc">Preço: Menor - Maior</option>
                  <option value="price_desc">Preço: Maior - Menor</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Filtro de Preço (Expandível) */}
          {/* CORREÇÃO: Removida a condição '|| window.innerWidth' que causava erro no build */}
          <div className={`mt-4 pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in ${showFilters ? 'block' : 'hidden md:grid'}`}>
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Preço:</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                      className="w-20 p-1 text-xs border border-slate-200 rounded text-center text-ocean-950"
                      placeholder="Min"
                    />
                    <span className="text-slate-300">-</span>
                    <input 
                      type="number" 
                      min="0" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                      className="w-20 p-1 text-xs border border-slate-200 rounded text-center text-ocean-950"
                      placeholder="Max"
                    />
                  </div>
               </div>
               <div className="flex justify-end items-center">
                  <p className="text-xs text-slate-400">
                    A mostrar <span className="font-bold text-ocean-950">{filteredProducts.length}</span> produtos
                  </p>
               </div>
          </div>

        </div>

        {/* Loading ou Grid de Produtos */}
        {loading ? (
          <div className="flex justify-center items-center h-60"><Loader2 className="animate-spin text-[#C4A67C]" size={40} /></div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="mb-4">Nenhum produto corresponde aos filtros.</p>
                <button 
                  onClick={() => { 
                    setSearchQuery(''); 
                    setSelectedCategory('Todos'); 
                    setPriceRange({min: 0, max: 2000}); 
                    setSortBy('newest'); 
                  }}
                  className="text-[#C4A67C] font-bold hover:underline text-sm uppercase tracking-widest"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const isFav = isInWishlist(product.id);
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`} 
                      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group block hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isOutOfStock ? 'opacity-75' : ''}`}
                    >
                      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                        {/* Imagem com next/image para otimização */}
                        <Image 
                          src={product.image_url} 
                          alt={product.name}
                          fill
                          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        
                        <button 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            toggleWishlist(product); 
                          }} 
                          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all z-10 
                            ${isFav ? 'bg-[#C4A67C] text-white' : 'bg-white/70 backdrop-blur-md text-ocean-900 hover:bg-white hover:text-red-500'}`}
                        >
                          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>
                        
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="bg-black/70 text-white text-[10px] font-bold uppercase px-3 py-1 rounded backdrop-blur-sm">Esgotado</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-serif text-sm md:text-base text-ocean-950 truncate mb-1 group-hover:text-[#C4A67C] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide mb-3">
                          {product.category || 'Coleção'}
                        </p>
                        
                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                          <p className="text-ocean-950 font-medium">€{product.price}</p>
                          <button 
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.preventDefault(); 
                              if (!isOutOfStock) {
                                addToCart(product);
                                toast.success((t) => (
                                  <span className="flex flex-col"><span className="font-bold">Adicionado ao carrinho</span><span className="text-xs text-slate-500">{product.name}</span></span>
                                ));
                              }
                            }}
                            className={`p-2 rounded-full transition-colors duration-300 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-ocean-50 text-ocean-900 group-hover:bg-ocean-950 group-hover:text-white'}`}
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