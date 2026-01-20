import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // 1. Receber o carrinho do Frontend
    const { cart } = await request.json();

    // 2. Transformar o carrinho no formato que o Stripe exige
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image_url], // O Stripe mostra a imagem no checkout
        },
        unit_amount: Math.round(item.price * 100), // O Stripe trabalha em cêntimos (10.00€ = 1000)
      },
      quantity: item.quantity,
    }));

    // 3. Criar a Sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Aceitar cartões
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`, // Para onde vai se pagar?
      cancel_url: `${request.headers.get('origin')}/cart`,   // Para onde vai se cancelar?
    });

    // 4. Enviar o link de pagamento de volta para o Frontend
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Erro no checkout:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}