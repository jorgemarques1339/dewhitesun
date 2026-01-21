'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Mail, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function SuccessPage() {
  const { user } = useAuth();
  const emailSent = useRef(false); // Evita enviar o email 2 vezes
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  useEffect(() => {
    // Só envia se houver utilizador e ainda não tiver sido enviado
    if (user && user.email && !emailSent.current) {
      emailSent.current = true;
      setEmailStatus('sending');
      
      console.log("A enviar email de confirmação para:", user.email);

      fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'Encomenda Confirmada #DWS-8821 📦',
          html: `
            <div style="font-family: 'Helvetica Neue', sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px;">
               <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #C4A67C; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">DeWhiteSun</h1>
                </div>
                <div style="background-color: #f0fdf4; padding: 30px; border-radius: 12px; border: 1px solid #bbf7d0;">
                  <h2 style="color: #166534; margin-top: 0;">Pagamento Confirmado!</h2>
                  <p>Obrigado pela sua encomenda.</p>
                  <p>Estamos a preparar as suas peças com todo o cuidado. Em breve receberá o número de rastreio para acompanhar a entrega.</p>
                  <hr style="border: 0; border-top: 1px solid #bbf7d0; margin: 20px 0;">
                  <p style="font-size: 14px;"><strong>Destino:</strong> Portugal</p>
                  <p style="font-size: 14px;"><strong>Envio:</strong> Expresso (24h-48h)</p>
                </div>
                <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">Equipa DeWhiteSun</p>
            </div>
          `
        })
      })
      .then(async (res) => {
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log("Email API Resposta:", data);
            
            if (res.ok) {
              setEmailStatus('success');
            } else {
              setEmailStatus('error');
              console.error("Erro API:", data);
            }
        } catch(e) {
            console.error("Erro na API de Email (HTML recebido):", text);
            setEmailStatus('error');
        }
      })
      .catch(err => {
        console.error("Erro de rede:", err);
        setEmailStatus('error');
      });
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <CheckCircle size={64} className="text-green-500 mb-6 animate-bounce" />
      <h1 className="font-serif text-4xl text-ocean-950 mb-4">Pagamento Confirmado!</h1>
      <p className="text-slate-600 mb-4 max-w-md">Obrigado pela tua compra. A tua encomenda #DWS-8821 foi registada.</p>

      {/* Feedback Visual do Email */}
      <div className="mb-8 h-6 flex items-center justify-center text-sm">
        {emailStatus === 'sending' && (
          <span className="text-slate-400 flex items-center gap-2 animate-pulse">
            <Mail size={14}/> A enviar email de confirmação...
          </span>
        )}
        {emailStatus === 'success' && (
          <span className="text-green-600 flex items-center gap-2">
            <Check size={14}/> Email enviado para {user?.email}
          </span>
        )}
        {emailStatus === 'error' && (
          <span className="text-red-400 flex items-center gap-2">
            <AlertCircle size={14}/> Erro ao enviar email (ver consola)
          </span>
        )}
      </div>

      <Link href="/" className="bg-ocean-950 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 shadow-lg transition-all">
        Voltar à Loja
      </Link>
    </div>
  );
}