export interface AddressEntities {
  province: string;
  district: string;
  ward: string;
  street: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FPTIdentityCardData {
  id: string;
  id_prob: string;
  name: string;
  name_prob: string;
  dob: string;
  dob_prob: string;
  sex: string;
  sex_prob: string;
  nationality: string;
  nationality_prob: string;
  home: string;
  home_prob: string;
  address: string;
  address_prob: string;
  doe: string;
  doe_prob: string;
  overall_score: string;
  number_of_name_lines: string;
  address_entities: AddressEntities;
  type_new: string;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FPTResponse {
  errorCode: number;
  errorMessage: string;
  data: FPTIdentityCardData[];
}

export interface IdentityCardDto {
  fullName: string;
  dateOfBirth: Date;
  cardNumber: string;
  gender: string;
  address: string;
  nationality: string;
  userId: string;
}
