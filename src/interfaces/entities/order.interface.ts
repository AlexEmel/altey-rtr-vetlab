export enum EOrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  RESULTS = 'RESULTS',
  DONE = 'DONE',
}

export enum ESex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
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
  status: EOrderStatus;
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
  status?: EOrderStatus;
  isPathology?: boolean;
  isDefective?: boolean;
  limit?: number;
  offset?: number;
}
