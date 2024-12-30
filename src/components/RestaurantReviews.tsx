import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";

export type Review = {
  id: string;
  restaurantName: string;
  dateVisited: string;
  dishes: string[];
  rating: number;
  notes: string;
};

export const RestaurantReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddReview = (review: Omit<Review, "id">) => {
    const newReview = {
      ...review,
      id: crypto.randomUUID(),
    };
    setReviews([newReview, ...reviews]);
    setShowForm(false);
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
            <ReviewForm onSubmit={handleAddReview} onCancel={() => setShowForm(false)} />
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