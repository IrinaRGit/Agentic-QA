/** REST paths observed on BuddyTime (relative to APP_URL origin). */
export const API_CHILDREN_PATH = '/api/v1/children';
export const API_ME_PATH = '/api/v1/me';
export const API_CONNECTIONS_PATH = '/api/v1/connections';
export const API_COMMUNITIES_PATH = '/api/v1/communities';
export const API_AVAILABILITY_PATH = '/api/v1/availability';
export const API_PLAYDATES_PATH = '/api/v1/playdates';
export const API_MATCHES_PATH = '/api/v1/matches';
export const API_EVENTS_PATH = '/api/v1/events';

/** Catalog-observed JSON responses (authenticated and unauthenticated GET probes). */
export const CATALOG_JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
export const CATALOG_UNAUTHENTICATED_GET_STATUS = 401;

export function communityByIdPath(id: string): string {
  return `${API_COMMUNITIES_PATH}/${encodeURIComponent(id)}`;
}

/** Matches POST create-child success URLs from the dashboard. */
export const CREATE_CHILD_PATH_PATTERN = /\/api\/v1\/children\/?$/;
