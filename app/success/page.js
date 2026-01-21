'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext'; // Importar contexto do carrinho
import { supabase } from '@/lib/supabase'; // Importar cliente Supabase

export default function SuccessPage() {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const processing = useRef(false); // Ref para evitar dupla execução (comum em React)
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'

  useEffect(() => {
    async function processOrder() {
      // Validações de segurança:
      // 1. Temos utilizador?
      // 2. O carrinho tem coisas? (Evita gravar encomendas vazias num refresh)
      // 3. Já estamos a processar?
      if (!user || cart.length === 0 || processing.current) {
        // Se o carrinho estiver vazio mas o status ainda for processing, 
        // provavelmente é um refresh da página após compra.
        if (cart.length === 0 && !processing.current) {
           // Opcional: Podes redirecionar para a home ou mostrar mensagem diferente
        }
        return;
      }
      
      processing.current = true;
      console.log("A iniciar processamento da encomenda...");

      try {
        // PASSO 1: Gravar a Encomenda (Cabeçalho)
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total: cartTotal,
            status: 'Pago', // Estado inicial
            shipping_address: {} // Podes expandir isto com os dados do checkout se os guardares num contexto
          })
          .select()
          .single();

        if (orderError) throw orderError;

        console.log("Encomenda criada com ID:", order.id);

        // PASSO 2: Gravar os Itens da Encomenda
        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // PASSO 3: Enviar Email de Confirmação
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            subject: `Encomenda Confirmada #${order.id.slice(0,8)} 📦`,
            html: `
              <div style="font-family: sans-serif; color: #0f172a;">
                <h1 style="color: #C4A67C;">Obrigado pela sua encomenda!</h1>
                <p>O pagamento de <strong>€${cartTotal.toFixed(2)}</strong> foi confirmado.</p>
                <p>A sua encomenda <strong>#${order.id.slice(0,8)}</strong> está a ser processada.</p>
                <br/>
                <p style="font-size: 12px; color: #888;">Equipa DeWhiteSun</p>
              </div>
            `
          })
        });

        // PASSO 4: Limpar Carrinho e Mostrar Sucesso
        clearCart();
        setStatus('success');

      } catch (error) {
        console.error("Erro crítico ao processar encomenda:", error);
        setStatus('error');
      }
    }

    processOrder();
  }, [user, cart, cartTotal, clearCart]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      
      {/* ESTADO: PROCESSANDO */}
      {status === 'processing' && (
        <>
          <Loader2 size={64} className="text-brand animate-spin mb-6" />
          <h1 className="font-serif text-2xl text-ocean-950 mb-2">A registar a sua encomenda...</h1>
          <p className="text-slate-500 text-sm">Por favor, aguarde e não feche a janela.</p>
        </>
      )}

      {/* ESTADO: SUCESSO */}
      {status === 'success' && (
        <div className="animate-fade-in">
          <CheckCircle size={64} className="text-green-500 mb-6 mx-auto animate-bounce" />
          <h1 className="font-serif text-4xl text-ocean-950 mb-4">Pagamento Confirmado!</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            A sua encomenda foi gravada com sucesso. Enviámos um email com os detalhes.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link href="/profile" className="bg-white border border-ocean-200 text-ocean-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-slate-50 transition-all">
              Ver As Minhas Encomendas
            </Link>
            <Link href="/" className="bg-ocean-950 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 shadow-lg transition-all">
              Voltar à Loja
            </Link>
          </div>
        </div>
      )}

      {/* ESTADO: ERRO */}
      {status === 'error' && (
        <div className="animate-fade-in">
          <AlertCircle size={64} className="text-red-500 mb-6 mx-auto" />
          <h1 className="font-serif text-2xl text-ocean-950 mb-2">Ops! Algo correu mal.</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            O pagamento pode ter sido processado, mas houve um erro ao gravar o registo no nosso sistema.
            <br/>
            Por favor, contacte o suporte imediatamente.
          </p>
          <Link href="/contact" className="text-brand underline font-bold">
            Contactar Suporte
          </Link>
        </div>
      )}

    </div>
  );
}