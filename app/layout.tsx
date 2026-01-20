import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import BottomNav from "./components/BottomNav";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-sans',
});

export const metadata = {
  title: "DeWhiteSun",
  description: "Ocean Lifestyle Store",
};

// A CORREÇÃO ESTÁ AQUI: Adicionámos ": { children: React.ReactNode }"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={`${playfair.variable} ${lato.variable} bg-slate-50 text-ocean-950`}>
        
        <AuthProvider>
          <CartProvider>
            
            {/* Espaço extra no fundo (pb-24) para a barra fixa não tapar nada */}
            <div className="pb-24"> 
              {children}
            </div>
            
            {/* A Barra Inferior Fixa */}
            <BottomNav />
            
          </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}