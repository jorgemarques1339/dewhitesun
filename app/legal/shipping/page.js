import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-ocean-950 mb-8">Envios e Devoluções</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-6">
            <h3 className="text-ocean-950 font-bold text-lg">Envios</h3>
            <p>Portugal Continental: 24h-48h úteis.<br/>Ilhas: 3-5 dias úteis.<br/>Internacional: 5-10 dias úteis.</p>
            
            <h3 className="text-ocean-950 font-bold text-lg">Devoluções</h3>
            <p>Aceitamos devoluções no prazo de 14 dias após a receção, desde que a peça não tenha sido usada e esteja na embalagem original.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}