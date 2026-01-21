import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Inicializar Supabase (lado do servidor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { cart } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    // 1. Obter os IDs dos produtos no carrinho
    const productIds = cart.map(item => item.id);

    // 2. Buscar os dados REAIS à base de dados (Stock e Preço)
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, price, stock, image_url')
      .in('id', productIds);

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json({ error: 'Erro ao verificar stock.' }, { status: 500 });
    }

    // 3. Validar Stock e Construir Line Items para o Stripe
    const lineItems = [];

    for (const cartItem of cart) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);

      // Verificação A: Produto existe?
      if (!dbProduct) {
        return NextResponse.json(
          { error: `O produto com ID ${cartItem.id} já não existe.` }, 
          { status: 400 }
        );
      }

      // Verificação B: Há stock suficiente?
      if (dbProduct.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Desculpe, o produto "${dbProduct.name}" já só tem ${dbProduct.stock} unidades disponíveis.` }, 
          { status: 400 }
        );
      }

      // Se passou nas validações, adiciona ao array do Stripe
      // IMPORTANTE: Usamos dbProduct.price (da BD) e não cartItem.price (do frontend) por segurança
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: dbProduct.name,
            images: [dbProduct.image_url],
            metadata: {
              product_id: dbProduct.id // Útil para webhooks no futuro
            }
          },
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    // 4. Criar a Sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      // Metadados extra para sabermos quem comprou (útil para webhooks)
      metadata: {
        cart_count: cart.length
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Erro fatal no checkout:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno. Por favor tente novamente.' }, 
      { status: 500 }
    );
  }
}