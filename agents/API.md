# Remote Treatment Room API Guide

## Purpose

This document describes the API contract used by the current frontend implementation of the Remote Treatment Room client.

The implementation is the source of truth. When updating API-related code, follow the behavior and types defined in:

- `src/api/`
- `src/interfaces/`
- Redux slices and their API consumers

## General Rules

- Add all Remote Treatment Room requests to the API classes in `src/api/`.
- Do not call Axios directly from pages, components, or forms.
- Use the configured Axios instances from `src/api/index.api.ts`.
- Normalize API responses through `handleApiRes`.
- Reuse existing TypeScript interfaces first and extend them only when necessary.
- Keep endpoint names, casing, HTTP methods, and parameter locations exactly as implemented unless the task explicitly changes the contract.
- After changing API code, run at least `npm run build`; run `npm run lint` when practical.

## Base Configuration

### Base URLs

- `VITE_API_URL` is the main API base URL.

### Axios Clients

- `authAxios` is used by `AuthApi`.
- `apiAxios` is used by `RtrApi`.

### Authorization

Both `authAxios` and `apiAxios` attach the current token as:

```http
Authorization: Bearer <token>
```

The token is read from `store.user.token`.

`apiAxios` also has a response interceptor:

- on `401`, it dispatches `logout()`
- it then rejects with `Error('Unauthorized')`

Because of that interceptor, some `401` responses on protected endpoints may bypass server-provided error payloads and end up as the fallback internal error from `handleApiRes`.

## Common Response Shape

Shared response types are defined in `src/interfaces/app/api.interface.ts`.

```ts
export interface IApiError {
  code: string;
  message: string;
}

export interface IApiRes<T> {
  success: boolean;
  payload?: T;
  error?: IApiError;
}
```

`handleApiRes` returns:

- `res.data` on success
- `{ success: false, error }` when Axios receives an error response containing `data.error`
- a fallback internal error otherwise, with code `INTERNAL_ERROR` and a hardcoded localized message from `handleApiRes`

## Auth API

Base path:

```txt
/auth/RemoteTreatmentRoom
```

### `POST /auth/RemoteTreatmentRoom/Login`

Request body:

```ts
interface ICredentials {
  username: string;
  password: string;
}
```

Success payload:

```ts
interface IAuthRes {
  accessToken: string;
}
```

JWT payload used by the client:

```ts
interface IJwtPayload {
  iat: number;
  exp: number;
  sub: string;
  username: string;
  organizationName: string;
  isTemporalPassword: boolean;
  isAppointmentAccessed: boolean;
  isArchiveAccessed: boolean;
}
```

Client behavior after login:

- the token is stored in Redux
- the JWT is decoded on the client
- if `isTemporalPassword` is `true`, the user is treated as not fully logged in and must set a new password

## RTR API

Base path:

```txt
/remote_treatment_room/RemoteTreatmentRoom
```

### `POST /remote_treatment_room/RemoteTreatmentRoom/SetPassword`

Request body:

```ts
{ password: string }
```

Response:

- `IApiRes<void>`

## Dictionaries

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetDepartments`

Payload:

```ts
interface IDepartment {
  _id: string;
  name: string;
  parentId: string;
}
```

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetAnalysisTypes`

Payload:

```ts
interface IAnalysisType {
  _id: string;
  name: string;
}
```

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetInsuranceTypes`

Payload:

```ts
interface IInsuranceType {
  _id: string;
  name: string;
}
```

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetExternalFinanceSources`

Payload:

```ts
interface IExternalFinanceSource {
  _id: string;
  name: string;
  code: string;
  sourceId: string;
  sourceName: string;
}
```

## Archive

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetArchive`

Query params:

```ts
interface IArchiveQueryParams {
  dateFrom: string;
  dateTo: string;
  historyNumber?: string;
  barcode?: string;
  sampleNumber?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  departmentId?: number;
  analysisId?: string;
  isPathology?: boolean;
  isDefective?: boolean;
  limit?: number;
  offset?: number;
  externalFinanceSourceId?: string;
}
```

Payload item:

```ts
interface IArchiveOrderPreview {
  _id: string;
  datetime: string;
  status: EOrderStatus;
  isPathology: boolean;
  isDefective: boolean;
  barcode: string[];
  sampleNumber: string;
  historyNumber: string;
  patient: IPatient;
  analysis: string[];
  doctor: string;
  departmentId: number;
  viewStatus: EViewStatus;
  isPrinted: boolean;
  externalFinanceSourceId: string;
}
```

Supporting types:

```ts
interface IPatient {
  _id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  bornDate: string;
}

enum EOrderStatus {
  RECEIVED = '<localized status string>',
  DONE = '<localized status string>',
  RESULTS = '<localized status string>',
}

enum EViewStatus {
  NONE = 'none',
  ORDER_READY = 'orderReady',
  NAPR_READY = 'naprReady',
  NAPR_SIGNED = 'naprSigned',
  PRELIMINARY_RESULT = 'naprSignedOrPreliminaryResult',
}
```

## Results

Result view params come from `user.slice.ts`:

```ts
enum EResultViewRule {
  ORDER_DONE = 1,
  NAPR_DONE = 2,
  NAPR_SIGNED = 3,
  PRELIMINARY_RESULT = 4,
}

enum EResultViewType {
  REGULAR = 0,
  MERGED = 1,
  ENG = 2,
}

interface IResultViewRules {
  view: EResultViewRule;
  type: EResultViewType;
  attachments: boolean;
}
```

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetResults/{id}`

- `id` is passed as a path parameter
- optional query params use `IResultViewRules`

Response (pdf base64 string):

- `IApiRes<string>`


### `GET /remote_treatment_room/RemoteTreatmentRoom/GetResultsData/{id}`

- `id` is passed as a path parameter
- only `view` is sent as a query param

Payload:

```ts
interface IOrderResults {
  orderId: string;
  patientId: string;
  groupResults: IGroupResults[];
}

interface IGroupResults {
  _id: string;
  groupId: string;
  groupName: string;
  methodResults: IMethodResult[];
  barcode: string;
  sampleNumber: string;
}

interface IMethodResult {
  _id: string;
  paramName: string;
  methodType: string;
  methodUnit?: string;
  resultString: string;
  resultXml: string;
  methodNorms?: IMethodNorm[];
  pathologyIndex?: number;
}

interface IMethodNorm {
  _id: string;
  normTitle: string;
  normRange?: {
    min: number;
    max: number;
  };
  normText?: string;
}
```

## Dynamics

### `GET /remote_treatment_room/RemoteTreatmentRoom/getDynamics`

Query params:

```ts
{
  patientId: string;
  groupId: string;
}
```

Payload:

```ts
interface IDynamics {
  patientId: string;
  groupId: string;
  groupName: string;
  params: IDynamicParam[];
}

interface IDynamicParam {
  _id: string;
  paramName: string;
  unit: string;
  norm: IDynamicNorm;
  results: IDynamicResult[];
}

interface IDynamicNorm {
  low: number | null;
  high: number | null;
  totalNorm: string;
}

interface IDynamicResult {
  _id: string;
  valueMin: number | null;
  valueMax: number | null;
  valueString: string;
  isPathology: boolean;
  datetime: string;
}
```

## Treatment Rooms and Quotas

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetTreatmentRooms`

Payload:

```ts
interface ITreatmentRoom {
  _id: string;
  name: string;
}
```

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetTreatmentRoomQuotas`

Query params:

```ts
{ troomId: string }
```

Payload:

```ts
interface ITreatmentRoomQuota {
  troomId: string;
  quotaId: string;
  workDay: string;
  quotaName: string;
  quotaStart: string;
  quotaEnd: string;
  isActive: boolean;
  isReserved: boolean;
}
```

### `POST /remote_treatment_room/RemoteTreatmentRoom/DisableQuotas`

Request body:

```json
["quota-id-1", "quota-id-2"]
```

Response:

- `IApiRes<void>`

### `POST /remote_treatment_room/RemoteTreatmentRoom/EnableQuotas`

Request body:

```json
["quota-id-1", "quota-id-2"]
```

Response:

- `IApiRes<void>`

## Appointments

Supporting types:

```ts
enum EAppointmentPatientSex {
  NONE = 'none',
  MALE = 'male',
  FEMALE = 'female',
}

enum EAppointmentStatus {
  UNCONFIRMED = 'new',
  CONFIRMED = 'confirmed',
}

type TAppointmentStatus = EAppointmentStatus;

interface IAppointmentService {
  serviceCode: string;
  serviceName: string;
}
```

### `POST /remote_treatment_room/RemoteTreatmentRoom/CreateAppointment`

Request body:

```ts
interface INewAppointment {
  troomId: string;
  quotaId: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  sex: EAppointmentPatientSex;
  phone: string;
  departmentId?: string;
  insuranceTypeId?: string;
  services: IAppointmentService[];
}
```

Response payload:

```ts
interface IAppointment {
  _id: string;
  datetime: string;
  troomId: string;
  troomName: string;
  quota: IAppointmentQuota;
  status: TAppointmentStatus;
  patient: IAppointmentPatient;
  departmentId?: string;
  insuranceTypeId?: string;
  services?: IAppointmentService[];
  createdBy: string;
}

interface IAppointmentQuota {
  _id: string;
  quotaId: string;
  quotaName: string;
  workDay: string;
  dayType: string;
  quotaStart: string;
  quotaEnd: string;
  isActive: boolean;
  isReserved: boolean;
}

interface IAppointmentPatient {
  _id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  sex: EAppointmentPatientSex;
  phone: string;
}
```

### `POST /remote_treatment_room/RemoteTreatmentRoom/ConfirmAppointment`

Request body:

```ts
{ id: string }
```

Response:

- `IApiRes<IAppointment>`

### `PATCH /remote_treatment_room/RemoteTreatmentRoom/EditAppointment/{id}`

- `id` is a path parameter

Request body:

- `INewAppointment`

Response:

- `IApiRes<IAppointment>`

### `POST /remote_treatment_room/RemoteTreatmentRoom/DeleteAppointment`

Request body:

```ts
{ id: string }
```

Response:

- `IApiRes<void>`

### `GET /remote_treatment_room/RemoteTreatmentRoom/GetAppointments`

Query params:

```ts
interface IGetAppointmentsQueryParams {
  dateFrom: string;
  dateTo: string;
  troomId?: string;
  phone?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  departmentId?: string;
  insuranceTypeId?: string;
  status?: TAppointmentStatus;
  limit?: number;
  offset?: number;
}
```

Response:

- `IApiRes<IAppointment[]>`


## Change Checklist

Before finishing API-related work, verify:

1. The endpoint path, method, casing, and pluralization match the implemented client.
2. Path params, query params, and request body fields are sent in the same locations as the current code.
3. Protected endpoints use `apiAxios`; auth endpoints use `authAxios`.
4. Response types match the existing interfaces, including optional and nullable fields.
5. `handleApiRes` is still used for response normalization.
6. Any contract change is reflected across interfaces, API classes, slices, and UI consumers.
7. The project still builds successfully.
