import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our E-Shop</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Quality guaranteed and fast delivery.
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Product {item}</h3>
                <p className="text-gray-600 mb-4">Description of product {item}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${(item * 29.99).toFixed(2)}</span>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty'].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Special Offers</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">Limited Time Offer!</h3>
            <p className="text-lg text-yellow-700 mb-4">Get 20% off on all orders above $100</p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Claim Offer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}