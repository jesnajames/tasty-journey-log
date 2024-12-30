import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RestaurantReviews } from "@/components/RestaurantReviews";
import { Wishlist } from "@/components/Wishlist";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Food Journey</h1>
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