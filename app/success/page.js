import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <CheckCircle size={64} className="text-green-500 mb-6" />
      <h1 className="font-serif text-4xl text-ocean-950 mb-4">Pagamento Confirmado!</h1>
      <p className="text-slate-600 mb-8 max-w-md">Obrigado pela tua compra. Vais receber um email com os detalhes em breve.</p>
      <Link href="/" className="bg-ocean-950 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ocean-800 shadow-lg">
        Voltar à Loja
      </Link>
    </div>
  );
}