import { supabase } from '@/lib/supabase';
import ProductDetails from '@/app/components/ProductDetails';
import { notFound } from 'next/navigation';
import { cache } from 'react';

// 1. OTIMIZAÇÃO: Criar uma função com cache para não ir à BD duas vezes
// O React memoriza o resultado desta função para o mesmo pedido
const getProduct = cache(async (id) => {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  return product;
});

// 2. SEO: Gerar Metadados para Redes Sociais
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produto não encontrado | DeWhiteSun',
    };
  }

  return {
    title: `${product.name} | DeWhiteSun`,
    description: product.description || 'Peça exclusiva da coleção DeWhiteSun.',
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
      url: `https://dewhitesun.vercel.app/product/${id}`,
      siteName: 'DeWhiteSun',
      locale: 'pt_PT',
      type: 'website',
      price: {
        amount: product.price,
        currency: 'EUR',
      },
    },
  };
}

// 3. Componente da Página
export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  // Se não encontrar, ativa a página 404 oficial do Next.js
  if (!product) {
    notFound();
  }

  // 4. SEO EXTRA: Dados Estruturados (JSON-LD) para o Google
  // Isto ajuda a aparecer o preço e stock nos resultados de pesquisa
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url,
    description: product.description,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://dewhitesun.vercel.app/product/${product.id}`,
    },
  };

  return (
    <>
      {/* Injeção invisível de dados para o Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Componente Visual */}
      <ProductDetails product={product} />
    </>
  );
}