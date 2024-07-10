import { Amenity } from './amenity';
import { Room } from './room';

export interface CustomizeRequest {
    amenity: Amenity;
    room: Room;
    userId?: string;
    userName?: string;
}