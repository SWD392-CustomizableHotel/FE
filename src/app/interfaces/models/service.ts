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
}
