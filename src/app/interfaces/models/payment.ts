export interface Payment {
    amount?: number;
    status?: string;
    paymentId?: number;
    code?: string;
    paymentIntentId?: string;
    bookingId?: number;
    startDate?: Date;
    endDate?: Date;
}