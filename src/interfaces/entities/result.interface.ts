export interface IMethodNorm {
  _id: string;
  normTitle: string;
  normRange?: {
    min: number;
    max: number;
  };
  normText?: string;
}

export interface IMethodResult {
  _id: string;
  paramName: string;
  methodType: string;
  methodUnit?: string;
  resultString: string;
  resultXml: string;
  methodNorms?: IMethodNorm[];
  pathologyIndex?: number;
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
