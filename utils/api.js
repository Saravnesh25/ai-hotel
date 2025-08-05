const BASE_URL = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  return fetch(url, options);
}