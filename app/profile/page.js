'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Package, Heart, MapPin, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('address'); // address, orders, wishlist

  // Estado do Formulário de Morada
  const [formData, setFormData] = useState({
    full_name: '', address: '', city: '', zip_code: '', country: 'Portugal'
  });

  // 1. Proteger a rota: Se não houver user, vai para login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    // Se tiver perfil, preencher formulário
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        address: profile.address || '',
        city: profile.city || '',
        zip_code: profile.zip_code || '',
        country: profile.country || 'Portugal'
      });
    }
  }, [user, loading, router, profile]);

  // Função para salvar morada
  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...formData, email: user.email });
      
      if (error) throw error;
      alert('Morada guardada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao guardar.');
    }
  };

  if (loading || !user) return <div className="min-h-screen flex justify-center items-center">A carregar...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Navbar />
      
      <div className="pt-28 px-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-ocean-950">A minha Conta</h1>
          <button 
            onClick={() => { signOut(); router.push('/'); }} 
            className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors font-medium border border-red-100"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* Menu de Abas */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'address', label: 'Morada', icon: MapPin },
            { id: 'orders', label: 'Encomendas', icon: Package },
            { id: 'wishlist', label: 'Favoritos', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all text-sm font-bold tracking-wide ${
                activeTab === tab.id 
                  ? 'bg-ocean-950 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO: MORADA */}
        {activeTab === 'address' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="font-serif text-xl mb-6 text-ocean-950">Morada de Envio Padrão</h2>
            <form onSubmit={saveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100 focus:bg-white focus:border-ocean-950 focus:outline-none transition-colors"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Morada</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100 focus:bg-white focus:border-ocean-950 focus:outline-none transition-colors"
                  placeholder="Rua, Número, Andar"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Cidade</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100 focus:bg-white focus:border-ocean-950 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Código Postal</label>
                <input 
                  type="text" 
                  value={formData.zip_code}
                  onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100 focus:bg-white focus:border-ocean-950 focus:outline-none transition-colors"
                />
              </div>
              
              <button className="md:col-span-2 mt-4 bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg">
                Guardar Alterações
              </button>
            </form>
          </div>
        )}

        {/* CONTEÚDO: ENCOMENDAS */}
        {activeTab === 'orders' && (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 animate-fade-in">
            <Package size={64} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-lg font-medium text-ocean-950 mb-2">Sem encomendas</h3>
            <p className="text-slate-400 text-sm">Ainda não fez nenhuma compra na nossa loja.</p>
          </div>
        )}

        {/* CONTEÚDO: FAVORITOS */}
        {activeTab === 'wishlist' && (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 animate-fade-in">
            <Heart size={64} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-lg font-medium text-ocean-950 mb-2">Lista vazia</h3>
            <p className="text-slate-400 text-sm">Guarde os seus itens favoritos clicando no coração.</p>
          </div>
        )}
      </div>
    </div>
  );
}