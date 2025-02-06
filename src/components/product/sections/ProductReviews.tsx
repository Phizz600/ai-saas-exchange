import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  // Mock reviews - replace with real data from your API
  const reviews = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
      rating: 5,
      comment: "Great product, exactly what I was looking for!",
      date: "2024-03-01",
    },
    // ... more reviews
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={review.user.avatar} alt={review.user.name} />
              <AvatarFallback>{review.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.user.name}</span>
                <div className="flex">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}