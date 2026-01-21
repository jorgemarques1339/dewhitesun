'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 1. Carregar Wishlist quando o utilizador faz login
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]); // Limpar se fizer logout
    }
  }, [user]);

  const fetchWishlist = async () => {
    // Buscar a wishlist e os dados completos do produto associado
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id, products (*)');
    
    if (error) {
      console.error('Erro ao carregar wishlist:', error);
    } else if (data) {
      // Mapear para ficar apenas com a lista de produtos
      setWishlist(data.map(item => item.products).filter(Boolean));
    }
  };

  // 2. Adicionar ou Remover (Toggle)
  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Faça login para guardar favoritos");
      return;
    }

    const exists = wishlist.find(p => p.id === product.id);

    if (exists) {
      // REMOVER
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .match({ user_id: user.id, product_id: product.id });
      
      if (!error) {
        setWishlist(prev => prev.filter(p => p.id !== product.id));
        toast.success("Removido dos favoritos");
      }
    } else {
      // ADICIONAR
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product.id });
      
      if (!error) {
        setWishlist(prev => [...prev, product]);
        toast.success("Adicionado aos favoritos");
      }
    }
  };

  // Helper para saber se um produto já é favorito
  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// CORREÇÃO: A linha abaixo estava incompleta
export const useWishlist = () => useContext(WishlistContext);