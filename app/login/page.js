'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('Conta criada! Verifique o seu email ou faça login.');
      } else {
        await signIn(email, password);
        router.push('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pb-24">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        
        {/* LOGÓTIPO EM DESTAQUE */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.ibb.co/TzyqgkH/Gemini-Generated-Image-2xxali2xxali2xxa-removebg-preview.png" 
            alt="DeWhiteSun Logo" 
            className="h-30 w-auto object-contain drop-shadow-sm" 
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
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          <button className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg active:scale-95">
            {isSignUp ? 'Registar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
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