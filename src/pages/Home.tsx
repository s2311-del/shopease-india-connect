import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { IndiaReachMap } from "@/components/home/IndiaReachMap";
import { VendorShowcase } from "@/components/home/VendorShowcase";
import { TrustBadges } from "@/components/home/TrustBadges";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <IndiaReachMap />
        <VendorShowcase />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
