'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { Check, ChevronRight, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Resumo, 2: Morada, 3: Pagamento
  const { cart, cartTotal } = useCart();
  const { profile } = useAuth(); // Buscar morada salva se existir
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Dados do formulário (preenche com o perfil se existir)
  const [shippingData, setShippingData] = useState({
    name: '', address: '', city: '', zip: ''
  });

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
    // Aqui chamamos a API Route que criaste antes
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    else setLoadingPayment(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Barra de Progresso */}
        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
            {[1, 2, 3].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-ocean-950 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {step > s ? <Check size={14} /> : s}
                </div>
            ))}
        </div>

        {/* PASSO 1: RESUMO */}
        {step === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
                <h2 className="font-serif text-xl mb-4">1. Rever Carrinho</h2>
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between py-2 border-b border-slate-50">
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="font-bold">€{item.price * item.quantity}</span>
                    </div>
                ))}
                <div className="flex justify-between mt-4 text-xl font-serif">
                    <span>Total</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => setStep(2)} className="w-full mt-6 bg-ocean-950 text-white py-3 rounded-lg flex justify-center items-center gap-2">
                    Continuar para Envio <ChevronRight size={16} />
                </button>
            </div>
        )}

        {/* PASSO 2: MORADA */}
        {step === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in">
                <h2 className="font-serif text-xl mb-4">2. Morada de Envio</h2>
                <div className="space-y-3">
                    <input placeholder="Nome" value={shippingData.name} onChange={e=>setShippingData({...shippingData, name:e.target.value})} className="w-full p-3 border rounded-lg" />
                    <input placeholder="Morada" value={shippingData.address} onChange={e=>setShippingData({...shippingData, address:e.target.value})} className="w-full p-3 border rounded-lg" />
                    <div className="flex gap-2">
                        <input placeholder="Cidade" value={shippingData.city} onChange={e=>setShippingData({...shippingData, city:e.target.value})} className="w-full p-3 border rounded-lg" />
                        <input placeholder="CP" value={shippingData.zip} onChange={e=>setShippingData({...shippingData, zip:e.target.value})} className="w-full p-3 border rounded-lg" />
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 py-3 rounded-lg">Voltar</button>
                    <button onClick={() => setStep(3)} className="w-2/3 bg-ocean-950 text-white py-3 rounded-lg flex justify-center items-center gap-2">
                        Confirmar Morada <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}

        {/* PASSO 3: PAGAMENTO */}
        {step === 3 && (
            <div className="bg-white p-6 rounded-xl shadow-sm animate-fade-in text-center">
                <h2 className="font-serif text-xl mb-4">3. Pagamento Seguro</h2>
                <div className="bg-green-50 p-4 rounded-lg mb-6 text-green-800 text-sm">
                    <Lock size={16} className="inline mr-2" />
                    Os seus dados serão processados de forma segura pela Stripe.
                </div>
                <div className="text-left mb-6 text-sm text-slate-500">
                    <p><strong className="text-ocean-950">Enviar para:</strong> {shippingData.name}</p>
                    <p>{shippingData.address}, {shippingData.city}</p>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 py-3 rounded-lg">Voltar</button>
                    <button onClick={handlePayment} disabled={loadingPayment} className="w-2/3 bg-ocean-950 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2">
                        {loadingPayment ? 'A processar...' : `Pagar €${cartTotal.toFixed(2)}`}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}