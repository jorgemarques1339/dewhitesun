'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada! Entraremos em contacto brevemente.');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-ocean-950 mb-4">Fale Conosco</h1>
          <p className="text-slate-500 font-light">Estamos aqui para ajudar. Envie-nos uma mensagem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Lado Esquerdo: Informações */}
          <div className="bg-ocean-950 text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl mb-6">Informações de Contato</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><Mail size={20} /></div>
                  <p className="font-light">geral@dewhitesun.com</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><Phone size={20} /></div>
                  <p className="font-light">+351 912 345 678</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><MapPin size={20} /></div>
                  <p className="font-light">Porto, Portugal</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="w-16 h-16 bg-gold-400 rounded-full opacity-20 blur-xl absolute"></div>
              <p className="relative z-10 text-sm opacity-60">Segunda a Sexta: 9h - 18h</p>
            </div>
          </div>

          {/* Lado Direito: Formulário */}
          <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs uppercase font-bold text-slate-400">Nome</label>
                <input type="text" required className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-ocean-950" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-slate-400">Email</label>
                <input type="email" required className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-ocean-950" />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-slate-400">Mensagem</label>
                <textarea rows="4" required className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-ocean-950"></textarea>
              </div>
              <button className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg">
                Enviar Mensagem
              </button>
            </form>
          </div>

        </div>
      </div>
      
      {/* Importa o Footer se quiseres, se não estiver já no layout */}
      <Footer />
    </div>
  );
}