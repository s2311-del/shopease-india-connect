import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Truck, Home as HomeIcon } from "lucide-react";

const statusColors: Record<string, string> = {
  Confirmed: "bg-blue-500",
  Processing: "bg-yellow-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-success",
  Cancelled: "bg-destructive",
};

const OrderDetail = () => {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ["orderItems", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);
      if (error) throw error;
      return data;
    },
  });

  const getStepStatus = (currentStatus: string, step: string) => {
    const statusOrder = ["Confirmed", "Processing", "Shipped", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(step);
    return stepIndex <= currentIndex;
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Order not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <nav className="text-sm text-text-secondary mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/my-orders" className="hover:text-primary">My Orders</Link>
          <span className="mx-2">/</span>
          <span>Order #{order.id.slice(0, 8)}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-text-secondary">
              Placed on {new Date(order.order_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge className={`${statusColors[order.status]} text-lg px-4 py-2`}>
            {order.status}
          </Badge>
        </div>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-center">
              {[
                { status: "Confirmed", icon: CheckCircle2, label: "Confirmed" },
                { status: "Processing", icon: Package, label: "Processing" },
                { status: "Shipped", icon: Truck, label: "Shipped" },
                { status: "Delivered", icon: HomeIcon, label: "Delivered" },
              ].map((step, index) => {
                const Icon = step.icon;
                const isActive = getStepStatus(order.status, step.status);
                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        isActive ? "text-foreground" : "text-text-secondary"
                      }`}
                    >
                      {step.label}
                    </p>
                    {index < 3 && (
                      <div
                        className={`absolute h-0.5 w-full top-6 -z-10 ${
                          isActive ? "bg-primary" : "bg-muted"
                        }`}
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            {orderItems?.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6 flex gap-4">
                  <img
                    src={item.product_image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"}
                    alt={item.product_name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product_name}</h3>
                    <p className="text-text-secondary">Quantity: {item.quantity}</p>
                    <p className="text-xl font-bold text-primary mt-2">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Delivery Address</h3>
                <p className="text-text-secondary">{order.delivery_address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <p className="text-text-secondary">{order.contact_number}</p>
                <p className="text-text-secondary">{order.user_email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{order.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-success">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{order.total_price.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
