export class Booking {
  customerId: number | null;
  dateReservation: string | null;
  bookIds: Array<number> | null;
}

export class BookingResponse {
  id: number
  reservationDate: string
  customerId: number
  customerName: string
  bookTitles: Array<string>
}