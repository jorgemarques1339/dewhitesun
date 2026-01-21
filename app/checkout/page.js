'use client';

// 1. A IMPORTAÇÃO FUNDAMENTAL QUE FALTAVA
import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { Check, ChevronRight, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Resumo, 2: Morada, 3: Pagamento
  const { cart, cartTotal } = useCart();
  const { user, profile, loading } = useAuth();
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Dados do formulário
  const [shippingData, setShippingData] = useState({
    name: '', address: '', city: '', zip: ''
  });

  // Preencher morada se o utilizador tiver perfil
  useEffect(() => {
    if (profile) {
      setShippingData({
        name: profile.full_name || '',
        address: profile.address || '',
        city: profile.city || '',
        zip: profile.zip_code || ''
      });
    }
  }, [profile]);

  // Função Final: Chamar Stripe
  const handlePayment = async () => {
    setLoadingPayment(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erro ao iniciar pagamento.");
        setLoadingPayment(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão.");
      setLoadingPayment(false);
    }
  };

  // Se o carrinho estiver vazio e não estiver a carregar, manda de volta
  if (!loading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center pt-20">
            <p className="text-slate-500 mb-4">O carrinho está vazio.</p>
            <Link href="/shop" className="text-brand font-bold uppercase tracking-widest text-xs hover:underline">
            Voltar à Loja
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />

      <div className="pt-32 px-4 max-w-2xl mx-auto">
        
        {/* Cabeçalho com Link de Voltar */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-400" />
          </Link>
          <h1 className="font-serif text-3xl text-ocean-950">Checkout Seguro</h1>
        </div>
        
        {/* Barra de Progresso */}
        <div className="flex justify-between mb-10 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
            {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50 transition-colors ${step >= s ? 'bg-ocean-950 text-white' : 'bg-slate-200 text-slate-500'}`}
                >
                    {step > s ? <Check size={14} /> : s}
                </div>
            ))}
        </div>

        {/* CONTEÚDO DOS PASSOS */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          
          {/* PASSO 1: RESUMO */}
          {step === 1 && (
              <div className="animate-fade-in">
                  <h2 className="font-serif text-xl mb-6 text-ocean-950">1. Rever Encomenda</h2>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-ocean-950">{item.name}</p>
                                <p className="text-xs text-slate-400">Qtd: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-ocean-950">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-8">
                      <span className="text-slate-500 uppercase tracking-widest text-xs">Total a Pagar</span>
                      <span className="font-serif text-2xl text-ocean-950">€{cartTotal.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-ocean-800 transition-all shadow-lg"
                  >
                      Continuar para Envio <ChevronRight size={16} />
                  </button>
              </div>
          )}

          {/* PASSO 2: MORADA */}
          {step === 2 && (
              <div className="animate-fade-in">
                  <h2 className="font-serif text-xl mb-6 text-ocean-950">2. Dados de Envio</h2>
                  
                  {!user && (
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm flex gap-2 items-center">
                      <Lock size={16} />
                      <div>
                        <Link href="/login" className="underline font-bold">Faça login</Link> para carregar a sua morada.
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Nome Completo</label>
                        <input placeholder="Ex: Maria Silva" value={shippingData.name} onChange={e=>setShippingData({...shippingData, name:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Morada</label>
                        <input placeholder="Rua, Nº, Andar" value={shippingData.address} onChange={e=>setShippingData({...shippingData, address:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Cidade</label>
                            <input placeholder="Lisboa" value={shippingData.city} onChange={e=>setShippingData({...shippingData, city:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand" />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Código Postal</label>
                            <input placeholder="1000-000" value={shippingData.zip} onChange={e=>setShippingData({...shippingData, zip:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand" />
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                      <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Voltar</button>
                      <button 
                        onClick={() => {
                          if(!shippingData.name || !shippingData.address) return toast.error('Preencha os dados obrigatórios');
                          setStep(3);
                        }} 
                        className="flex-1 bg-ocean-950 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-ocean-800 transition-all shadow-lg"
                      >
                          Confirmar Morada <ChevronRight size={16} />
                      </button>
                  </div>
              </div>
          )}

          {/* PASSO 3: PAGAMENTO */}
          {step === 3 && (
              <div className="animate-fade-in text-center">
                  <h2 className="font-serif text-xl mb-6 text-ocean-950">3. Pagamento Seguro</h2>
                  
                  <div className="bg-green-50 border border-green-100 p-4 rounded-xl mb-8 text-green-800 text-sm">
                      <div className="flex justify-center mb-2"><Lock size={24} /></div>
                      <p>Você será redirecionado para a página segura da Stripe para concluir o pagamento.</p>
                  </div>

                  <div className="text-left bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Enviar para:</p>
                      <p className="font-medium text-ocean-950">{shippingData.name}</p>
                      <p className="text-sm text-slate-600">{shippingData.address}</p>
                      <p className="text-sm text-slate-600">{shippingData.zip} {shippingData.city}</p>
                  </div>
                  
                  <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Voltar</button>
                      <button 
                        onClick={handlePayment} 
                        disabled={loadingPayment} 
                        className="flex-1 bg-[#C4A67C] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-[#a58d56] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                          {loadingPayment ? (
                            <><Loader2 className="animate-spin" size={18}/> A processar...</>
                          ) : (
                            `Pagar €${cartTotal.toFixed(2)}`
                          )}
                      </button>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}