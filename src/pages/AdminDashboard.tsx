import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      return !!data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (session && isAdmin === false) {
      navigate("/");
    }
  }, [session, isAdmin, navigate]);

  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [productsCount, ordersCount, categoriesCount] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);

      const { data: ordersData } = await supabase.from("orders").select("total_price");
      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

      return {
        products: productsCount.count || 0,
        orders: ordersCount.count || 0,
        categories: categoriesCount.count || 0,
        revenue: totalRevenue,
      };
    },
    enabled: !!isAdmin,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  if (!session || !isAdmin) {
    return null;
  }

  const statusColors: Record<string, string> = {
    Confirmed: "bg-blue-500",
    Processing: "bg-yellow-500",
    Shipped: "bg-purple-500",
    Delivered: "bg-success",
    Cancelled: "bg-destructive",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Products</p>
                  <p className="text-3xl font-bold">{stats?.products || 0}</p>
                </div>
                <Package className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{stats?.orders || 0}</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{stats?.revenue.toLocaleString() || 0}</p>
                </div>
                <DollarSign className="h-12 w-12 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Categories</p>
                  <p className="text-3xl font-bold">{stats?.categories || 0}</p>
                </div>
                <Users className="h-12 w-12 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders?.map((order) => (
                <Link
                  key={order.id}
                  to={`/order/${order.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-text-secondary">{order.user_email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                    <p className="font-bold text-primary">
                      ₹{order.total_price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
