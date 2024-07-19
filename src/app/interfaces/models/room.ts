export interface Room {
    id?:number,
    code?: string,
    type?: string;
    roomSize?: string;
    price?: number;
    description?: string;
    image?: string;
    imagePath?: string;
    numberOfPeople?: number;
    startDate?: any;
    endDate?: any;
    hotelId?: number;
}
