export interface Payment {
    amount?: number;
    status?: string;
    code?: string;
    paymentIntentId?: string;
    bookingId?: number;
    startDate?: Date;
    endDate?: Date;
}