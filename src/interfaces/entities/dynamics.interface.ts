import { EResultStatus } from './result.interface';

export interface IDynamicResult {
  value: number;
  datetime: string;
  status: EResultStatus;
}

export interface IDynamicGroup {
  testId: string;
  testName: string;
  unit: string;
  normalLow: number;
  normalHigh: number;
  dynamicResults: IDynamicResult[];
}

export interface IDynamics {
  patientId: string;
  groupId: string;
  groupName: string;
  groupDynamics: IDynamicGroup[];
}
