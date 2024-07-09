export interface Room {
    roomId?: number;
    roomNumber?: string;
    roomType?: string;
    roomStatus?: string;
    roomPrice?: number;
    isDeleted?: boolean;
    roomDescription?: string;
    hotelId? : number,
    image?: string;
    numberOfPeople?: number;
    startDate?: any;
    endDate?: any;
}
