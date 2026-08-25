import { IPatient } from '@/interfaces/entities/patient.interface';
import { EResultStatus, IMethodResult } from '@/interfaces/entities/result.interface';

export const concatText = (arr: string[], delimiter: string = ', '): string => {
  return arr.join(`${delimiter}`);
};

export const getPatientFullName = (patient: IPatient): string => {
  return `${patient.lastName} ${patient.firstName} ${patient.middleName}`;
};

export const formatDatetime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const addRussianPhonePrefix = (value: string): string => {
  if (!value || value.startsWith('+')) return value;
  return value.startsWith('7') ? `+${value}` : `+7${value}`;
};

export const formatUnitString = (input: string): string => {
  const regex = /(.*?)(e[-+]?\d+)(.*)/i;
  const match = input.match(regex);

  if (!match) {
    return input;
  }

  const before = match[1];
  const notation = match[2];
  const after = match[3];
  const exponentMatch = notation.match(/e([-+]?\d+)/i);
  const exponent = exponentMatch?.[1] ?? '';
  const superscriptExponent = exponent
    .replace('+', '')
    .replace(/-/g, '⁻')
    .replace(/\d/g, (digit: string) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[parseInt(digit, 10)]);

  return `${before}10${superscriptExponent}${after}`;
};

export const isPathologyResult = (methodResult: IMethodResult): boolean =>
  methodResult.status !== EResultStatus.NORMAL;
