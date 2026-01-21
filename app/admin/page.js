'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Package, ShoppingCart, Plus, Trash2, Edit, X, 
  Clock, Truck, TrendingUp, DollarSign, Lock, MapPin, Save, AlertTriangle, Search, Box, Menu,
  ChevronLeft, ChevronRight, Upload, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// IMPORTAR RECHARTS
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dados
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0 });
  const [chartData, setChartData] = useState([]); // <--- Dados para o Gráfico
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 20;
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Formulário
  const [formData, setFormData] = useState({
    id: null,
    name: '', category: '', price: '', stock: 0, description: '', image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 1. Proteção de Rota
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 2. Carregar Dados
  useEffect(() => {
    if (user && profile?.is_admin) {
      if (activeTab === 'orders') {
        fetchOrders(currentPage);
      } else {
        fetchDashboardData();
      }
    }
  }, [user, profile, activeTab, currentPage]);

  const fetchDashboardData = async () => {
    const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (prodData) setProducts(prodData);

    // Buscar TODAS as encomendas para estatísticas e gráfico
    const { data: allOrders } = await supabase.from('orders').select('id, total, user_id, created_at').order('created_at', { ascending: false });
    
    if (allOrders) {
      // Estatísticas
      const totalRev = allOrders.reduce((acc, order) => acc + (order.total || 0), 0);
      const uniqueCustomers = new Set(allOrders.map(o => o.user_id)).size;
      setStats({ revenue: totalRev, orders: allOrders.length, customers: uniqueCustomers });

      // --- PROCESSAR DADOS PARA O GRÁFICO ---
      // Agrupar vendas por dia
      const chartMap = new Map();
      
      allOrders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
        const currentTotal = chartMap.get(date) || 0;
        chartMap.set(date, currentTotal + (order.total || 0));
      });

      // Converter para array e inverter (para ficar cronológico: Esquerda -> Direita)
      const graphData = Array.from(chartMap, ([name, vendas]) => ({ name, vendas })).reverse();
      setChartData(graphData);
    }
  };

  const fetchOrders = async (page) => {
    const from = (page - 1) * ORDERS_PER_PAGE;
    const to = from + ORDERS_PER_PAGE - 1;

    const { data: ordData, error } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      toast.error('Erro ao carregar encomendas');
    } else if (ordData) {
      setOrders(ordData);
    }
    
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    if (count !== null) setStats(prev => ({ ...prev, orders: count }));
  };

  // --- LÓGICA DE FILTRAGEM ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping_address?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UPLOAD ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao carregar imagem');
      return null;
    }
  };

  // --- AÇÕES ---
  const openCreateModal = () => {
    setFormData({ id: null, name: '', category: '', price: '', stock: 0, description: '', image_url: '' });
    setImageFile(null);
    setPreviewUrl('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData(product);
    setImageFile(null);
    setPreviewUrl(product.image_url);
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
      else { setUploading(false); return; }
    }
    const dataToSave = { ...formData, image_url: finalImageUrl };
    delete dataToSave.id;

    let error;
    if (formData.id) {
      const res = await supabase.from('products').update(dataToSave).eq('id', formData.id);
      error = res.error;
    } else {
      const res = await supabase.from('products').insert([dataToSave]);
      error = res.error;
    }
    setUploading(false);
    if (error) toast.error('Erro: ' + error.message);
    else {
      toast.success(formData.id ? 'Produto atualizado!' : 'Produto criado!');
      setShowModal(false);
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
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
        toast.success(`Encomenda marcada como ${newStatus}`);
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1) setCurrentPage(newPage);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div></div>;

  if (!profile?.is_admin) return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <Lock size={48} className="text-red-400 mb-4" />
        <h1 className="font-serif text-2xl text-ocean-950 mb-2">Acesso Restrito</h1>
        <Link href="/" className="text-brand underline">Voltar à Loja</Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      {isMobileMenuOpen && (<div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>)}
      <aside className={`w-64 bg-ocean-950 text-white flex flex-col fixed h-full z-30 shadow-xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div><h1 className="font-serif text-2xl tracking-wide text-gold-400">DeWhiteSun</h1><span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Backoffice</span></div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[{ id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard }, { id: 'products', label: 'Produtos', icon: Package }, { id: 'orders', label: 'Encomendas', icon: ShoppingCart }].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSearchTerm(''); setIsMobileMenuOpen(false); setCurrentPage(1); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><item.icon size={18} /><span className="font-medium text-sm tracking-wide">{item.label}</span></button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10 bg-ocean-900/50"><Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold"><X size={14} /> Voltar à Loja</Link></div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 max-w-7xl mx-auto w-full">
        <div className="md:hidden flex items-center justify-between mb-6"><button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white text-ocean-950 rounded-lg shadow-sm border border-slate-100"><Menu size={24} /></button><span className="font-serif text-lg text-ocean-950 font-bold">Admin</span><div className="w-10"></div></div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-serif text-ocean-950">Bem-vindo, Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="p-4 bg-green-50 text-green-600 rounded-full"><DollarSign size={24} /></div><div><p className="text-slate-400 text-xs uppercase font-bold">Receita Total</p><h3 className="text-2xl font-bold text-ocean-950">€{stats.revenue.toFixed(2)}</h3></div></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="p-4 bg-blue-50 text-blue-600 rounded-full"><ShoppingCart size={24} /></div><div><p className="text-slate-400 text-xs uppercase font-bold">Total Encomendas</p><h3 className="text-2xl font-bold text-ocean-950">{stats.orders}</h3></div></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="p-4 bg-purple-50 text-purple-600 rounded-full"><TrendingUp size={24} /></div><div><p className="text-slate-400 text-xs uppercase font-bold">Clientes</p><h3 className="text-2xl font-bold text-ocean-950">{stats.customers}</h3></div></div>
            </div>

            {/* --- GRÁFICO DE VENDAS --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-serif text-ocean-950 mb-6">Evolução de Vendas</h3>
              <div className="h-80 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C4A67C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#C4A67C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#C4A67C', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="vendas" stroke="#C4A67C" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Ainda não existem dados suficientes para o gráfico.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-serif text-ocean-950">Gerir Produtos</h2>
              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Pesquisar..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-brand" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <button onClick={openCreateModal} className="bg-ocean-950 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-ocean-800 shadow-lg whitespace-nowrap"><Plus size={16} /> <span className="hidden md:inline">Novo</span></button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-100"><tr><th className="px-6 py-4">Produto</th><th className="px-6 py-4">Categoria</th><th className="px-6 py-4">Preço</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-4"><img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200" /><span className="font-medium text-ocean-950 truncate max-w-[150px]">{product.name}</span></div></td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{product.category}</span></td>
                      <td className="px-6 py-4 font-bold text-ocean-950">€{product.price}</td>
                      <td className="px-6 py-4">{product.stock <= 0 ? <span className="flex items-center gap-1 text-red-500 font-bold text-xs"><AlertTriangle size={14}/> Esgotado</span> : product.stock < 5 ? <span className="text-orange-500 font-bold text-xs">Baixo ({product.stock})</span> : <span className="text-green-600 font-medium">{product.stock}</span>}</td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEditModal(product)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"><Edit size={18} /></button><button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"><Trash2 size={18} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENCOMENDAS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-serif text-ocean-950">Encomendas</h2>
                <div className="relative w-full md:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Pesquisar ID ou Cliente..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-brand" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
             </div>
             <div className="space-y-4">
               {filteredOrders.map((order) => (
                 <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div><div className="flex items-center gap-3 mb-2"><span className="font-mono font-bold text-ocean-950 bg-slate-100 px-2 py-1 rounded text-xs">#{order.id.slice(0,8)}</span><span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(order.created_at).toLocaleDateString()}</span></div><p className="text-sm text-slate-600">Total: <span className="font-bold text-ocean-950">€{order.total}</span></p></div>
                        <div className="relative w-full md:w-48">
                          <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="w-full appearance-none text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl border-none outline-none cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700"><option value="Pago">🟡 Pago</option><option value="Enviado">🔵 Enviado</option><option value="Entregue">🟢 Entregue</option></select>
                          <Truck size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
                        </div>
                    </div>
                    <div className="border-t border-slate-50 pt-4"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Box size={14} /> Artigos</p><div className="space-y-2">{order.order_items?.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg"><span className="text-slate-700"><span className="font-bold">{item.quantity}x</span> {item.name}</span><span className="text-slate-500">€{item.price}</span></div>))}</div></div>
                    {order.shipping_address && (<div className="border-t border-slate-50 pt-4"><div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl"><MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" /><div className="text-sm text-slate-600"><p className="font-bold text-ocean-950 mb-1">{order.shipping_address.name || 'Sem nome'}</p><p>{order.shipping_address.address || 'Sem morada'}</p><p>{order.shipping_address.zip} {order.shipping_address.city}</p></div></div></div>)}
                 </div>
               ))}
             </div>
             <div className="flex justify-center items-center gap-4 mt-8 pb-8"><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /> Anterior</button><span className="text-sm font-bold text-ocean-950">Página {currentPage}</span><button onClick={() => handlePageChange(currentPage + 1)} disabled={orders.length < ORDERS_PER_PAGE} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Seguinte <ChevronRight size={16} /></button></div>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-slide-down shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6"><h3 className="font-serif text-xl text-ocean-950">{formData.id ? 'Editar Produto' : 'Novo Produto'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button></div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Imagem</label>
                    {previewUrl && (<div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2"><img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /><button type="button" onClick={() => { setPreviewUrl(''); setImageFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><X size={14}/></button></div>)}
                    <div className="flex gap-2 items-center"><label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 hover:text-brand"><Upload size={24} className="mb-2" /><span className="text-xs font-medium">Carregar Ficheiro</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label><span className="text-xs text-slate-400 font-bold uppercase">OU</span><input placeholder="Colar URL" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand" value={formData.image_url} onChange={e => { setFormData({...formData, image_url: e.target.value}); setPreviewUrl(e.target.value); }} /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nome</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                <div className="flex gap-4"><div className="w-1/2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Preço (€)</label><input type="number" step="0.01" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div><div className="w-1/2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Stock</label><input type="number" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Categoria</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Descrição</label><textarea rows="3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                <button disabled={uploading} className="w-full bg-ocean-950 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 transition-all shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-70">{uploading ? 'A carregar imagem...' : <><Save size={18} /> {formData.id ? 'Guardar Alterações' : 'Criar Produto'}</>}</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}