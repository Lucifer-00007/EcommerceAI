/**
 * Reviews Hooks
 *
 * React Query hooks for product reviews and ratings.
 *
 * @module hooks/use-reviews
 * @example
 * const { data: reviews } = useReviews("prod_123");
 * const { mutate: createReview } = useCreateReview();
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Review, ReviewInput } from "@/types";
import {
  mockReviews,
  getProductReviews,
  mockUsers,
  delay,
  simulateError,
  generateId,
} from "@/services/mock-data";

// =============================================================================
// QUERY KEYS
// =============================================================================

/**
 * Query keys for review-related queries
 */
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  product: (productId: string) => [...reviewKeys.lists(), "product", productId] as const,
  detail: (reviewId: string) => [...reviewKeys.all, "detail", reviewId] as const,
  user: (userId: string) => [...reviewKeys.all, "user", userId] as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Create review input
 */
interface CreateReviewInput extends ReviewInput {
  /** Callback on success */
  onSuccess?: () => void;
}

/**
 * Mark helpful input
 */
interface MarkHelpfulInput {
  /** Review ID */
  reviewId: string;
  /** Whether to mark as helpful (true) or remove helpful mark (false) */
  helpful: boolean;
}

/**
 * Review summary
 */
interface ReviewSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

// =============================================================================
// REVIEW QUERIES
// =============================================================================

/**
 * Hook to fetch reviews for a product
 *
 * @param productId - Product ID
 * @param options - Additional React Query options
 * @returns Query result with reviews array
 *
 * @example
 * const { data: reviews, isLoading } = useReviews("prod_123");
 */
export function useReviews(
  productId: string | undefined,
  options?: Omit<UseQueryOptions<Review[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: reviewKeys.product(productId || ""),
    queryFn: async () => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      await delay(300, 600);
      simulateError(0.03);

      const reviews = getProductReviews(productId);

      // Sort by most recent
      return reviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch review summary for a product
 *
 * @param productId - Product ID
 * @param options - Additional React Query options
 * @returns Query result with review summary
 *
 * @example
 * const { data: summary } = useReviewSummary("prod_123");
 * // { average: 4.5, count: 128, distribution: { 5: 80, 4: 30, ... } }
 */
export function useReviewSummary(
  productId: string | undefined,
  options?: Omit<UseQueryOptions<ReviewSummary, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...reviewKeys.product(productId || ""), "summary"],
    queryFn: async () => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      await delay(200, 400);

      const reviews = getProductReviews(productId);

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
      let totalRating = 0;

      reviews.forEach((review) => {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
        totalRating += review.rating;
      });

      return {
        average: reviews.length ? totalRating / reviews.length : 0,
        count: reviews.length,
        distribution,
      };
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch reviews by a specific user
 *
 * @param userId - User ID
 * @param options - Additional React Query options
 * @returns Query result with user's reviews
 *
 * @example
 * const { data: userReviews } = useUserReviews("user_123");
 */
export function useUserReviews(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<Review[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: reviewKeys.user(userId || ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      await delay(300, 500);
      simulateError(0.03);

      const reviews = mockReviews.filter((r) => r.userId === userId);

      return reviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// REVIEW MUTATIONS
// =============================================================================

/**
 * Hook to create a new review
 *
 * @returns Mutation to create review
 *
 * @example
 * const { mutate: createReview, isPending } = useCreateReview();
 * createReview({
 *   productId: "prod_123",
 *   rating: 5,
 *   title: "Amazing product!",
 *   content: "This exceeded my expectations...",
 *   orderId: "ord_456" // For verified purchase
 * });
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, CreateReviewInput>({
    mutationFn: async (input) => {
      const { productId, rating, title, content, images, orderId } = input;

      await delay(500, 1000);
      simulateError(0.05);

      // Validation
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      if (title.length < 3) {
        throw new Error("Title must be at least 3 characters");
      }

      if (content.length < 10) {
        throw new Error("Review content must be at least 10 characters");
      }

      // Get current user (mock - in real app from auth context)
      const currentUser = mockUsers[0];

      // Create new review
      const newReview: Review = {
        id: generateId("rev"),
        productId,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          avatar: currentUser.avatar,
        },
        rating,
        title,
        content,
        isVerifiedPurchase: !!orderId,
        helpful: 0,
        isHelpful: false,
        images: images?.map((url, index) => ({
          url,
          alt: `Review image ${index + 1}`,
        })),
        isApproved: true, // Auto-approve for mock
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In real app, this would POST to API
      return newReview;
    },
    onSuccess: (data, input) => {
      // Update reviews cache
      queryClient.setQueryData<Review[]>(
        reviewKeys.product(input.productId),
        (old = []) => [data, ...old]
      );

      // Invalidate summary
      queryClient.invalidateQueries({
        queryKey: [...reviewKeys.product(input.productId), "summary"],
      });

      // Call success callback
      input.onSuccess?.();
    },
  });
}

/**
 * Hook to mark a review as helpful
 *
 * @returns Mutation to mark review helpful
 *
 * @example
 * const { mutate: markHelpful } = useMarkHelpful();
 * markHelpful({ reviewId: "rev_123", helpful: true });
 */
export function useMarkHelpful() {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, MarkHelpfulInput>({
    mutationFn: async (input) => {
      const { reviewId, helpful } = input;

      await delay(200, 400);
      simulateError(0.02);

      const review = mockReviews.find((r) => r.id === reviewId);

      if (!review) {
        throw new Error(`Review with ID "${reviewId}" not found`);
      }

      // Update helpful count
      const updatedReview: Review = {
        ...review,
        helpful: helpful ? review.helpful + 1 : Math.max(0, review.helpful - 1),
        isHelpful: helpful,
      };

      return updatedReview;
    },
    onSuccess: (data) => {
      // Update review in cache
      queryClient.setQueryData(reviewKeys.detail(data.id), data);

      // Update in product reviews list
      queryClient.setQueryData<Review[]>(
        reviewKeys.product(data.productId),
        (old = []) =>
          old.map((review) => (review.id === data.id ? data : review))
      );
    },
  });
}

/**
 * Hook to delete a review (owner or admin only)
 *
 * @returns Mutation to delete review
 *
 * @example
 * const { mutate: deleteReview } = useDeleteReview();
 * deleteReview("rev_123");
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (reviewId) => {
      await delay(300, 600);
      simulateError(0.03);

      const review = mockReviews.find((r) => r.id === reviewId);

      if (!review) {
        throw new Error(`Review with ID "${reviewId}" not found`);
      }

      // In real app, this would DELETE to API
      // For mock, we just return success
    },
    onSuccess: (_, reviewId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: reviewKeys.detail(reviewId) });

      // Invalidate product reviews
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
}

// =============================================================================
// REVIEW UTILITIES
// =============================================================================

/**
 * Hook to get rating color
 *
 * @param rating - Rating value (1-5)
 * @returns Color string for the rating
 *
 * @example
 * const color = useRatingColor(5); // "green"
 */
export function useRatingColor(rating: number): string {
  if (rating >= 4.5) return "green";
  if (rating >= 3.5) return "yellow";
  if (rating >= 2.5) return "orange";
  return "red";
}

/**
 * Hook to get rating label
 *
 * @param rating - Rating value (1-5)
 * @returns Label for the rating
 *
 * @example
 * const label = useRatingLabel(5); // "Excellent"
 */
export function useRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 3.5) return "Good";
  if (rating >= 2.5) return "Average";
  if (rating >= 1.5) return "Poor";
  return "Terrible";
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { CreateReviewInput, MarkHelpfulInput, ReviewSummary };
