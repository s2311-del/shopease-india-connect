import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const { data: cartCount } = useQuery({
    queryKey: ["cartCount", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      const { count } = await supabase
        .from("cart")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);
      return count || 0;
    },
    enabled: !!session?.user?.id,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Check if user is admin
  const isAdminUser = isAdmin && session?.user?.email === "admin@gmail.com";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo (use public/icon.png and hide text for accessibility) */}
          <Link to={isAdminUser ? "/admin/dashboard" : "/"} className="flex items-center gap-2">
            <img src="/icon.png" alt="ShopEase" className="h-10 w-auto object-contain" />
            <span className="sr-only">ShopEase</span>
          </Link>

          {/* Navigation Links */}
          {!isAdminUser && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/products">Marketplace</NavLink>
            </nav>
          )}
          
          {isAdminUser && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <NavLink to="/admin/products">Products</NavLink>
              <NavLink to="/admin/orders">Orders</NavLink>
            </nav>
          )}

          {/* Search Bar - Only for non-admin users */}
          {!isAdminUser && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {!isAdminUser && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isAdminUser && (
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {!isAdminUser ? (
                  <>
                    <Link 
                      to="/" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/products" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Marketplace
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                    {session && (
                      <>
                        <Link 
                          to="/my-orders" 
                          className="text-lg font-medium hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link 
                          to="/cart" 
                          className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Cart
                          {cartCount > 0 && (
                            <span className="ml-auto h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/products" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                  </>
                )}
                
                {session ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start mt-4"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Search - Only for non-admin users */}
        {!isAdminUser && (
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        )}
      </div>
    </header>
  );
};
