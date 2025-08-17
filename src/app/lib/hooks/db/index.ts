// Export all database hooks for easy importing

// User-related hooks
export { useIsAdmin } from "./useIsAdmin";
export { useUsersByIds } from "./useUsersByIds";
export { useAdminUsers } from "./useAdminUsers";
export { useUserById } from "./useUserById";

// Booking-related hooks
export { useRecentPrice } from "./useRecentPrice";
export { useCreateBooking, useUpdateBooking, useDeleteBooking } from "./useBookingMutations";

// Location-related hooks
export { useCreateLocation, useUpdateLocation, useDeleteLocation } from "./useLocationMutations";

// Registration-related hooks
export { useAddRegistration, useRemoveRegistration, useRemoveRegistrationById } from "./useRegistrationMutations";
