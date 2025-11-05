import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";

export const FeaturedProducts = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-xl text-text-secondary text-center mb-12">
          Handpicked deals just for you
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
