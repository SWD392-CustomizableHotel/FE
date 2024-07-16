export interface DashboardDto {
  ordersCount: number;
  newOrdersCount: number;
  revenue: number;
  revenueIncreasePercentage: number;
  customersCount: number;
  newCustomersCount: number;
  roomsCount: number;
  availableRoomsCount: number;
  recentBookings: BookingHistoryDto[];
  bestBookingRooms: RoomDto[];
  todayNotifications: NotificationDto[];
  yesterdayNotifications: NotificationDto[];
  monthlyRevenue: number[];
}

export interface BookingHistoryDto {
  bookingId: number;
  roomType: string;
  roomDescription: string;
  rating: number;
  userName: string;
  startDate: Date;
  endDate: Date;
  services: ServiceDto[];
  amenities: AmenityDto[];
  payments: PaymentDto[];
}

export interface RoomDto {
  roomId: number;
  roomNumber: string;
  roomType: string;
  roomDescription: string;
  roomStatus: string;
  roomPrice: number;
  isDeleted: boolean;
  image: string | null;
  numberOfPeople: number;
}

export interface NotificationDto {
  userName: string;
  roomType: string;
  amount: number;
  bookingDate: Date;
}

export interface ServiceDto {
  id: number;
  code: string;
  createdBy: string;
  createdDate: Date;
  name: string;
  description: string;
  endDate: Date;
  hotelId: number;
  isDeleted: boolean;
  lastUpdatedBy: string;
  lastUpdatedDate: Date;
  price: number;
  startDate: Date;
  status: string;
  assignedStaff: StaffDto[];
}

export interface AmenityDto {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  status: string;
}

export interface PaymentDto {
  id: number;
  amount: number;
  status: string;
  paymentDate: Date;
}

export interface StaffDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}
