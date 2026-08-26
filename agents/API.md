# VetLab API Guide

## Purpose

This document defines the REST API contract for the VetLab client. The sole source of truth is `agents/УПК_ВЕТЛАБ_ТЗ.docx`; do not infer or retain Remote Treatment Room (RTR) contracts from the current codebase.

When implementing API code, model requests and responses from this guide. If the technical specification changes, update this document and the relevant TypeScript interfaces together.

## General Contract

- Base URL: `http(s)://%server-name%/`.
- JSON fields use `camelCase`.
- Dates and date-times are ISO strings with a timezone where supplied by the API.
- Endpoints marked as protected require `Authorization: Bearer <token>`.
- Unless stated otherwise, responses use the envelope below.

```ts
interface IApiError {
  code?: string;
  message?: string;
}

interface IApiRes<T> {
  success: boolean;
  payload?: T;
  error?: IApiError | string;
}
```

The specification defines statuses `200`, `201`, `204`, `400`, `403`, `404`, and `500`. A missing or invalid token returns `403`; invalid query keys or values return `400`.

## Authentication

### `POST /auth/login`

```ts
interface ICredentials {
  username: string;
  password: string;
}

interface IAuthRes {
  accessToken: string;
  username: string;
  organizationName: string;
  isTemporalPassword: boolean;
}
```

User information and the temporary-password flag are returned in the response payload and must not be decoded from the access token. The client treats `accessToken` as opaque.

Invalid credentials return `401`. When `isTemporalPassword` is `true`, the returned token may only be used to set a permanent password.

### `POST /auth/set-password`

Protected. Body: `{ password: string }`. Returns `IApiRes<void>`. The endpoint is available only to a token with `isTemporalPassword: true`; otherwise it returns `400`. The new password must differ from the temporary password.

## LIS Dictionaries

All dictionary endpoints are protected and return an empty array when no records are found.

| Method and path | Payload item |
| --- | --- |
| `GET /dictionaries/species` | `{ _id: string; name: string }` |
| `GET /dictionaries/breeds` | `{ _id: string; name: string; speciesId: string }` |
| `GET /dictionaries/clients` | `{ _id: string; name: string; groupId: string; groupName: string }` |
| `GET /dictionaries/referrers` | `{ _id: string; name: string }` |
| `GET /dictionaries/doctors` | `{ _id: string; name: string }` |
| `GET /dictionaries/services` | `{ _id: string; code: string; name: string; groupId: string; groupName: string; price: number }` |

Every response is `IApiRes<T[]>`.

## LIS Archive and Results

### `GET /archive`

Protected. Returns orders created by the authenticated counterparty. All filters are optional and can be combined:

```ts
interface IArchiveQuery {
  dateFrom?: string;
  dateTo?: string;
  barcode?: string;
  sampleNumber?: string;
  nickname?: string;
  speciesId?: string;
  breedId?: string;
  ownerLastName?: string;
  clientId?: string;
  status?: ELisOrderStatus;
  isPathology?: boolean;
  isDefective?: boolean;
  limit?: number;
  offset?: number;
}
```

```ts
interface IPet {
  _id: string;
  nickname: string;
  speciesId: string;
  breedId: string | null;
  sex: ESex;
  bornDate: string | null;
  age: string | null;
  isSterilized: boolean;
}

interface IOwner {
  _id?: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  bornDate: string | null;
  email: string | null;
  phone: string | null;
  snils: string | null;
}

interface ILisService {
  _id: string;
  code: string;
  name: string;
}

interface IArchiveOrder {
  _id: string;
  datetime: string;
  status: ELisOrderStatus;
  isPathology: boolean;
  isDefective: boolean;
  barcode: string;
  sampleNumber: string;
  historyNumber: string;
  pet: IPet;
  owner: IOwner;
  analysis: string[];
  doctor: string;
  clientName: string;
  isPrinted: boolean;
}
```

Response: `IApiRes<IArchiveOrder[]>`.

### `GET /archive/{id}`

Protected. Returns `IApiRes<IArchiveOrder & { services: ILisService[] }>` and `404` when the LIS order does not exist.

### `GET /forms/{id}`

Protected. Returns a binary PDF, not the JSON response envelope. Returns `404` when the order is missing and `403` when it is outside the user's permitted scope.

### `GET /results/{id}`

Protected. Returns structured analytical results:

```ts
interface IOrderResults {
  orderId: string;
  patientId: string;
  groupResults: IResultGroup[];
}

interface IResultGroup {
  _id: string;
  groupId: string;
  groupName: string;
  barcode?: string;
  sampleNumber?: string;
  methodResults: IMethodResult[];
}

interface IMethodResult {
  _id: string;
  // The text calls this `testName`; the supplied response example uses `paramName`.
  paramName: string;
  methodType: string;
  methodUnit?: string;
  value: string;
  status: EResultStatus;
  methodNorms?: IMethodNorm[];
}

interface IMethodNorm {
  normTitle: string;
  normRange?: { min?: number; max?: number };
  normText?: string;
}
```

Response: `IApiRes<IOrderResults>`. `404` means the order is missing or has no results. The field name for an analyte must be confirmed with the backend: the narrative specifies `testName`, while its JSON example specifies `paramName`.

### `GET /dynamics`

The specification does not mark this endpoint as protected. Required query parameters: `patientId` and `groupId`.

```ts
interface IDynamics {
  patientId: string;
  groupId: string;
  groupName: string;
  groupDynamics: IDynamicGroup[];
}

interface IDynamicGroup {
  testId: string;
  testName: string;
  unit: string;
  normalLow: number;
  normalHigh: number;
  dynamicResults: Array<{ value: number; datetime: string; status: EResultStatus }>;
}
```

Response: `IApiRes<IDynamics>`.

## Pets and Owners

All `/pets` and `/owners` endpoints are protected and require `Authorization: Bearer <token>`.

### Pets

`GET /pets` requires at least one of `nickname`, `speciesId`, `breedId`, `sex`, `isSterilized`, `ownerLastName`, or `ownerId`. It returns at most the latest 100 matching records.

```ts
interface IPetPreview extends IPet {
  ownerId: string;
  ownerLastName: string;
}

interface IPetInput {
  nickname: string;
  speciesId: string;
  breedId: string;
  bornDate?: string | null;
  age?: string | null;
  ownerId?: string;
  owner?: IOwnerInput;
  sex: ESex;
  isSterilized: boolean;
}
```

| Method and path | Request / response |
| --- | --- |
| `GET /pets` | `IApiRes<IPetPreview[]>` |
| `GET /pets/{id}` | `IApiRes<IPetPreview>`; `404` if missing |
| `POST /pets` | `IPetInput` -> `IApiRes<IPetPreview>`; `400` on validation failure |
| `PATCH /pets/{id}` | `IPetInput` -> `IApiRes<IPetPreview>`; `400` on validation failure |

`owner` creates a new owner when `ownerId` is not supplied.

### Owners

```ts
interface IOwnerInput {
  lastName: string;
  firstName: string;
  middleName?: string | null;
  phone: string;
  email?: string | null;
  bornDate: string;
  snils?: string | null;
}

interface IOwnerRecord extends IOwnerInput {
  _id: string;
}
```

| Method and path | Request / response |
| --- | --- |
| `GET /owners` | Search by owner fields; `IApiRes<IOwnerRecord[]>` |
| `GET /owners/{id}` | `IApiRes<IOwnerRecord>`; `404` if missing |
| `POST /owners` | `IOwnerInput` -> `IApiRes<IOwnerRecord>`; `400` on validation failure |
| `PATCH /owners/{id}` | `IOwnerInput` -> `IApiRes<IOwnerRecord>`; `400` on validation failure |

The owner-create example returns `id`, while owner search and detail responses use `_id`. Keep this discrepancy visible until the backend contract is confirmed; do not silently normalize it in API types.

## VetLab Orders

### `GET /orders`

Protected. Returns orders created in the remote VetLab cabinet. The optional filters are `dateFrom`, `dateTo`, `barcode`, `sampleNumber`, `nickname`, `speciesId`, `breedId`, `ownerLastName`, `clientId`, `status`, `limit`, and `offset`.

```ts
interface IOrderSample {
  _id: string;
  number: string;
  barcode: string;
  biomaterialId: string;
  biomaterialName: string;
  tubeId: string;
  tubeName: string;
}

interface IOrderDetail {
  _id: string;
  datetime: string;
  status: EOrderStatus;
  barcode: string;
  pet: IPet;
  owner: IOwner;
  analysis: string[];
  services: ILisService[];
  samples: IOrderSample[];
  doctor: string;
  clientName: string;
  referrerId: string;
}

interface IOrderInput {
  petId: string;
  clientId: string;
  services: string[];
  referrerId?: string;
  doctorId?: string;
}
```

`referrerId` and `doctorId` are optional when creating or editing an order.

| Method and path | Request / response |
| --- | --- |
| `GET /orders` | `IApiRes<IOrderDetail[]>`; list items may be less detailed |
| `GET /orders/{id}` | `IApiRes<IOrderDetail>`; `404` if missing |
| `POST /orders` | `IOrderInput` -> `IApiRes<IOrderDetail>`; `400` on validation failure |
| `PATCH /orders/{id}` | `IOrderInput` -> `IApiRes<IOrderDetail>`; `400` or `404` |
| `DELETE /orders/{id}` | `IApiRes<void>`; `404` if missing |

An order cannot be deleted after it has been accepted by the laboratory or has saved research results.

## Enumerations

```ts
enum ESex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum ELisOrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  RESULTS = 'RESULTS',
  DONE = 'DONE',
}

enum EOrderStatus {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
}

enum EResultStatus {
  NORMAL = 'NORMAL',
  PATHOLOGY = 'PATHOLOGY',
  LOW = 'LOW',
  HIGH = 'HIGH',
  CRITICAL_LOW = 'CRITICAL_LOW',
  CRITICAL_HIGH = 'CRITICAL_HIGH',
}
```

## Implementation Checklist

Before finishing API work, verify:

1. The method, path, casing, and parameter placement match this guide and the VetLab technical specification.
2. Protected endpoints send the bearer token. This includes every `/pets` and `/owners` endpoint. Endpoints not marked as protected are not implicitly made protected.
3. Binary PDF responses from `/forms/{id}` bypass JSON-envelope handling.
4. Nullable and optional fields remain distinct in TypeScript types.
5. The old RTR contract is not reused.
