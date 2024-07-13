import { Amenity } from './amenity';
import { Room } from './room';

export interface CustomizeRequest {
    amenity?: Amenity;
    room?: Room;
    roomId: string;
    roomPrice: number;
    amenityId: number;
    amenityPrice: number;
    numberOfRoom: number; // đặt bao nhiêu phòng
    numberOfDay: number; // số ngày ở
    userEmail?: string;
    userName?: string;
}