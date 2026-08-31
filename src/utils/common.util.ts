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

export const normalizeRussianPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  const normalizedDigits = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits.startsWith('7')
      ? digits
      : `7${digits}`;

  return `+${normalizedDigits.slice(0, 11)}`;
};

export const maskRussianPhone = (value: string): string => {
  const normalized = normalizeRussianPhone(value);
  const digits = normalized.replace(/\D/g, '');

  if (!digits) return '';

  const localDigits = digits.slice(1);
  const part1 = localDigits.slice(0, 3);
  const part2 = localDigits.slice(3, 6);
  const part3 = localDigits.slice(6, 8);
  const part4 = localDigits.slice(8, 10);

  let masked = '+7';

  if (part1) masked += ` (${part1}`;
  if (part1.length === 3) masked += ')';
  if (part2) masked += ` ${part2}`;
  if (part3) masked += `-${part3}`;
  if (part4) masked += `-${part4}`;

  return masked;
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
