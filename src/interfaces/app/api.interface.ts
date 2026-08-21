export interface IApiError {
  code: string;
  message: string;
}

export interface IApiRes<T> {
  success: boolean;
  payload?: T;
  error?: IApiError;
}
