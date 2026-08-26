export enum ELisOrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  RESULTS = 'RESULTS',
  DONE = 'DONE',
}

export enum ESex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum EOrderStatus {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
}

export interface IPet {
  _id: string;
  nickname: string;
  speciesId: string;
  breedId: string | null;
  sex: ESex;
  bornDate: string | null;
  age: string | null;
  isSterilized: boolean;
}

export interface IOwner {
  _id?: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  bornDate: string | null;
  email: string | null;
  phone: string | null;
  snils: string | null;
}

export interface IArchiveOrderPreview {
  _id: string;
  datetime: string;
  status: ELisOrderStatus;
  isPathology: boolean;
  isDefective: boolean;
  barcode: string;
  sampleNumber: string;
  historyNumber: string;
  pet: IPet;
  owner: IOwner;
  analysis: string[];
  doctor: string;
  clientName: string;
  isPrinted: boolean;
}

export interface IArchiveQueryParams {
  dateFrom?: string;
  dateTo?: string;
  barcode?: string;
  sampleNumber?: string;
  nickname?: string;
  speciesId?: string;
  breedId?: string;
  ownerLastName?: string;
  clientId?: string;
  status?: ELisOrderStatus;
  isPathology?: boolean;
  isDefective?: boolean;
  limit?: number;
  offset?: number;
}

export interface IOwnerInput {
  lastName: string;
  firstName: string;
  middleName?: string | null;
  phone: string;
  email?: string | null;
  bornDate: string;
  snils?: string | null;
}

export interface IOwnerRecord extends IOwnerInput {
  _id: string;
}

export type IOwnerCreateResult = IOwnerInput & ({ _id: string; id?: never } | { id: string; _id?: never });

export type IOwnerQueryParams = Partial<IOwnerInput>;

export interface IPetPreview extends IPet {
  ownerId: string;
  ownerLastName: string;
}

export interface IPetInput {
  nickname: string;
  speciesId: string;
  breedId: string;
  bornDate?: string | null;
  age?: string | null;
  ownerId?: string;
  owner?: IOwnerInput;
  sex: ESex;
  isSterilized: boolean;
}

interface IPetQueryFields {
  nickname?: string;
  speciesId?: string;
  breedId?: string;
  sex?: ESex;
  isSterilized?: boolean;
  ownerLastName?: string;
  ownerId?: string;
}

export type IPetQueryParams = {
  [K in keyof IPetQueryFields]-?: Required<Pick<IPetQueryFields, K>> & Partial<Omit<IPetQueryFields, K>>;
}[keyof IPetQueryFields];

export interface ILisService {
  _id: string;
  code: string;
  name: string;
}

export interface IOrderSample {
  _id: string;
  number: string;
  barcode: string;
  biomaterialId: string;
  biomaterialName: string;
  tubeId: string;
  tubeName: string;
}

export interface IOrder {
  _id: string;
  datetime: string;
  status: EOrderStatus;
  barcode: string;
  pet: IPet;
  owner: IOwner;
  analysis: string[];
  services: ILisService[];
  samples: IOrderSample[];
  doctor: string;
  clientName: string;
  referrerId: string;
}

export interface IOrderInput {
  petId: string;
  clientId: string;
  services: string[];
  referrerId?: string;
  doctorId?: string;
}

export interface IOrdersQueryParams {
  dateFrom?: string;
  dateTo?: string;
  barcode?: string;
  sampleNumber?: string;
  nickname?: string;
  speciesId?: string;
  breedId?: string;
  ownerLastName?: string;
  clientId?: string;
  status?: EOrderStatus;
  limit?: number;
  offset?: number;
}
