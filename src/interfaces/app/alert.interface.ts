export interface IAlertData {
  type: 'success' | 'warning' | 'error';
  message: string;
}

export interface IAlert extends IAlertData {
  _id: string;
  datetime: string;
  isDispatched: boolean;
}
