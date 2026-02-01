import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { User, Package, Heart, Clock } from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const { data: wishlist, isLoading: loadingWishlist } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ["/api/history"],
    enabled: !!user,
  });

  if (loadingUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">
                {user.role === "admin" ? "Administrator" : user.role === "seller" ? "Seller" : "Customer"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="gap-2" data-testid="tab-orders">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-2" data-testid="tab-wishlist">
            <Heart className="h-4 w-4" />
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {loadingOrders ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No orders yet. Start shopping!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders?.map((order: any) => (
                <Card key={order.id} data-testid={`order-${order.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          {loadingWishlist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : wishlist?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Your wishlist is empty.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {loadingHistory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : history?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No browsing history yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
