import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  User,
  Search,
  Moon,
  Sun,
  Heart,
  Package,
  LogOut,
  LayoutDashboard,
  Shield,
  Menu,
  Store,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useCartStore } from "@/stores/cart-store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/products", label: "Products" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/">
                  <span className="text-xl font-bold gradient-text">ShopHub</span>
                </Link>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button variant="ghost" className="w-full justify-start">
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  {user?.role === "seller" && (
                    <Link href="/seller">
                      <Button variant="ghost" className="w-full justify-start">
                        <Store className="mr-2 h-4 w-4" />
                        Seller Dashboard
                      </Button>
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="ghost" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <span className="font-bold text-xl gradient-text cursor-pointer flex items-center gap-2" data-testid="link-home">
              <Sparkles className="h-5 w-5 text-primary" />
              ShopHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`font-medium transition-colors ${location === link.href ? "bg-accent text-accent-foreground" : ""}`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {user?.role === "seller" && (
              <Link href="/seller">
                <Button variant="ghost" className="font-medium" data-testid="link-seller-dashboard">
                  Seller Dashboard
                </Button>
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost" className="font-medium" data-testid="link-admin-dashboard">
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 bg-muted/50 border-transparent focus:border-primary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="link-wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full" data-testid="link-cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-primary to-purple-600 border-0"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {(user.name || user.username || "U")[0].toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-semibold">{user.name || user.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer" data-testid="link-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem className="cursor-pointer" data-testid="link-orders">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                </Link>
                <Link href="/wishlist">
                  <DropdownMenuItem className="cursor-pointer" data-testid="link-wishlist-menu">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                </Link>
                {user.role === "seller" && (
                  <Link href="/seller">
                    <DropdownMenuItem className="cursor-pointer" data-testid="link-seller">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Seller Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer" data-testid="link-admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 border-0" data-testid="button-register">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
