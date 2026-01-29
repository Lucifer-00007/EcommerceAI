import { Layout } from '@/components/layout';
import { Hero } from '@/components/features/hero';
import { FeaturedProducts } from '@/components/features/featured-products';
import { Categories } from '@/components/features/categories';
import { Promotions } from '@/components/features/promotions';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Promotions />
    </Layout>
  );
}