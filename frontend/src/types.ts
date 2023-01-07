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

export interface InitializedType {
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export interface AuthType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}

export type AuthContextType = InitializedType & AuthType;

export interface ProfileType {
  email: "user@example.com";
  name: "string";
  surname: "string";
  patronymic: "string";
  phone: "string";
  password: "string";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_id: 0;
  uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention
  is_admin: false;
  photo: "string";
}
