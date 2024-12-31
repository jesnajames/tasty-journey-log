import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Review } from "./RestaurantReviews";

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, "id">) => void;
  onCancel: () => void;
}

export const ReviewForm = ({ onSubmit, onCancel }: ReviewFormProps) => {
  const [restaurant_name, setRestaurantName] = useState("");
  const [date_visited, setDateVisited] = useState("");
  const [dishes, setDishes] = useState("");
  const [rating, setRating] = useState("5");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      restaurant_name,
      date_visited,
      dishes: dishes.split(",").map((dish) => dish.trim()),
      rating: Number(rating),
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="restaurant_name">Restaurant Name</Label>
        <Input
          id="restaurant_name"
          value={restaurant_name}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date_visited">Date Visited</Label>
        <Input
          id="date_visited"
          type="date"
          value={date_visited}
          onChange={(e) => setDateVisited(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="dishes">Dishes (comma-separated)</Label>
        <Input
          id="dishes"
          value={dishes}
          onChange={(e) => setDishes(e.target.value)}
          placeholder="Spaghetti Carbonara, Tiramisu"
          required
        />
      </div>
      <div>
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your review here..."
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Review</Button>
      </div>
    </form>
  );
};