'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Package, Heart, MapPin, LogOut, ChevronDown, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders'); // Começa nas Encomendas
  const [orders, setOrders] = useState([]); // <--- Estado para Encomendas
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Estado do Formulário de Morada
  const [formData, setFormData] = useState({
    full_name: '', address: '', city: '', zip_code: '', country: 'Portugal'
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        address: profile.address || '',
        city: profile.city || '',
        zip_code: profile.zip_code || '',
        country: profile.country || 'Portugal'
      });
    }

    // --- CARREGAR ENCOMENDAS ---
    if (user) {
      setLoadingOrders(true);
      supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error) setOrders(data || []);
          setLoadingOrders(false);
        });
    }

  }, [user, loading, router, profile]);

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
          <h1 className="font-serif text-3xl text-ocean-950">Olá, {profile?.full_name?.split(' ')[0] || 'Cliente'}</h1>
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
            { id: 'orders', label: 'Encomendas', icon: Package },
            { id: 'address', label: 'Morada', icon: MapPin },
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

        {/* --- ABA: ENCOMENDAS (AGORA REAL) --- */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            {loadingOrders ? (
              <p className="text-center text-slate-400 py-10">A carregar histórico...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-slate-100">
                <Package size={64} className="mx-auto mb-4 text-slate-200" />
                <h3 className="text-lg font-medium text-ocean-950 mb-2">Sem encomendas</h3>
                <p className="text-slate-400 text-sm">Ainda não fez nenhuma compra na nossa loja.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Encomenda #{order.id.slice(0,8)}</p>
                      <div className="flex items-center gap-2 mt-1 text-slate-600 text-xs">
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-serif text-lg text-ocean-950">€{order.total}</span>
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-sm border-b border-slate-50 last:border-0">
                        <span className="text-slate-700">
                          <span className="font-bold text-ocean-950">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-slate-500">€{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- ABA: MORADA --- */}
        {activeTab === 'address' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="font-serif text-xl mb-6 text-ocean-950">Morada de Envio Padrão</h2>
            <form onSubmit={saveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* ... (campos do formulário mantêm-se iguais ao anterior) ... */}
               <div className="md:col-span-2">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Nome Completo</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Morada</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Cidade</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1 block">Código Postal</label>
                <input type="text" value={formData.zip_code} onChange={(e) => setFormData({...formData, zip_code: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-100" />
              </div>
              <button className="md:col-span-2 mt-4 bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg">Guardar Alterações</button>
            </form>
          </div>
        )}

        {/* --- ABA: FAVORITOS --- */}
        {activeTab === 'wishlist' && (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 animate-fade-in">
            <Heart size={64} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-lg font-medium text-ocean-950 mb-2">Lista vazia</h3>
            <p className="text-slate-400 text-sm">A funcionalidade de favoritos reais será a próxima atualização.</p>
          </div>
        )}
      </div>
    </div>
  );
}