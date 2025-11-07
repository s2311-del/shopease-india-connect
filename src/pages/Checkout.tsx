import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: cartItems } = useQuery({
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

  const total = cartItems?.reduce((sum, item) => {
    const price = item.products.is_on_sale && item.products.sale_price 
      ? item.products.sale_price 
      : item.products.price;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !cartItems || cartItems.length === 0) return;

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          user_email: session.user.email!,
          total_price: total,
          delivery_address: address,
          contact_number: phone,
          status: "Confirmed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        product_name: item.products.name,
        product_image: item.products.image_url,
        quantity: item.quantity,
        price: item.products.is_on_sale && item.products.sale_price 
          ? item.products.sale_price 
          : item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update stock for each product
      for (const item of cartItems) {
        const newStock = item.products.stock - item.quantity;
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.products.id);
      }

      await supabase.from("cart").delete().eq("user_id", session.user.id);

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });

      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id.slice(0, 8)} has been confirmed.`,
      });

      navigate(`/order/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session || !cartItems || cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Address *
                  </label>
                  <Textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Number *
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.products.name} × {item.quantity}</span>
                    <span className="font-semibold">
                      ₹{((item.products.is_on_sale && item.products.sale_price 
                        ? item.products.sale_price 
                        : item.products.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
