import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <span className="text-gold-500 uppercase tracking-widest text-xs font-bold">A Nossa História</span>
        <h1 className="font-serif text-4xl md:text-5xl text-ocean-950 mt-4 mb-8">DeWhiteSun</h1>
        
        <div className="prose prose-slate mx-auto text-slate-600 leading-relaxed font-light">
          <p className="text-lg mb-6">
            Nascida da paixão pelo oceano e pelo brilho dourado dos dias de verão, a DeWhiteSun é mais do que uma marca de acessórios. É um convite a viver a vida com leveza e elegância.
          </p>
          <p className="mb-6">
            Fundada em Portugal, a nossa missão é criar peças que capturem a essência da natureza. Cada jóia é desenhada pensando na mulher moderna que carrega o sol dentro de si, independentemente da estação do ano.
          </p>
          <div className="my-12 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-serif text-2xl text-ocean-950 mb-2">"O luxo está na simplicidade e nos detalhes."</h3>
            <p className="text-sm text-slate-400 italic">— Os Fundadores</p>
          </div>
          <p>
            Trabalhamos apenas com materiais de alta qualidade e processos éticos, garantindo que cada peça que chega até si conta uma história de cuidado, dedicação e amor pelo mar.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}