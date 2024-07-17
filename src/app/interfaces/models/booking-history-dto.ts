import { Amenity } from './amenity';
import { Payment } from './payment';
import { Service } from './service';

export interface BookingHistoryDto {
    bookingId?: number;
    roomType?: string;
    roomDescription?: string;
    rating?: number;
    userName?: string;
    startDate?: Date;
    endDate?: Date;
    service?: Service;
    amenities?: Amenity;
    payments?: Payment;
    totalPrice?: number;
}
