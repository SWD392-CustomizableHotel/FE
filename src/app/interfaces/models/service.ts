export interface Service {
  id?: number;
  code?: string;
  name?: string;
  price?: number;
  description?: string;
  status?: string;
  hotelId?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  isDeleted?: boolean;
  userName?: string;
  assignedStaff?: Staff[];
}

export interface Staff {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}
