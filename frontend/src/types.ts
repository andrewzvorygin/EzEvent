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
  latitude: number | null;
  longitude: number | null;
  editors: ProfileNameType[];
  event_id?: number;
  uuid_edit?: string;
  can_edit: boolean | null;
  can_reg: boolean | null;
  participants?: ProfileNameType[];
}

export interface EventPageType extends EventType {
  participants: ProfileNameType[];
  responsible_name: string;
  responsible_surname: string;
}

export interface EventCardType extends EventType {
  city: string;
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
  photo: string;
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
  search?: string;
  city?: number;
}

export interface CityType {
  name: string;
  id: number;
}

export interface MyEventQueryType extends EventQueryType {
  typeUser: UserType;
}

export interface CommentType {
  user_id: number;
  text: string;
  event_id: number;
  parent_id: null | number;
  date_comment: string;
  comment_id: number;
  name: string;
  surname: string;
  patronymic: string;
  photo: string;
  nestedComments?: CommentType[];
}
