import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Store, Users, TrendingUp, Heart } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              About ShopEase
            </h1>
            <p className="text-xl text-center text-text-secondary max-w-3xl mx-auto">
              Bringing savings and convenience to every corner of India, from metro cities to small towns.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Founded with a vision to make quality products accessible to everyone across India, 
                  ShopEase has grown from a small startup to a trusted e-commerce platform serving 
                  millions of customers nationwide.
                </p>
                <p>
                  We understand the diverse needs of Indian consumers and work tirelessly to bridge 
                  the gap between urban and rural markets, ensuring that everyone has access to the 
                  best products at competitive prices.
                </p>
                <p>
                  Today, we're proud to connect thousands of vendors with customers across the country, 
                  supporting local businesses while delivering exceptional shopping experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-text-secondary text-sm">
                  We carefully curate our catalog to ensure every product meets our high standards.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-text-secondary text-sm">
                  Your satisfaction is our priority. We're here to serve you better every day.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
                <p className="text-text-secondary text-sm">
                  Competitive prices without compromising on quality or service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
                <p className="text-text-secondary text-sm">
                  Supporting local vendors and empowering communities across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Reach */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Reach</h2>
              <p className="text-lg text-text-secondary mb-8">
                From Kashmir to Kanyakumari, from Gujarat to Assam - we deliver to every corner of India.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-text-secondary">Cities Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-text-secondary">Vendors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                  <div className="text-text-secondary">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-text-secondary">Products</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
