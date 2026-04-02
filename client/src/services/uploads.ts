const ADMIN_API_KEY = (import.meta as any).env?.VITE_ADMIN_API_KEY || "";

export async function uploadImageFile(file: File): Promise<string> {
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
  const formData = new FormData();
  formData.append("image", file);

  const headers = new Headers();
  if (ADMIN_API_KEY) {
    headers.set("x-admin-key", ADMIN_API_KEY);
  }

  const res = await fetch(`${apiBase}/uploads/images`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed with status ${res.status}`);
  }
  const json = await res.json();
  return String(json?.data?.url || "");
}

export async function uploadImageDataUrl(dataUrl: string): Promise<string> {
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
  const headers = new Headers({ "Content-Type": "application/json" });
  if (ADMIN_API_KEY) {
    headers.set("x-admin-key", ADMIN_API_KEY);
  }
  const res = await fetch(`${apiBase}/uploads/images-base64`, {
    method: "POST",
    headers,
    body: JSON.stringify({ dataUrl }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed with status ${res.status}`);
  }
  const json = await res.json();
  return String(json?.data?.url || "");
}
