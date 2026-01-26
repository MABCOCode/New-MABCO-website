export function saveSession(data: any) { localStorage.setItem('session', JSON.stringify(data)); }
export function loadSession() { const raw = localStorage.getItem('session'); return raw ? JSON.parse(raw) : null; }
