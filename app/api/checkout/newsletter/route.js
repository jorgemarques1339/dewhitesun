import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase (lado do servidor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Nota: Para operações de escrita "públicas" sem autenticação do utilizador, 
// a chave ANON geralmente funciona se as RLS (regras de segurança) estiverem configuradas corretamente.
// Se tivesses a chave SERVICE_ROLE, usarias aqui para ignorar RLS, mas vamos manter simples e seguro com a ANON.
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    // Tentar inserir na base de dados
    const { error } = await supabase
      .from('subscribers')
      .insert({ email });

    if (error) {
      // Se o erro for de duplicado (código 23505 no Postgres), avisamos que já existe
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Este email já está subscrito.' }, { status: 200 }); // Retornamos 200 para não dar erro no frontend
      }
      throw error;
    }

    return NextResponse.json({ message: 'Sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro na newsletter:', error);
    return NextResponse.json({ error: 'Erro interno ao subscrever.' }, { status: 500 });
  }
}