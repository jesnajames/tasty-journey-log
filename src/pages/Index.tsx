import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RestaurantReviews } from "@/components/RestaurantReviews";
import { Wishlist } from "@/components/Wishlist";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <img
          src="https://unsplash.com/photos/grape-fruit-hanging-near-red-rose-GhfkRvlXK8c"
          alt="Banner"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
        <div className="absolute inset-0 flex justify-between items-center px-6">
          <h1 className="text-4xl font-bold text-white">My Food Journey</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews">
          <RestaurantReviews />
        </TabsContent>
        <TabsContent value="wishlist">
          <Wishlist />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;