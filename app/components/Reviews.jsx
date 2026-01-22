'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import { Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do Formulário
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setUploading] = useState(false);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      // 1. Tentar buscar com o perfil (nome do cliente)
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        // Se der erro na relação (PGRST200), tentamos buscar simples sem o nome
        // Isso evita que o erro {} bloqueie a lista
        console.warn('Aviso: Relação com profiles falhou. A carregar simples.', error);
        
        const { data: simpleData, error: simpleError } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
          
        if (simpleError) throw simpleError;
        setReviews(simpleData || []);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Erro crítico ao carregar reviews:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Tem de fazer login para avaliar.');
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newRating,
          comment: newComment
        });

      if (error) throw error;

      toast.success('Obrigado pela sua avaliação!');
      setNewComment('');
      setNewRating(5);
      fetchReviews(); 
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar avaliação.');
    } finally {
      setUploading(false);
    }
  };

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="mt-12 pt-12 border-t border-slate-100 w-full max-w-2xl mx-auto">
      
      <h3 className="font-serif text-2xl text-ocean-950 mb-6 text-center">
        Avaliações ({reviews.length})
      </h3>

      {/* Resumo da Média */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-2 text-gold-500 mb-1">
          <span className="text-4xl font-serif text-ocean-950">{averageRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                className={star <= Math.round(averageRating) ? 'fill-current' : 'text-slate-200'} 
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-400">Baseado em {reviews.length} opiniões</p>
      </div>

      {/* Formulário */}
      <div className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-100">
        <h4 className="font-bold text-sm uppercase tracking-wide text-slate-500 mb-4">Deixe a sua opinião</h4>
        
        {!user ? (
           <p className="text-sm text-slate-500">Faça login para escrever uma avaliação.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`transition-colors ${star <= newRating ? 'text-gold-500' : 'text-slate-300 hover:text-gold-300'}`}
                >
                  <Star size={24} fill={star <= newRating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            
            <textarea
              placeholder="O que achou deste produto?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand mb-4"
              rows="3"
              required
            ></textarea>
            
            <button 
              disabled={submitting}
              className="bg-ocean-950 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ocean-800 transition-all disabled:opacity-50"
            >
              {submitting ? 'A enviar...' : 'Publicar Avaliação'}
            </button>
          </form>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-slate-50 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-ocean-50 p-2 rounded-full text-ocean-900">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ocean-950">
                    {/* Se a relação falhar, mostra "Cliente Verificado" */}
                    {review.profiles?.full_name || 'Cliente Verificado'}
                  </p>
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < review.rating ? 'fill-current' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-600 text-sm pl-11">{review.comment}</p>
          </div>
        ))}
        
        {reviews.length === 0 && !loading && (
          <p className="text-center text-slate-400 text-sm italic">
            Seja o primeiro a avaliar este produto.
          </p>
        )}
      </div>
    </div>
  );
}