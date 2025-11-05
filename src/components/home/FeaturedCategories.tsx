import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Shirt, Home, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";

const categoryIcons: Record<string, any> = {
  Electronics: Smartphone,
  Fashion: Shirt,
  "Home & Living": Home,
  "Grocery & Essentials": ShoppingBasket,
};

export const FeaturedCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: productCounts } = useQuery({
    queryKey: ["productCounts"],
    queryFn: async () => {
      const counts: Record<string, number> = {};
      if (categories) {
        for (const category of categories) {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id);
          counts[category.id] = count || 0;
        }
      }
      return counts;
    },
    enabled: !!categories,
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading categories...</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-warm-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Shop by Category</h2>
        <p className="text-xl text-text-secondary text-center mb-12">
          Discover products across all your favorite categories
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => {
            const Icon = categoryIcons[category.name] || ShoppingBasket;
            return (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {productCounts?.[category.id] || 0} Products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
