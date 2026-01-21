import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import BottomNav from "./components/BottomNav";

// 1. IMPORTAR O TOASTER
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
        
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              
              {/* 2. CONFIGURAR O ESTILO DAS NOTIFICAÇÕES (LUXO) */}
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#0f172a', // ocean-950
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                    border: '1px solid #f1f5f9',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#C4A67C', // A nossa cor Dourada (Brand)
                      secondary: '#fff',
                    },
                    style: {
                      border: '1px solid #C4A67C', // Borda dourada subtil no sucesso
                    }
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <div className="pb-24"> 
                {children}
              </div>
              
              <BottomNav />
              
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>

      </body>
    </html>
  );
}