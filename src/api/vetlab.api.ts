import { IApiRes } from '@/interfaces/app/api.interface';
import { IBreed } from '@/interfaces/entities/breed.interface';
import { IClient } from '@/interfaces/entities/client.interface';
import { IDynamics } from '@/interfaces/entities/dynamics.interface';
import { IDoctor } from '@/interfaces/entities/doctor.interface';
import {
  IArchiveOrderPreview,
  IArchiveQueryParams,
  IOrder,
  IOrderInput,
  IOrdersQueryParams,
  IOwnerCreateResult,
  IOwnerInput,
  IOwnerQueryParams,
  IOwnerRecord,
  IPetInput,
  IPetPreview,
  IPetQueryParams,
} from '@/interfaces/entities/order.interface';
import { IOrderResults } from '@/interfaces/entities/result.interface';
import { IReferrer } from '@/interfaces/entities/referrer.interface';
import { IService } from '@/interfaces/entities/service.interface';
import { ISpecies } from '@/interfaces/entities/species.interface';
import { handleApiRes } from '@/utils/handleApiRes.util';
import { AxiosError, AxiosInstance } from 'axios';

export class VetlabApi {
  constructor(
    private readonly api: AxiosInstance,
    private readonly publicApi: AxiosInstance = api,
  ) {}

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

  public async getReferrers(): Promise<IApiRes<IReferrer[]>> {
    return handleApiRes<IReferrer[]>(this.api.get('/dictionaries/referrers'));
  }

  public async getDoctors(): Promise<IApiRes<IDoctor[]>> {
    return handleApiRes<IDoctor[]>(this.api.get('/dictionaries/doctors'));
  }

  public async getServices(): Promise<IApiRes<IService[]>> {
    return handleApiRes<IService[]>(this.api.get('/dictionaries/services'));
  }

  public async getArchive(query?: IArchiveQueryParams): Promise<IApiRes<IArchiveOrderPreview[]>> {
    return handleApiRes<IArchiveOrderPreview[]>(this.api.get('/archive', { params: query }));
  }

  public async getArchiveOrder(orderId: string): Promise<IApiRes<IArchiveOrderPreview>> {
    return handleApiRes<IArchiveOrderPreview>(this.api.get(`/archive/${orderId}`));
  }

  public async getOrderResults(orderId: string): Promise<IApiRes<IOrderResults>> {
    return handleApiRes<IOrderResults>(this.api.get(`/results/${orderId}`));
  }

  public async getDynamics(patientId: string, groupId: string): Promise<IApiRes<IDynamics>> {
    return handleApiRes<IDynamics>(this.publicApi.get('/dynamics', { params: { patientId, groupId } }));
  }

  public async getPets(query: IPetQueryParams): Promise<IApiRes<IPetPreview[]>> {
    return handleApiRes<IPetPreview[]>(this.api.get('/pets', { params: query }));
  }

  public async getPet(petId: string): Promise<IApiRes<IPetPreview>> {
    return handleApiRes<IPetPreview>(this.api.get(`/pets/${petId}`));
  }

  public async createPet(payload: IPetInput): Promise<IApiRes<IPetPreview>> {
    return handleApiRes<IPetPreview>(this.api.post('/pets', payload));
  }

  public async updatePet(petId: string, payload: IPetInput): Promise<IApiRes<IPetPreview>> {
    return handleApiRes<IPetPreview>(this.api.patch(`/pets/${petId}`, payload));
  }

  public async getOwners(query: IOwnerQueryParams): Promise<IApiRes<IOwnerRecord[]>> {
    return handleApiRes<IOwnerRecord[]>(this.api.get('/owners', { params: query }));
  }

  public async getOwner(ownerId: string): Promise<IApiRes<IOwnerRecord>> {
    return handleApiRes<IOwnerRecord>(this.api.get(`/owners/${ownerId}`));
  }

  public async createOwner(payload: IOwnerInput): Promise<IApiRes<IOwnerCreateResult>> {
    return handleApiRes<IOwnerCreateResult>(this.api.post('/owners', payload));
  }

  public async updateOwner(ownerId: string, payload: IOwnerInput): Promise<IApiRes<IOwnerRecord>> {
    return handleApiRes<IOwnerRecord>(this.api.patch(`/owners/${ownerId}`, payload));
  }

  public async getOrders(query?: IOrdersQueryParams): Promise<IApiRes<IOrder[]>> {
    return handleApiRes<IOrder[]>(this.api.get('/orders', { params: query }));
  }

  public async getOrder(orderId: string): Promise<IApiRes<IOrder>> {
    return handleApiRes<IOrder>(this.api.get(`/orders/${orderId}`));
  }

  public async createOrder(payload: IOrderInput): Promise<IApiRes<IOrder>> {
    return handleApiRes<IOrder>(this.api.post('/orders', payload));
  }

  public async updateOrder(orderId: string, payload: IOrderInput): Promise<IApiRes<IOrder>> {
    return handleApiRes<IOrder>(this.api.patch(`/orders/${orderId}`, payload));
  }

  public async deleteOrder(orderId: string): Promise<IApiRes<void>> {
    return handleApiRes<void>(this.api.delete(`/orders/${orderId}`));
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
