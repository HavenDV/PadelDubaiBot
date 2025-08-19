//import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./database.types.gen";
export type { Json } from "./database.types.gen";

// https://supabase.com/docs/guides/api/rest/generating-types#helper-types-for-tables-and-joins
// Override the type for a specific column in a view:
// export type Database = MergeDeep<
//   DatabaseGenerated,
//   {
//     public: {
//       Views: {
//         movies_view: {
//           Row: {
//             // id is a primary key in public.movies, so it must be `not null`
//             id: number;
//           };
//         };
//       };
//     };
//   }
// >;

export type Database = DatabaseGenerated;

// Users
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

// Locations
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type LocationInsert =
  Database["public"]["Tables"]["locations"]["Insert"];
export type LocationUpdate =
  Database["public"]["Tables"]["locations"]["Update"];

// Bookings
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

// Registrations
export type Registration = Database["public"]["Tables"]["registrations"]["Row"];
export type RegistrationInsert =
  Database["public"]["Tables"]["registrations"]["Insert"];
export type RegistrationUpdate =
  Database["public"]["Tables"]["registrations"]["Update"];

// Messages
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

// Chats
export type Chat = Database["public"]["Tables"]["chats"]["Row"];
export type ChatInsert = Database["public"]["Tables"]["chats"]["Insert"];
export type ChatUpdate = Database["public"]["Tables"]["chats"]["Update"];
