import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Address Book</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Default Shipping</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Demo User</p>
            <p>123 Market St</p>
            <p>San Francisco, CA 94105</p>
            <p>US</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
