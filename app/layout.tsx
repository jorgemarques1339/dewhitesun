import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

// Importar Contextos
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Importar a Barra Inferior
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

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={`${playfair.variable} ${lato.variable} bg-slate-50 text-ocean-950`}>
        
        <AuthProvider>
          <CartProvider>
            
            {/* O padding-bottom (pb-24) é crucial para o conteúdo não ficar escondido atrás da barra */}
            <div className="pb-24"> 
              {children}
            </div>
            
            {/* A BARRA TEM DE ESTAR AQUI */}
            <BottomNav />
            
          </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}