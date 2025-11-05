import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";

const AllCategories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">All Categories</h1>
          <FeaturedCategories />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllCategories;
