import { IAuthRes, ICredentials } from '@/interfaces/app/auth.interface';
import { handleApiRes } from '@/utils/handleApiRes.util';
import { AxiosInstance } from 'axios';

export class AuthApi {
  private api: AxiosInstance;
  private path: string;

  constructor(api: AxiosInstance) {
    this.api = api;
    this.path = '/auth';
  }

  public async login(credentials: ICredentials) {
    return await handleApiRes<IAuthRes>(this.api.post(`${this.path}/login`, credentials));
  }
}
