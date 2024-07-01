export interface Room {
    id?:number,
    type?: string;
    price?: number;
    description?: string;
    image?: string;
    numberOfPeople?: number;
    startDate?: Date;
    endDate?: Date;
}