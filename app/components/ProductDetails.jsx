'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart, AlertCircle, Plus, Minus, Truck, ShieldCheck, Box, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

export default function ProductDetails({ product, relatedProducts = [] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return null;

  const isFav = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success((t) => (
        <span className="flex flex-col">
          <span className="font-bold">{quantity}x Adicionado ao carrinho</span>
          <span className="text-xs text-slate-500">{product.name}</span>
        </span>
      ));
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 animate-fade-in">
      {/* Barra Superior Flutuante */}
      <div className="absolute top-0 left-0 p-4 z-20 w-full flex justify-between items-center">
        <Link href="/" className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg shadow-ocean-900/5 hover:scale-105 transition-all">
          <ArrowLeft size={24} className="text-ocean-950" />
        </Link>
        <button 
          onClick={() => toggleWishlist(product)}
          className={`bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg shadow-ocean-900/5 hover:scale-105 transition-all ${isFav ? 'text-red-500' : 'text-ocean-950'}`}
        >
          <Heart size={24} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Imagem Principal */}
      <div className="h-[55vh] w-full bg-slate-100 relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-opacity ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        {isOutOfStock && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl z-10">
            Esgotado
          </div>
        )}
      </div>

      {/* Conteúdo do Produto */}
      <div className="px-6 -mt-12 relative z-10 max-w-3xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-50 text-center">
          
          <div className="w-16 h-1 bg-[#C4A67C] rounded-full mb-6 mx-auto"></div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-ocean-50 text-ocean-800 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-ocean-100 mb-3">
              {product.category || 'Exclusivo'}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-ocean-950 leading-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm mt-3">
               <div className="flex items-center text-gold-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200 fill-current'} />
                ))}
                <span className="text-xs font-bold text-slate-400 ml-1">({product.rating})</span>
              </div>
              {isLowStock && !isOutOfStock && (
                <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100 flex items-center gap-1">
                  <AlertCircle size={10} /> Últimas Unidades
                </span>
              )}
            </div>
          </div>

          {/* ABAS DE INFORMAÇÃO (Tabs) */}
          <div className="mb-8">
            <div className="flex justify-center border-b border-slate-100 mb-6">
              {[
                { id: 'description', label: 'Descrição' },
                { id: 'materials', label: 'Detalhes' },
                { id: 'shipping', label: 'Envio' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-[#C4A67C] text-ocean-950' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-slate-600 font-light text-sm leading-relaxed min-h-[80px]">
              
              {/* DESCRIÇÃO (Vem da BD) */}
              {activeTab === 'description' && (
                <p className="animate-fade-in">{product.description || "Sem descrição disponível."}</p>
              )}

              {/* MATERIAIS (BD ou Padrão) */}
              {activeTab === 'materials' && (
                <div className="animate-fade-in">
                  {product.materials ? (
                    <p>{product.materials}</p>
                  ) : (
                    // Fallback se não houver nada na BD
                    <ul className="space-y-2 text-left max-w-xs mx-auto">
                      <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#C4A67C]"/> Banhado a Ouro 18k</li>
                      <li className="flex items-center gap-2"><Box size={16} className="text-[#C4A67C]"/> Embalagem Sustentável</li>
                      <li className="flex items-center gap-2"><Star size={16} className="text-[#C4A67C]"/> Acabamento Manual</li>
                    </ul>
                  )}
                </div>
              )}

              {/* ENVIO (BD ou Padrão) */}
              {activeTab === 'shipping' && (
                <div className="animate-fade-in">
                  {product.shipping_info ? (
                    <p>{product.shipping_info}</p>
                  ) : (
                    // Fallback se não houver nada na BD
                    <div className="text-left max-w-xs mx-auto space-y-2">
                       <p className="flex items-center gap-2"><Truck size={16} className="text-[#C4A67C]"/> Envio Expresso (24h-48h)</p>
                       <p className="text-xs text-slate-400 pl-6">Entregas gratuitas acima de 50€.</p>
                       <p className="text-xs text-slate-400 pl-6">Devoluções gratuitas até 30 dias.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seletor de Quantidade */}
          {!isOutOfStock && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Quantidade</span>
              <div className="flex items-center bg-slate-50 rounded-full border border-slate-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-ocean-950"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-ocean-950">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 5, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-ocean-950"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12 mb-24">
          <h3 className="font-serif text-xl text-ocean-950 mb-6 text-center">Também pode gostar</h3>
          <div className="flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x">
            {relatedProducts.map((rel) => (
              <Link key={rel.id} href={`/product/${rel.id}`} className="min-w-[160px] snap-center group">
                <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden mb-3 relative shadow-sm">
                  <img src={rel.image_url} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="text-sm font-serif text-ocean-950 truncate">{rel.name}</h4>
                <p className="text-xs text-[#C4A67C] font-bold">€{rel.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé Fixo de Compra */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-40 md:hidden">
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider">Total</p>
                  <p className="font-serif text-2xl text-ocean-950">€{(product.price * quantity).toFixed(2)}</p>
              </div>
              
              <button 
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all text-white text-sm
                  ${isOutOfStock 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-ocean-950 hover:bg-ocean-800 shadow-ocean-900/20'
                  }`}
              >
                  <ShoppingBag size={18} />
                  <span className="uppercase tracking-widest font-bold">
                  {isOutOfStock ? 'Esgotado' : `Adicionar ${quantity > 1 ? `(${quantity})` : ''}`}
                  </span>
              </button>
          </div>
      </div>

      {/* Versão Desktop do Botão */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40">
         <button 
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`py-4 px-10 rounded-full flex items-center gap-3 shadow-2xl hover:scale-105 transition-all text-white font-bold uppercase tracking-widest
            ${isOutOfStock ? 'bg-slate-400' : 'bg-[#C4A67C] hover:bg-[#a58d56]'}`}
         >
            <ShoppingBag size={20} /> {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
         </button>
      </div>

    </div>
  );
}