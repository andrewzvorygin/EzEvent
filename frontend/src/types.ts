export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType extends LoginType {
  name: string;
  surname: string;
  patronymic: string;
}
