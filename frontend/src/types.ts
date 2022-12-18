export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType extends LoginType {
  name: string;
  surname: string;
  patronymic: string;
}

export interface EventType {
  title: string | null;
  photoCover: string | null;
  description: string | undefined;
  dateStart: Date | null;
  dateEnd?: Date | null;
  visibility: boolean | null;
}

export enum DeviceType {
  "computer",
  "mobile",
}

export interface DeviceContextType {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
}

export interface AuthContextType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}
