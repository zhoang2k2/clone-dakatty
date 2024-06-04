export interface AccountType {
  id?: string;
  fullname: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  address: string;
  authenticated?: boolean;
}

export interface AccountEditedType {
  id?: string;
  fullname: string;
  password: string;
  gender: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
}

export interface AccountAuth {
  id: string;
  email: string;
  password: string;
}

export interface AccountState {
  adminAccounts: AccountType[];
  status: string;
}
