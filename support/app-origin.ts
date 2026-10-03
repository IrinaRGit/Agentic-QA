/** Playwright baseURL must be the app origin only (no path). */
export function appOrigin(): string {
  const raw = process.env.APP_URL?.trim();
  if (!raw) {
    throw new Error(
      'APP_URL is missing. Copy .env.example to .env and set APP_URL (e.g. https://test.buddytime.ca/).',
    );
  }
  return new URL(raw.endsWith('/') ? raw : `${raw}/`).origin;
}
