export interface Amenity {
  id?: number;
  createdBy?: string;
  createdDate?: Date;
  startDate?: Date;
  endDate?: Date;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  isDeleted?: boolean;
  name?: string;
  price?: number;
  description?: string;
  status?: string;
  hotelId?: number;
  capacity?: number;
  inUse?: number;
}
