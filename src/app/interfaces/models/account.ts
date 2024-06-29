export interface Account {
    id: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roles?: string[];
    userName?: string;
    email?: string;
    phoneNumber?: string;
    dob?: Date;
}