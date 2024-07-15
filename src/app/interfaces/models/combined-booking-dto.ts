import { Amenity } from './amenity';
import { IdentityCardDto } from './identity-card';
import { Payment } from './payment';
import { Service } from './service';

export interface CombinedBookingHistoryDto {
    bookingId?: number;
    roomType?: string;
    roomDescription?: string;
    rating?: number;
    userName?: string;
    identityCard?: IdentityCardDto;
    startDate?: Date;
    endDate?: Date;
    service?: Service;
    amentities?: Amenity;
    payments?: Payment;
}
