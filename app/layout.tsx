import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { WishlistProvider } from "./context/WishlistContext"; // <--- 1. Importar Wishlist
import BottomNav from "./components/BottomNav";
import { Toaster } from 'react-hot-toast';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={`${playfair.variable} ${lato.variable} bg-slate-50 text-ocean-950`}>
        
        {/* A ordem dos Providers é importante para dependências internas */}
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider> {/* <--- 2. Envolver a app com a Wishlist */}
                
                {/* Sistema de Notificações (Toasts) */}
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#fff',
                      color: '#0f172a',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                      border: '1px solid #f1f5f9',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                    },
                    success: {
                      iconTheme: { primary: '#C4A67C', secondary: '#fff' },
                      style: { border: '1px solid #C4A67C' }
                    },
                    error: {
                      iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    },
                  }}
                />

                {/* Conteúdo Principal com espaço para a barra fixa */}
                <div className="pb-24"> 
                  {children}
                </div>
                
                {/* Barra de Navegação Inferior */}
                <BottomNav />
                
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>

      </body>
    </html>
  );
}