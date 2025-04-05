export interface Booking {
  id: string;
  roomNumber: string;
  roomType: "STANDARD" | "DELUXE" | "SUITE";
  adults: number;
  kids: number;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  checkIn: string;
  checkOut: string;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
}

// Dummy data for initial development
export const dummyBookings: Booking[] = [
  {
    id: "1",
    roomNumber: "101",
    roomType: "STANDARD",
    adults: 2,
    kids: 0,
    visitorName: "John Doe",
    visitorEmail: "john@example.com",
    visitorPhone: "+1 (555) 123-4567",
    checkIn: "2024-04-01",
    checkOut: "2024-04-05",
    status: "CONFIRMED",
    totalAmount: 800,
    createdAt: "2024-03-25T10:00:00Z"
  },
  {
    id: "2",
    roomNumber: "205",
    roomType: "DELUXE",
    adults: 2,
    kids: 1,
    visitorName: "Jane Smith",
    visitorEmail: "jane@example.com",
    visitorPhone: "+1 (555) 234-5678",
    checkIn: "2024-04-02",
    checkOut: "2024-04-03",
    status: "PENDING",
    totalAmount: 200,
    createdAt: "2024-03-26T15:30:00Z"
  },
  {
    id: "3",
    roomNumber: "302",
    roomType: "SUITE",
    adults: 2,
    kids: 2,
    visitorName: "Mike Johnson",
    visitorEmail: "mike@example.com",
    visitorPhone: "+1 (555) 345-6789",
    checkIn: "2024-04-03",
    checkOut: "2024-04-07",
    status: "CHECKED_IN",
    totalAmount: 1000,
    createdAt: "2024-03-27T09:15:00Z"
  },
  {
    id: "4",
    roomNumber: "401",
    roomType: "DELUXE",
    adults: 1,
    kids: 1,
    visitorName: "Sarah Wilson",
    visitorEmail: "sarah@example.com",
    visitorPhone: "+1 (555) 456-7890",
    checkIn: "2024-04-04",
    checkOut: "2024-04-06",
    status: "CANCELLED",
    totalAmount: 400,
    createdAt: "2024-03-28T14:45:00Z"
  },
  {
    id: "5",
    roomNumber: "503",
    roomType: "SUITE",
    adults: 3,
    kids: 1,
    visitorName: "David Brown",
    visitorEmail: "david@example.com",
    visitorPhone: "+1 (555) 567-8901",
    checkIn: "2024-04-05",
    checkOut: "2024-04-08",
    status: "CHECKED_OUT",
    totalAmount: 900,
    createdAt: "2024-03-29T11:20:00Z"
  }
]; 