export interface ICredentials {
  username: string;
  password: string;
}

export interface IAuthRes {
  accessToken: string;
}

export interface IJwtPayload {
  iat: number;
  exp: number;
  sub: string;
  username: string;
  organizationName: string;
  isTemporalPassword: boolean;
  isAppointmentAccessed: boolean;
  isArchiveAccessed: boolean;
}
