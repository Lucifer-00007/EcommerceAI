/**
 * Custom Hooks
 *
 * Reusable hooks for the entire application including React Query hooks
 * for data fetching and mutations.
 */

// =============================================================================
// UTILITY HOOKS
// =============================================================================

export { useDebounce, useDebouncedCallback } from "./use-debounce";

// =============================================================================
// PRODUCT HOOKS
// =============================================================================

export {
  // Query keys
  productKeys,
  // Queries
  useProducts,
  useInfiniteProducts,
  useProduct,
  useProductBySlug,
  useCategories,
  useCategory,
  useSearchProducts,
  useRelatedProducts,
  useProductRecommendations,
  useFeaturedProducts,
  useSaleProducts,
  useNewArrivals,
  // Mutations
  useRefreshProducts,
  usePrefetchProduct,
  // Types
  type UseProductsFilters,
} from "./use-products";

// =============================================================================
// CART HOOKS
// =============================================================================

export {
  // Query keys
  cartKeys,
  // Queries
  useCart,
  // Mutations
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
  // Utilities
  useCartDrawer,
  useCartTotals,
  // Types
  type AddToCartInput,
  type UpdateCartItemInput,
  type RemoveFromCartInput,
} from "./use-cart";

// =============================================================================
// ORDER HOOKS
// =============================================================================

export {
  // Query keys
  orderKeys,
  // Queries
  useOrders,
  useOrder,
  // Mutations
  useCreateOrder,
  useCancelOrder,
  // Utilities
  useOrderStatusColor,
  useOrderStatusLabel,
  // Types
  type CreateOrderInput,
  type CreateOrderResponse,
  type CancelOrderInput,
} from "./use-orders";

// =============================================================================
// AUTH HOOKS
// =============================================================================

export {
  // Query keys
  authKeys,
  // Queries
  useCurrentUser,
  useUserProfile,
  // Mutations
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  // Utilities
  useIsAuthenticated,
  useHasRole,
  // Types
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
} from "./use-auth";

// =============================================================================
// REVIEW HOOKS
// =============================================================================

export {
  // Query keys
  reviewKeys,
  // Queries
  useReviews,
  useReviewSummary,
  useUserReviews,
  // Mutations
  useCreateReview,
  useMarkHelpful,
  useDeleteReview,
  // Utilities
  useRatingColor,
  useRatingLabel,
  // Types
  type CreateReviewInput,
  type MarkHelpfulInput,
  type ReviewSummary,
} from "./use-reviews";
