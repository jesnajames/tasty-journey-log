import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Review } from "./RestaurantReviews";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {review.restaurant_name}
          <Badge variant="secondary">{review.rating}/5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Visited on {new Date(review.date_visited).toLocaleDateString()}
        </p>
        <div>
          <h4 className="font-semibold mb-1">Dishes tried:</h4>
          <div className="flex flex-wrap gap-2">
            {review.dishes.map((dish, index) => (
              <Badge key={index} variant="outline">
                {dish}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Notes:</h4>
          <p className="text-sm">{review.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};