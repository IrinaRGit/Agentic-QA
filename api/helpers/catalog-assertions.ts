import { expect } from '../../fixtures/cleanup.fixture';
import { CATALOG_JSON_CONTENT_TYPE } from '../../support/api.constants';

/** Assert Content-Type matches the catalog probe (`application/json; charset=utf-8`). */
export function expectCatalogJsonContentType(contentType: string | undefined): void {
  expect(contentType).toBe(CATALOG_JSON_CONTENT_TYPE);
}

export function expectPlainObject(value: unknown): asserts value is Record<string, unknown> {
  expect(value).not.toBeNull();
  expect(typeof value).toBe('object');
  expect(Array.isArray(value)).toBe(false);
}

export function expectTopLevelType(
  body: Record<string, unknown>,
  field: string,
  kind: 'object' | 'boolean' | 'string' | 'number' | 'array',
): void {
  expect(body).toHaveProperty(field);
  const value = body[field];
  switch (kind) {
    case 'object':
      expectPlainObject(value);
      break;
    case 'boolean':
      expect(typeof value).toBe('boolean');
      break;
    case 'string':
      expect(typeof value).toBe('string');
      break;
    case 'number':
      expect(typeof value).toBe('number');
      break;
    case 'array':
      expect(Array.isArray(value)).toBe(true);
      break;
  }
}
