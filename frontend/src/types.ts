export interface LoginType {
  email: string;
  password: string;
}

export interface ProfileNameType {
  name: string;
  surname: string;
  patronymic: string;
}

export type RegisterType = LoginType & ProfileNameType;

export interface EventType {
  title: string | null;
  photo_cover: string | null;
  description: string | undefined;
  date_start: string | null;
  date_end: string | null;
  visibility: boolean | null;
  editors: ProfileNameType[];
}

export interface EventCardType extends EventType {
  city: number;
  uuid: string;
  uuid_edit: string;
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
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  phone?: string;
  uuid: string;
}

export enum UserType {
  "all",
  "organizer",
  "particiapant",
}

export interface EventQueryType {
  limit: number;
  offset: number;
  dateStart?: Date;
  dateEnd?: Date;
  location?: number;
}

export interface MyEventQueryType extends EventQueryType {
  typeUser: UserType;
}
