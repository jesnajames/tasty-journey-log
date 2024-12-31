import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export type Review = {
  id: string;
  restaurant_name: string;
  date_visited: string;
  dishes: string[];
  rating: number;
  notes: string;
};

export const RestaurantReviews = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async (review: Omit<Review, "id">) => {
      const { error } = await supabase.from("restaurant_reviews").insert({
        restaurant_name: review.restaurant_name,
        date_visited: review.date_visited,
        dishes: review.dishes,
        rating: review.rating,
        notes: review.notes,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setShowForm(false);
      toast({
        title: "Success",
        description: "Review added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding review:", error);
    },
  });

  const handleAddReview = (review: Omit<Review, "id">) => {
    addReviewMutation.mutate(review);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            My Restaurant Reviews
            <Button onClick={() => setShowForm(true)} className="ml-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <ReviewForm
              onSubmit={handleAddReview}
              onCancel={() => setShowForm(false)}
            />
          ) : isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Start by adding your first restaurant review!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};