import { IResultViewRules } from '@/features/user.slice';
import { IApiRes } from '@/interfaces/app/api.interface';
import {
  IAppointment,
  INewAppointment,
  IGetAppointmentsQueryParams,
} from '@/interfaces/entities/appointment.interface';
import { IDepartment } from '@/interfaces/entities/department.interface';
import { IAnalysisType } from '@/interfaces/entities/analysis-type.interface';
import { IDynamics } from '@/interfaces/entities/dynamics.interface';
import { IExternalFinanceSource } from '@/interfaces/entities/external-finance-source.interface';
import { IInsuranceType } from '@/interfaces/entities/insurance-type.interface';
import { IArchiveOrderPreview, IArchiveQueryParams } from '@/interfaces/entities/order.interface';
import { IOrderResults } from '@/interfaces/entities/result.interface';
import { ITreatmentRoomQuota } from '@/interfaces/entities/treatment-room-quota.interface';
import { ITreatmentRoom } from '@/interfaces/entities/treatment-room.interface';
import { handleApiRes } from '@/utils/handleApiRes.util';
import { AxiosInstance } from 'axios';

export class RtrApi {
  private api: AxiosInstance;
  private path: string;

  constructor(api: AxiosInstance) {
    this.api = api;
    this.path = '/remote_treatment_room/RemoteTreatmentRoom';
  }

  public async setPassword(password: string) {
    return await handleApiRes<void>(this.api.post(`${this.path}/SetPassword`, { password }));
  }

  public async getDepartments(): Promise<IApiRes<IDepartment[]>> {
    return await handleApiRes<IDepartment[]>(this.api.get(`${this.path}/GetDepartments`));
  }

  public async getAnalysisTypes(): Promise<IApiRes<IAnalysisType[]>> {
    return await handleApiRes<IAnalysisType[]>(this.api.get(`${this.path}/GetAnalysisTypes`));
  }

  public async getInsuranceTypes(): Promise<IApiRes<IInsuranceType[]>> {
    return await handleApiRes<IInsuranceType[]>(this.api.get(`${this.path}/GetInsuranceTypes`));
  }

  public async getArchive(query?: IArchiveQueryParams): Promise<IApiRes<IArchiveOrderPreview[]>> {
    return await handleApiRes<IArchiveOrderPreview[]>(
      this.api.get(`${this.path}/GetArchive`, { params: query }),
    );
  }

  public async getPdfByOrderId(id: string, params?: IResultViewRules): Promise<IApiRes<string>> {
    return await handleApiRes<string>(this.api.get(`${this.path}/GetResults/${id}`, { params }));
  }

  public async getResultsByOrderId(id: string, params?: IResultViewRules): Promise<IApiRes<IOrderResults>> {
    return await handleApiRes<IOrderResults>(
      this.api.get(`${this.path}/GetResultsData/${id}`, { params: { view: params?.view } }),
    );
  }

  public async getDynamics(patientId: string, groupId: string): Promise<IApiRes<IDynamics>> {
    return await handleApiRes<IDynamics>(
      this.api.get(`${this.path}/getDynamics`, { params: { patientId, groupId } }),
    );
  }

  public async getExternalFinanceSources(): Promise<IApiRes<IExternalFinanceSource[]>> {
    return await handleApiRes<IExternalFinanceSource[]>(
      this.api.get(`${this.path}/GetExternalFinanceSources`),
    );
  }

  public async getTreatmentRooms(): Promise<IApiRes<ITreatmentRoom[]>> {
    return await handleApiRes<ITreatmentRoom[]>(this.api.get(`${this.path}/GetTreatmentRooms`));
  }

  public async getTreatmentRoomQuotas(troomId: string): Promise<IApiRes<ITreatmentRoomQuota[]>> {
    return await handleApiRes<ITreatmentRoomQuota[]>(
      this.api.get(`${this.path}/GetTreatmentRoomQuotas`, { params: { troomId } }),
    );
  }

  public async disableQuotas(ids: string[]): Promise<IApiRes<void>> {
    return await handleApiRes<void>(this.api.post(`${this.path}/DisableQuotas`, ids));
  }

  public async enableQuotas(ids: string[]): Promise<IApiRes<void>> {
    return await handleApiRes<void>(this.api.post(`${this.path}/EnableQuotas`, ids));
  }

  public async createAppointment(query: INewAppointment): Promise<IApiRes<IAppointment>> {
    return await handleApiRes<IAppointment>(this.api.post(`${this.path}/CreateAppointment`, query));
  }

  public async confirmAppointment(id: string): Promise<IApiRes<IAppointment>> {
    return await handleApiRes<IAppointment>(this.api.post(`${this.path}/ConfirmAppointment`, { id }));
  }

  public async editAppointment(id: string, payload: INewAppointment): Promise<IApiRes<IAppointment>> {
    return await handleApiRes<IAppointment>(this.api.patch(`${this.path}/EditAppointment/${id}`, payload));
  }

  public async deleteAppointment(id: string): Promise<IApiRes<void>> {
    return await handleApiRes<void>(this.api.post(`${this.path}/DeleteAppointment`, { id }));
  }

  public async getAppointments(query?: IGetAppointmentsQueryParams): Promise<IApiRes<IAppointment[]>> {
    return await handleApiRes<IAppointment[]>(
      this.api.get(`${this.path}/GetAppointments`, { params: query }),
    );
  }
}
