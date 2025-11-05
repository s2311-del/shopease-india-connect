import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, MapPin, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/products/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name), vendors(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["relatedProducts", product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .neq("id", id)
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id,
  });

  const handleAddToCart = async () => {
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
      product_id: id!,
      quantity,
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
      description: `${quantity} ${product?.name}(s) added to your cart`,
    });

    queryClient.invalidateQueries({ queryKey: ["cartCount"] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Product not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const displayPrice = product.is_on_sale && product.sale_price 
    ? product.sale_price 
    : product.price;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <nav className="text-sm text-text-secondary mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href={`/category/${product.category_id}`} className="hover:text-primary">
            {product.categories?.name}
          </a>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_on_sale && (
              <Badge className="absolute top-4 right-4 bg-destructive text-lg px-4 py-2">
                Sale
              </Badge>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ₹{displayPrice.toLocaleString()}
              </span>
              {product.is_on_sale && product.sale_price && (
                <span className="text-2xl text-text-secondary line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <Badge className="mb-6 bg-success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="destructive" className="mb-6">Out of Stock</Badge>
            )}

            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full text-lg py-6 mb-6"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            {/* Vendor Info */}
            {product.vendors && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Sold By</h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={product.vendors.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100"}
                      alt={product.vendors.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.vendors.name}</p>
                      <div className="flex items-center gap-1 text-text-secondary text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{product.vendors.location}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-2">
                        {product.vendors.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
