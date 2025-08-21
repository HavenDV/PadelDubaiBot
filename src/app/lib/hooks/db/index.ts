// Export all database hooks for easy importing

// User-related hooks
export { useIsAdmin } from "./useIsAdmin";
export { useUsersByIds } from "./useUsersByIds";
export { useAdminUsers } from "./useAdminUsers";
export { useUserById } from "./useUserById";

// Booking-related hooks
export { useBookingsData } from "./useBookingsData";
export { useRecentPrice } from "./useRecentPrice";
export {
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "./useBookingMutations";

// Location-related hooks
export { useLocations } from "./useLocations";
export {
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from "./useLocationMutations";

// Registration-related hooks
export {
  useAddRegistration,
  useRemoveRegistration,
  useRemoveRegistrationById,
} from "./useRegistrationMutations";

// Message-related hooks
export { useDeleteMessage } from "./useMessageMutations";

// Chat-related hooks
export { useChats, useActiveChats } from "./useChats";

// Telegram-related hooks
export { useSendBookingMessage } from "../telegram/useSendBookingMessage";
