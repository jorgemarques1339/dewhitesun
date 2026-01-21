import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializar o Stripe com a chave secreta definida no .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // 1. Receber o carrinho enviado pelo Checkout (Frontend)
    const { cart } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    // 2. Transformar o carrinho no formato que o Stripe exige (Line Items)
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image_url], // A imagem aparece na página do Stripe
        },
        unit_amount: Math.round(item.price * 100), // O Stripe trabalha em cêntimos (Ex: 10.00€ = 1000)
      },
      quantity: item.quantity,
    }));

    // 3. Criar a Sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Aceitar cartões
      line_items: lineItems,
      mode: 'payment',
      // URLs de retorno para a aplicação
      success_url: `${request.headers.get('origin')}/success`, // Página de Sucesso (onde gravamos a encomenda)
      cancel_url: `${request.headers.get('origin')}/checkout`, // Se cancelar, volta ao checkout
    });

    // 4. Enviar o link de pagamento de volta para o Frontend
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Erro no checkout:', error);
    return NextResponse.json({ error: 'Erro interno ao criar sessão de pagamento' }, { status: 500 });
  }
}