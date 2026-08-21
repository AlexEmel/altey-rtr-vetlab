import { IPatient } from './patient.interface';

export enum EOrderStatus {
  RECEIVED = 'принят',
  DONE = 'готов',
  RESULTS = 'результаты',
}

export enum EViewStatus {
  NONE = 'none',
  ORDER_READY = 'orderReady',
  NAPR_READY = 'naprReady',
  NAPR_SIGNED = 'naprSigned',
  PRELIMINARY_RESULT = 'naprSignedOrPreliminaryResult',
}

export const ViewStatusWeight = {
  [EViewStatus.NONE]: 0,
  [EViewStatus.ORDER_READY]: 1,
  [EViewStatus.NAPR_READY]: 2,
  [EViewStatus.NAPR_SIGNED]: 3,
  [EViewStatus.PRELIMINARY_RESULT]: 4,
};

export interface IArchiveOrderPreview {
  _id: string;
  datetime: string;
  status: EOrderStatus;
  isPathology: boolean;
  isDefective: boolean;
  barcode: string[];
  sampleNumber: string;
  historyNumber: string;
  patient: IPatient;
  analysis: string[];
  doctor: string;
  departmentId: number;
  viewStatus: EViewStatus;
  isPrinted: boolean;
  externalFinanceSourceId: string;
}

export interface IArchiveQueryParams {
  dateFrom: string;
  dateTo: string;
  historyNumber?: string;
  barcode?: string;
  sampleNumber?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  departmentId?: number;
  analysisId?: string;
  isPathology?: boolean;
  isDefective?: boolean;
  limit?: number;
  offset?: number;
  externalFinanceSourceId?: string;
}
