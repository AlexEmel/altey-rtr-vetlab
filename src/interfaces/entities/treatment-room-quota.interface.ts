export interface ITreatmentRoomQuota {
  troomId: string;
  quotaId: string;
  workDay: string;
  quotaName: string;
  quotaStart: string;
  quotaEnd: string;
  isActive: boolean;
  isReserved: boolean;
}

export type TQuotasCalendar = Map<number, Map<number, Map<number, ITreatmentRoomQuota[]>>>;