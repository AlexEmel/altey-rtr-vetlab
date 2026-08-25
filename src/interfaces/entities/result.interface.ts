export interface IMethodNorm {
  normTitle: string;
  normRange?: {
    min?: number;
    max?: number;
  };
  normText?: string;
}

export enum EResultStatus {
  NORMAL = 'NORMAL',
  PATHOLOGY = 'PATHOLOGY',
  LOW = 'LOW',
  HIGH = 'HIGH',
  CRITICAL_LOW = 'CRITICAL_LOW',
  CRITICAL_HIGH = 'CRITICAL_HIGH',
}

export interface IMethodResult {
  _id: string;
  testName: string;
  methodType: string;
  methodUnit?: string;
  value: string;
  status: EResultStatus;
  methodNorms?: IMethodNorm[];
}

export interface IGroupResults {
  _id: string;
  groupId: string;
  groupName: string;
  methodResults: IMethodResult[];
  barcode: string;
  sampleNumber: string;
}

export interface IOrderResults {
  orderId: string;
  patientId: string;
  groupResults: IGroupResults[];
}
