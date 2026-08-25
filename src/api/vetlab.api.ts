import { IApiRes } from '@/interfaces/app/api.interface';
import { IBreed } from '@/interfaces/entities/breed.interface';
import { IClient } from '@/interfaces/entities/client.interface';
import { IArchiveOrderPreview, IArchiveQueryParams } from '@/interfaces/entities/order.interface';
import { ISpecies } from '@/interfaces/entities/species.interface';
import { handleApiRes } from '@/utils/handleApiRes.util';
import { AxiosError, AxiosInstance } from 'axios';

export class VetlabApi {
  constructor(private readonly api: AxiosInstance) {}

  public async setPassword(password: string): Promise<IApiRes<void>> {
    return handleApiRes<void>(this.api.post('/auth/set-password', { password }));
  }

  public async getSpecies(): Promise<IApiRes<ISpecies[]>> {
    return handleApiRes<ISpecies[]>(this.api.get('/dictionaries/species'));
  }

  public async getBreeds(): Promise<IApiRes<IBreed[]>> {
    return handleApiRes<IBreed[]>(this.api.get('/dictionaries/breeds'));
  }

  public async getClients(): Promise<IApiRes<IClient[]>> {
    return handleApiRes<IClient[]>(this.api.get('/dictionaries/clients'));
  }

  public async getArchive(query?: IArchiveQueryParams): Promise<IApiRes<IArchiveOrderPreview[]>> {
    return handleApiRes<IArchiveOrderPreview[]>(this.api.get('/archive', { params: query }));
  }

  public async getFormsPdf(orderId: string): Promise<IApiRes<Blob>> {
    try {
      const response = await this.api.get<Blob>(`/forms/${orderId}`, { responseType: 'blob' });
      return { success: true, payload: response.data };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Result form not found' } };
      }
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Unable to load result form' } };
    }
  }
}
