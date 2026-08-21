export interface IDynamicResult {
  _id: string;
  valueMin: number | null;
  valueMax: number | null;
  valueString: string;
  isPathology: boolean;
  datetime: string;
}

export interface IDynamicNorm {
  low: number | null;
  high: number | null;
  totalNorm: string;
}

export interface IDynamicParam {
  _id: string;
  paramName: string;
  unit: string;
  norm: IDynamicNorm;
  results: IDynamicResult[];
}

export interface IDynamics {
  patientId: string;
  groupId: string;
  groupName: string;
  params: IDynamicParam[];
}
