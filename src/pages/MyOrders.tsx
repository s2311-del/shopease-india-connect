import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  Confirmed: "bg-blue-500",
  Processing: "bg-yellow-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-success",
  Cancelled: "bg-destructive",
};

const MyOrders = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Please login to view your orders</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-text-secondary mb-6">Start shopping to see your orders here</p>
            <Link to="/categories">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-text-secondary text-sm">
                        Placed on {new Date(order.order_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-text-secondary text-sm mt-1">
                        {order.delivery_address.slice(0, 50)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{order.total_price.toLocaleString()}
                      </p>
                      <Button variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
