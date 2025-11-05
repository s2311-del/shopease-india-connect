import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("cart")
        .select("*, products(*)")
        .eq("user_id", session.user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", cartId);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  };

  const removeItem = async (cartId: string) => {
    const { error } = await supabase.from("cart").delete().eq("id", cartId);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
      toast({ title: "Item removed from cart" });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Please login to view your cart</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => {
    const price = item.products.is_on_sale && item.products.sale_price 
      ? item.products.sale_price 
      : item.products.price;
    return sum + (price * item.quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link to="/categories">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const price = item.products.is_on_sale && item.products.sale_price 
                  ? item.products.sale_price 
                  : item.products.price;
                
                return (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.products.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                        alt={item.products.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.products.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary">{item.products.name}</h3>
                        </Link>
                        <p className="text-2xl font-bold text-primary mt-2">
                          ₹{price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Delivery</span>
                    <span className="font-semibold text-success">FREE</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  className="w-full text-lg py-6"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
