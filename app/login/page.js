'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase'; // <--- Importar Supabase

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- NOVA FUNÇÃO: Recuperar Password ---
  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Por favor, preencha o seu email primeiro.');
      return;
    }

    const toastId = toast.loading('A enviar email de recuperação...');

    try {
      // Envia o email de reset. O utilizador será redirecionado para o perfil para mudar a senha.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`, 
      });

      if (error) throw error;

      toast.success('Email enviado! Verifique a sua caixa de entrada.', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar email: ' + err.message, { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      toast.error('As palavras-passe não coincidem.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);

        // Tentar Enviar Email de Boas-vindas
        try {
          const emailResponse = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: 'Bem-vindo à DeWhiteSun 🌊',
              html: `
                <div style="font-family: 'Helvetica Neue', sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #C4A67C; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">DeWhiteSun</h1>
                  </div>
                  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px;">
                    <h2 style="margin-top: 0;">Bem-vindo ao nosso mundo.</h2>
                    <p>Olá,</p>
                    <p>Obrigado por se juntar à nossa comunidade exclusiva. A sua conta foi criada com sucesso.</p>
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="https://dewhitesun.vercel.app" style="background-color: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">Visitar Loja</a>
                    </div>
                  </div>
                </div>
              `
            })
          });
          
          if (!emailResponse.ok) console.warn("Aviso: Falha ao enviar email.", emailResponse.status);
        } catch (emailErr) {
          console.error("Erro não fatal no envio de email:", emailErr);
        }

        toast.success('Conta criada com sucesso! Verifique o seu email.');
        
      } else {
        await signIn(email, password);
        toast.success('Bem-vindo de volta!');
        router.push('/profile');
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Ocorreu um erro.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pb-24">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
            alt="DeWhiteSun Logo" 
            className="h-24 w-auto object-contain drop-shadow-sm" 
          />
        </div>

        <h1 className="font-serif text-2xl text-ocean-950 mb-2 text-center">
          {isSignUp ? 'Criar Nova Conta' : 'Bem-vindo de volta'}
        </h1>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {isSignUp ? 'Junte-se ao estilo de vida DeWhiteSun.' : 'Faça login para aceder à sua conta.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="O seu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-ocean-950 transition-colors"
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="A sua palavra-passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-ocean-950 transition-colors"
              required 
            />
            
            {/* BOTÃO DE RECUPERAÇÃO DE PASSWORD (Apenas no Login) */}
            {!isSignUp && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-slate-400 hover:text-[#C4A67C] transition-colors"
                >
                  Esqueceu-se da palavra-passe?
                </button>
              </div>
            )}
          </div>

          {isSignUp && (
            <div className="animate-fade-in">
              <input 
                type="password" 
                placeholder="Confirme a palavra-passe" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-ocean-950 transition-colors"
                required={isSignUp}
              />
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'A processar...' : (isSignUp ? 'Registar' : 'Entrar')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <button 
            onClick={() => { 
              setIsSignUp(!isSignUp); 
              setError(null); 
              setConfirmPassword('');
            }}
            className="text-sm text-slate-500 hover:text-ocean-950 transition-colors"
          >
            {isSignUp ? 'Já tem conta? ' : 'Ainda não tem conta? '}
            <span className="font-bold underline text-ocean-950">
              {isSignUp ? 'Entrar' : 'Registar'}
            </span>
          </button>
        </div>
        
        <Link href="/" className="block text-center mt-6 text-xs text-slate-300 hover:text-ocean-950 transition-colors">
          Voltar à Loja
        </Link>
      </div>
    </div>
  );
}