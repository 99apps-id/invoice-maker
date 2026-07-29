export const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isSafeId = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value);

export const isText = (value: unknown, maxLength: number, required = false) =>
  typeof value === 'string' &&
  value.length <= maxLength &&
  (!required || value.trim().length > 0);

export const isFiniteNumber = (
  value: unknown,
  minimum: number,
  maximum: number
) => typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;
