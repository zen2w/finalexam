/**
 * MovieSeat Database Table Schemas & Constants
 */

export const AUDITORIUM_FORMATS = {
  DOLBY_ATMOS: "Dolby Atmos",
  IMAX_LASER: "IMAX Laser",
  STANDARD: "Standard",
};

export const SEAT_TYPES = {
  STANDARD: "standard",
  VIP: "vip",
};

export const RESERVATION_STATUS = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  USED: "used",
};

export const SEAT_HOLD_TTL_MINUTES = 5;
export const CANCELLATION_CUTOFF_MINUTES = 30;
export const MAX_SEATS_PER_TRANSACTION = 6;
