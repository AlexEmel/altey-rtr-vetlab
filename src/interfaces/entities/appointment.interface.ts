export enum EAppointmentPatientSex {
  NONE = 'none',
  MALE = 'male',
  FEMALE = 'female',
}

export enum EAppointmentStatus {
  UNCONFIRMED = 'new',
  CONFIRMED = 'confirmed',
}

export type TAppointmentStatus = EAppointmentStatus;

export interface IAppointmentQuota {
  _id: string;
  quotaId: string;
  quotaName: string;
  workDay: string;
  dayType: string;
  quotaStart: string;
  quotaEnd: string;
  isActive: boolean;
  isReserved: boolean;
}

export interface IAppointmentPatient {
  _id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  sex: EAppointmentPatientSex;
  phone: string;
}

export interface IAppointmentService {
  serviceCode: string;
  serviceName: string;
}

export interface IAppointment {
  _id: string;
  datetime: string;
  troomId: string;
  troomName: string;
  quota: IAppointmentQuota;
  status: TAppointmentStatus;
  patient: IAppointmentPatient;
  departmentId?: string;
  insuranceTypeId?: string;
  services?: IAppointmentService[];
  createdBy: string;
}

export interface INewAppointment {
  troomId: string;
  quotaId: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  sex: EAppointmentPatientSex;
  phone: string;
  departmentId?: string;
  insuranceTypeId?: string;
  services: IAppointmentService[];
}

export interface IGetAppointmentsQueryParams {
  dateFrom: string;
  dateTo: string;
  troomId?: string;
  phone?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  departmentId?: string;
  insuranceTypeId?: string;
  status?: TAppointmentStatus;
  limit?: number;
  offset?: number;
}
