export interface User {
  isSucceed?: boolean;
  user?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
  address?: string;
  dob?: Date;
  certificatePath?: string | null;
}
