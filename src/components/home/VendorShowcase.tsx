import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const VendorShowcase = () => {
  const { data: vendors, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-warm-beige to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Powered by Local Businesses
        </h2>
        <p className="text-xl text-text-secondary text-center mb-12">
          From small-town artisans to nationwide sellers — we give every business a voice
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors?.map((vendor) => (
            <Card key={vendor.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img
                    src={vendor.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
                <div className="flex items-center gap-1 text-text-secondary text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.location}</span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {vendor.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
