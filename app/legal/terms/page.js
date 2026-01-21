import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-ocean-950 mb-8">Termos e Condições</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-6">
            <p>Bem-vindo à DeWhiteSun. Ao aceder ao nosso site, concorda com os seguintes termos:</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">1. Produtos</h3>
            <p>Todos os produtos estão sujeitos a disponibilidade de stock. As imagens são ilustrativas e podem diferir ligeiramente do produto real devido à natureza artesanal das peças.</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">2. Preços</h3>
            <p>Os preços apresentados incluem IVA à taxa legal em vigor. Reservamo-nos o direito de alterar preços sem aviso prévio.</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">3. Envio</h3>
            <p>As encomendas são processadas em 1-2 dias úteis. O tempo de entrega varia consoante a localização.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}