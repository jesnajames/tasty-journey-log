import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

type WishlistItem = {
  id: string;
  restaurantName: string;
  cuisine: string;
  notes: string;
};

export const Wishlist = () => {
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    restaurantName: "",
    cuisine: "",
    notes: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<WishlistItem, "id">) => {
      const { error } = await supabase.from("wishlist_items").insert({
        ...item,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      setNewItem({ restaurantName: "", cuisine: "", notes: "" });
      setShowForm(false);
      toast({
        title: "Success",
        description: "Restaurant added to wishlist!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add restaurant. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding wishlist item:", error);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Success",
        description: "Restaurant removed from wishlist!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove restaurant. Please try again.",
        variant: "destructive",
      });
      console.error("Error removing wishlist item:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItemMutation.mutate(newItem);
  };

  const handleRemove = (id: string) => {
    removeItemMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Restaurants to Try
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Wishlist
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={newItem.restaurantName}
                onChange={(e) =>
                  setNewItem({ ...newItem, restaurantName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input
                id="cuisine"
                value={newItem.cuisine}
                onChange={(e) => setNewItem({ ...newItem, cuisine: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Why do you want to try this place?"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add to Wishlist</Button>
            </div>
          </form>
        ) : isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Your wishlist is empty. Add some restaurants you'd like to try!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <Card key={item.id}>
                <CardHeader className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-lg">{item.restaurantName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.cuisine}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};