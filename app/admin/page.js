'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Package, ShoppingCart, Plus, Trash2, X, 
  Clock, Truck, TrendingUp, DollarSign, Lock, MapPin 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dados
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulário de Novo Produto
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', description: '', image_url: ''
  });

  // 1. Proteção de Rota
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 2. Carregar Dados (Apenas se for admin)
  useEffect(() => {
    if (user && profile?.is_admin) {
      fetchDashboardData();
    }
  }, [user, profile, activeTab]);

  const fetchDashboardData = async () => {
    // Buscar Produtos
    const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (prodData) setProducts(prodData);

    // Buscar Encomendas (incluindo shipping_address)
    const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (ordData) {
      setOrders(ordData);
      const totalRev = ordData.reduce((acc, order) => acc + (order.total || 0), 0);
      const uniqueCustomers = new Set(ordData.map(o => o.user_id)).size;
      setStats({ revenue: totalRev, orders: ordData.length, customers: uniqueCustomers });
    }
  };

  // --- AÇÕES ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([newProduct]);
    if (error) {
      toast.error('Erro ao criar: ' + error.message);
    } else {
      toast.success('Produto criado!');
      setShowAddModal(false);
      setNewProduct({ name: '', category: '', price: '', description: '', image_url: '' });
      fetchDashboardData();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Tem a certeza?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      toast.success('Produto apagado');
      setProducts(products.filter(p => p.id !== id));
    } else {
      toast.error('Erro ao apagar');
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    // Atualização otimista: muda logo na interface para parecer rápido
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

    // Atualizar na Base de Dados
    // Usamos .select() para confirmar que a linha foi realmente devolvida (atualizada)
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
      .select();
    
    if (!error && data.length > 0) {
      toast.success(`Encomenda marcada como ${newStatus}`);

      // Se for "Enviado", notificar o cliente por email
      if (newStatus === 'Enviado') {
        const order = orders.find(o => o.id === id);
        
        if (order) {
           // Buscar email do cliente no perfil
           const { data: clientProfile } = await supabase
             .from('profiles')
             .select('email')
             .eq('id', order.user_id)
             .single();
           
           if (clientProfile?.email) {
             fetch('/api/email', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 to: clientProfile.email,
                 subject: `A sua encomenda #${id.slice(0,8)} foi enviada! 🚚`,
                 html: `
                   <div style="font-family: sans-serif; color: #0f172a;">
                     <h1 style="color: #C4A67C;">Boas notícias!</h1>
                     <p>A sua encomenda <strong>#${id.slice(0,8)}</strong> saiu do nosso armazém.</p>
                     <p>Estado atual: <strong>Enviado</strong></p>
                     <p>Pode acompanhar os detalhes na sua área de cliente.</p>
                     <br/>
                     <p style="font-size: 12px; color: #888;">Equipa DeWhiteSun</p>
                   </div>
                 `
               })
             })
             .then(() => toast.success('Email de envio disparado!'))
             .catch(err => console.error('Erro ao enviar email:', err));
           }
        }
      }
    } else {
      // Se falhar (erro ou RLS bloqueou e data veio vazio), reverte a interface
      console.error("Erro no update:", error);
      toast.error('Erro ao atualizar. Verifique as permissões.');
      setOrders(previousOrders);
    }
  };

  // --- ESTADOS DE CARREGAMENTO E PERMISSÃO ---
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-slate-400 animate-pulse">A carregar Painel...</p>
        </div>
      </div>
    );
  }

  // Se não for admin
  if (!profile?.is_admin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Lock size={48} className="text-red-400" />
        </div>
        <h1 className="font-serif text-2xl text-ocean-950 mb-2">Acesso Restrito</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          Esta área é exclusiva para administradores da DeWhiteSun.
        </p>
        <Link href="/" className="bg-ocean-950 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-ocean-800 transition-all">
          Voltar à Loja
        </Link>
      </div>
    );
  }

  // SE FOR ADMIN, MOSTRA O PAINEL:
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-ocean-950 text-white hidden md:flex flex-col fixed h-full z-10 shadow-xl">
        <div className="p-8 border-b border-white/10">
          <h1 className="font-serif text-2xl tracking-wide text-gold-400">DeWhiteSun</h1>
          <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Backoffice</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'orders', label: 'Encomendas', icon: ShoppingCart },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white shadow-lg border border-white/5' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-ocean-900/50">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
            <X size={14} /> Voltar à Loja
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-8 pb-24 max-w-7xl mx-auto w-full">
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-serif text-ocean-950">Bem-vindo, Admin</h2>
              <p className="text-slate-500">Aqui está o que está a acontecer na tua loja hoje.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Receita Total</p>
                  <h3 className="text-2xl font-bold text-ocean-950">€{stats.revenue.toFixed(2)}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Encomendas</p>
                  <h3 className="text-2xl font-bold text-ocean-950">{stats.orders}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Clientes</p>
                  <h3 className="text-2xl font-bold text-ocean-950">{stats.customers}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-ocean-950">Gerir Produtos</h2>
                <p className="text-slate-500 text-sm">Adiciona ou remove artigos da loja.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)} 
                className="bg-ocean-950 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-ocean-800 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Plus size={18} /> Novo Produto
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                          <span className="font-medium text-ocean-950">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-ocean-950">€{product.price}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                          title="Apagar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ENCOMENDAS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
             <div>
                <h2 className="text-2xl font-serif text-ocean-950">Gestão de Encomendas</h2>
                <p className="text-slate-500 text-sm">Atualize o estado dos envios e veja as moradas.</p>
             </div>
             
             <div className="space-y-4">
               {orders.map((order) => (
                 <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    
                    {/* Cabeçalho da Encomenda e Status */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-ocean-950 bg-slate-100 px-2 py-1 rounded text-xs">#{order.id.slice(0,8)}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Total: <span className="font-bold text-ocean-950">€{order.total}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <div className="relative w-full md:w-48">
                            <select 
                              value={order.status} 
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`w-full appearance-none text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl border-none outline-none cursor-pointer transition-colors ${
                                order.status === 'Pago' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                                order.status === 'Enviado' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <option value="Pago">🟡 Pago</option>
                              <option value="Enviado">🔵 Enviado</option>
                              <option value="Entregue">🟢 Entregue</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-50">
                              <Truck size={14} />
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* SECÇÃO DA MORADA DE ENVIO */}
                    <div className="border-t border-slate-50 pt-4 mt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <MapPin size={14} /> Dados de Envio
                        </p>
                        {order.shipping_address && Object.keys(order.shipping_address).length > 0 ? (
                            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs text-slate-400">Nome</p>
                                    <p className="font-bold text-ocean-950">{order.shipping_address.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Morada</p>
                                    <p>{order.shipping_address.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Localidade</p>
                                    <p>{order.shipping_address.zip} {order.shipping_address.city}</p>
                                </div>
                                {order.shipping_address.country && (
                                    <div>
                                        <p className="text-xs text-slate-400">País</p>
                                        <p>{order.shipping_address.country}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg">
                                Morada não disponível para esta encomenda.
                            </p>
                        )}
                    </div>

                 </div>
               ))}
             </div>
          </div>
        )}

        {/* MODAL: ADICIONAR PRODUTO */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md animate-slide-down shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-ocean-950">Novo Produto</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nome</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Preço (€)</label>
                    <input type="number" step="0.01" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Categoria</label>
                    <input placeholder="ex: Colares" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Imagem (URL)</label>
                  <input placeholder="https://..." required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Descrição</label>
                  <textarea rows="3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>

                <button className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg mt-2">
                  Criar Produto
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}