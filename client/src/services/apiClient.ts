export const STATIC_VERSION =
  import.meta.env.VITE_APP_VERSION ||
  import.meta.env.VITE_APP_BUILD ||
  '1.0.0';

export function staticFilePath(path: string): string {
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${encodeURIComponent(STATIC_VERSION)}`;
}

export async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(path, opts);
  return res.json();
}

export async function staticFetch(path: string, opts?: RequestInit) {
  const res = await fetch(staticFilePath(path), opts);
  return res.json();
}

