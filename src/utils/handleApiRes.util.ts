import { IApiRes } from '@/interfaces/app/api.interface';
import { AxiosError, AxiosResponse } from 'axios';

export const handleApiRes = async <T>(request: Promise<AxiosResponse<T>>): Promise<IApiRes<T>> => {
  try {
    const res = await request;
    return res.data as IApiRes<T>;
  } catch (err) {
    if (err instanceof AxiosError) {
      const axiosErr = err as AxiosError<IApiRes<unknown>>;
      if (axiosErr.response?.data?.error) {
        return {
          success: false,
          error: axiosErr.response.data.error,
        };
      }
    }
    return {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Внутренняя ошибка сервера' },
    };
  }
};
