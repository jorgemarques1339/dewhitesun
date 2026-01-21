'use client';

import { useCart } from '@/app/context/CartContext';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />

      <div className="pt-28 px-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ocean-950 mb-6">O teu Carrinho</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 mb-6">O carrinho está vazio.</p>
            {/* MUDANÇA: href="/" alterado para href="/shop" */}
            <Link href="/shop" className="text-brand font-bold uppercase tracking-widest text-sm hover:underline">
              Explorar Coleção
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lista de Produtos */}
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                
                {/* Imagem */}
                <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Detalhes */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-ocean-950 text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    {/* Controlador de Quantidade */}
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:text-brand"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:text-brand"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="font-bold text-ocean-950">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Resumo e Botão para Checkout */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 uppercase tracking-widest text-xs">Total Estimado</span>
                <span className="font-serif text-3xl text-ocean-950">€{cartTotal.toFixed(2)}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-ocean-800 transition-all shadow-xl shadow-ocean-900/20 active:scale-95"
              >
                Finalizar Compra <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}