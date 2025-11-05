import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    image_url?: string;
    stock: number;
    is_on_sale: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("cart").upsert({
      user_id: session.user.id,
      product_id: product.id,
      quantity: 1,
    }, {
      onConflict: "user_id,product_id",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });

    queryClient.invalidateQueries({ queryKey: ["cartCount"] });
  };

  const displayPrice = product.is_on_sale && product.sale_price 
    ? product.sale_price 
    : product.price;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            {product.is_on_sale && (
              <Badge className="absolute top-3 right-3 bg-destructive">
                Sale
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">
                ₹{displayPrice.toLocaleString()}
              </span>
              {product.is_on_sale && product.sale_price && (
                <span className="text-sm text-text-secondary line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="text-sm text-warning mb-3">
                Only {product.stock} left in stock
              </p>
            )}

            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
