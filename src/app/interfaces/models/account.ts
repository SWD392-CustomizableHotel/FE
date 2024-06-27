import { Role } from './role';

export interface Account {
    id: string;
    firstName?: string;
    lastName?: string;
    isActived?: boolean;
    roles?: Role[];
    userName?: string;
    email?: string;
    phoneNumber?: string;
    dob?: Date;
}