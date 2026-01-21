'use client';

import { createContext, useContext, useState, useEffect } from 'react';
// CORREÇÃO: Usar caminho relativo '../' em vez de '@/' para garantir que encontra o ficheiro
import { TRANSLATIONS } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('pt'); // Padrão: Português

  // Carregar preferência salva no browser
  useEffect(() => {
    // Verificar se estamos no browser antes de aceder ao localStorage
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('dws_lang');
      if (savedLang && ['pt', 'en', 'fr'].includes(savedLang)) {
        setLanguage(savedLang);
      }
    }
  }, []);

  // Mudar idioma e salvar
  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dws_lang', lang);
    }
  };

  // Função mágica de tradução: t('chave')
  const t = (key) => {
    // Verifica se a tradução existe, senão devolve a própria chave como fallback
    return TRANSLATIONS[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}