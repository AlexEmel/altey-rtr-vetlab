export interface ICredentials {
  username: string;
  password: string;
}

export interface IAuthRes {
  accessToken: string;
  username: string;
  organizationName: string;
  isTemporalPassword: boolean;
}

export interface IUserInfo {
  username: string;
  organizationName: string;
}
