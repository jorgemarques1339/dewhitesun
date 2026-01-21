import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-ocean-950 mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-6">
            <p>A sua privacidade é importante para nós. Esta política explica como tratamos os seus dados.</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">1. Recolha de Dados</h3>
            <p>Recolhemos apenas os dados necessários para processar a sua encomenda (nome, morada, email, telefone).</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">2. Partilha de Dados</h3>
            <p>Não partilhamos os seus dados com terceiros, exceto com parceiros logísticos para entrega da encomenda.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}