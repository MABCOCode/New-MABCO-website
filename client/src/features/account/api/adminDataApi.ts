const RAW_API_BASE = (import.meta as any).env?.VITE_API_BASE_URL;
const NORMALIZED_BASE = RAW_API_BASE && String(RAW_API_BASE).trim() && String(RAW_API_BASE).trim() !== "undefined"
  ? String(RAW_API_BASE).trim()
  : "";
const API_BASE = NORMALIZED_BASE || "http://localhost:5000/api";

const buildApiUrl = (path: string) => {
  if (API_BASE.startsWith("/")) return `${API_BASE}${path}`;
  if (API_BASE.endsWith("/api")) return `${API_BASE}${path}`;
  if (API_BASE.endsWith("/api/")) return `${API_BASE}${path.replace(/^\/+/, "")}`;
  return `${API_BASE.replace(/\/+$/, "")}/api${path}`;
};
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";
const API_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status?: number;
  path: string;

  constructor(message: string, path: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.path = path;
    this.status = status;
  }
}

function getErrorMessage(path: string, status?: number) {
  if (status === 401 || status === 403) {
    return `Access denied for ${path}. Check admin API key and permissions.`;
  }
  if (status && status >= 500) {
    return `Server error (${status}) while loading ${path}.`;
  }
  if (status) {
    return `Request failed (${status}) for ${path}.`;
  }
  return `Network error while loading ${path}.`;
}

async function getJson<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (ADMIN_API_KEY) {
    headers["x-admin-key"] = ADMIN_API_KEY;
  }

  let timeoutId: number | undefined;
  const controller = new AbortController();

  try {
    timeoutId = window.setTimeout(() => {
      controller.abort();
    }, API_TIMEOUT_MS);

    const url = buildApiUrl(path);
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const rawText = await res.text().catch(() => "");
      throw new ApiError(`${getErrorMessage(path, res.status)}${rawText ? ` - ${rawText}` : ''}`, path, res.status);
    }

    const json = await res.json();
    return (json?.data ?? {}) as T;

  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new ApiError(`Request timed out for ${path}.`, path);
    }

    if (error instanceof ApiError) throw error;
    throw new ApiError(getErrorMessage(path), path);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

export const fetchAdminUsers = () => getJson<any[]>("/admin/users");

function getAdminActorHeaders() {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return {};
    const session = JSON.parse(raw);
    const user = session?.user;
    if (!user) return {};
    const id = user.id ?? user._id ?? user.userId;
    const name = user.name ?? user.nameAr ?? user.nameEn ?? user.email ?? "";
    const safeName =
      typeof name === "string"
        ? name.replace(/[^\x20-\x7E]/g, "").trim()
        : "";
    const headers: Record<string, string> = {};
    if (id) headers["x-admin-user-id"] = String(id);
    if (safeName) headers["x-admin-user-name"] = safeName;
    return headers;
  } catch {
    return {};
  }
}

export async function putJson<T>(path: string, data: any): Promise<T> {
  const headers: Record<string, string> = {"Content-Type": "application/json", ...getAdminActorHeaders()};
  if (ADMIN_API_KEY) headers["x-admin-key"] = ADMIN_API_KEY;

  let timeoutId: number | undefined;
  const controller = new AbortController();

  try {
    timeoutId = window.setTimeout(() => {
      controller.abort();
    }, API_TIMEOUT_MS);

    const url = buildApiUrl(path);
    let res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!res.ok && res.status === 404 && path.startsWith("/admin") && !url.includes("/api/")) {
      const retryUrl = `/api${path}`;
      res = await fetch(retryUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        signal: controller.signal,
      });
    }

    if (!res.ok) {
      const rawText = await res.text().catch(() => "");
      throw new ApiError(`${getErrorMessage(path, res.status)}${rawText ? ` - ${rawText}` : ''}`, path, res.status);
    }

    const json = await res.json();
    return (json?.data ?? {}) as T;

  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new ApiError(`Request timed out for ${path}.`, path);
    }

    if (error instanceof ApiError) throw error;
    throw new ApiError(getErrorMessage(path), path);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

export const fetchAdminUserPermissions = (id: string) => {
  return getJson<any>(`/admin/users/${encodeURIComponent(id)}/permissions`);
};
export const updateAdminUserPermissions = (id: string, perms: any) => {
  return putJson<any>(`/admin/users/${encodeURIComponent(id)}/permissions`, perms);
};
export const updateAdminUser = (id: string, payload: any) => {
  return putJson<any>(`/admin/users/${encodeURIComponent(id)}`, payload);
};
export const updateUserRole = (id: string, role: string) => {
  return putJson<any>(`/admin/users/${encodeURIComponent(id)}/role`, { role });
};

export const fetchCategories = () => getJson<any[]>("/categories");
export const fetchBrands = () => getJson<any[]>("/brands");

const mapAdminOrder = (raw: any) => {
  const id = String(raw?.id ?? raw?._id ?? raw?.orderId ?? "");
  const orderNumber = raw?.orderNumber ?? raw?.order_no ?? raw?.number ?? (id ? `#${id.slice(-6)}` : "#");
  const customerSnapshot = raw?.customerSnapshot ?? raw?.customer ?? {};
  const address = raw?.addresses?.delivery ?? raw?.delivery ?? {};
  const name =
    customerSnapshot?.fullName ??
    customerSnapshot?.name ??
    [customerSnapshot?.firstName, customerSnapshot?.lastName].filter(Boolean).join(" ");

  const items = Array.isArray(raw?.items)
    ? raw.items.map((item: any, index: number) => ({
        id: Number(item?.productId ?? item?.id ?? index + 1),
        name: item?.name ?? "",
        nameAr: item?.nameAr ?? item?.name_ar ?? item?.name ?? "",
        image: item?.image ?? "",
        quantity: Number(item?.quantity ?? item?.qty ?? 1),
        price: Number(item?.price ?? 0),
        color: item?.variant ?? item?.color ?? "",
        specs: item?.chargeOption?.value ?? item?.chargeOptionLabel ?? "",
        stkCode: item?.stk_code ?? item?.stkCode ?? null,
        variantSku: item?.variantSku ?? null,
        chargeOptionSku: item?.chargeOptionSku ?? null,
        offerNos: Array.isArray(item?.appliedOffers)
          ? item.appliedOffers
              .map((offer: any) => offer?.offer_no ?? offer?.offerNo)
              .filter(Boolean)
              .map((val: any) => String(val))
          : [],
      }))
    : [];

  const pricing = {
    subtotal: Number(raw?.pricing?.subtotal ?? raw?.subtotal ?? 0),
    shipping: Number(raw?.pricing?.shipping ?? raw?.pricing?.deliveryFee ?? raw?.deliveryFee ?? 0),
    shippingPaidBy: raw?.pricing?.shippingPaidBy ?? raw?.shippingPaidBy ?? null,
    tax: Number(raw?.pricing?.tax ?? 0),
    discount: Number(raw?.pricing?.discount ?? raw?.discount ?? 0),
    total: Number(raw?.pricing?.total ?? raw?.total ?? 0),
  };

  const status = raw?.status ?? "pending";
  const paymentMethod = raw?.payment?.method ?? raw?.paymentMethod ?? "cash";
  const paymentStatus = raw?.payment?.status ?? raw?.paymentStatus ?? "pending";
  const orderDate = raw?.createdAt ?? raw?.timestamp ?? raw?.orderDate ?? new Date().toISOString();
  const estimatedDelivery = raw?.fulfillment?.preferredDate ?? raw?.estimatedDelivery ?? orderDate;
  const fulfillmentType = raw?.fulfillment?.type ?? raw?.fulfillmentType ?? null;
  const showroom = raw?.fulfillment?.showroom ?? raw?.showroom ?? null;
  const invoiceNo = raw?.invoiceNo ?? raw?.inv_no ?? null;
  const lastEditedBy = raw?.lastEditedBy ?? null;
  const timeline = Array.isArray(raw?.statusHistory)
    ? raw.statusHistory.map((entry: any) => ({
        status: entry?.status ?? "pending",
        date: entry?.date ?? entry?.at ?? entry?.timestamp ?? orderDate,
        note: entry?.note ?? entry?.comment,
      }))
    : Array.isArray(raw?.timeline)
    ? raw.timeline
    : [
        {
          status,
          date: orderDate,
        },
      ];

  const appliedOffers = Array.isArray(raw?.appliedOffersSnapshot ?? raw?.appliedOffers)
    ? (raw?.appliedOffersSnapshot ?? raw?.appliedOffers).map((offer: any) => ({
        offer_no: offer?.offer_no ?? offer?.offerNo ?? null,
        type: offer?.type ?? offer?.offer_type ?? offer?.offerType ?? "",
        name: offer?.name ?? offer?.title ?? offer?.titleEn ?? "",
        nameAr: offer?.nameAr ?? offer?.title_ar ?? offer?.titleAr ?? "",
        description: offer?.description ?? offer?.descriptionEn ?? "",
        descriptionAr: offer?.descriptionAr ?? offer?.description_ar ?? "",
        discountAmount: Number(offer?.discountAmount ?? offer?.discount ?? offer?.value ?? 0),
        couponCode: offer?.couponCode ?? offer?.code ?? null,
      }))
    : [];

  return {
    id,
    orderNumber,
    customer: {
      id: 0,
      name: name || "",
      email: customerSnapshot?.email ?? "",
      phone: customerSnapshot?.phone ?? "",
      address: {
        street: address?.street ?? address?.formattedAddress ?? "",
        city: address?.city ?? "",
        state: address?.area ?? "",
        zipCode: address?.zipCode ?? "",
      },
    },
    items,
    pricing,
    status,
    paymentStatus,
    paymentMethod,
    orderDate,
    estimatedDelivery,
    timeline,
    notes: raw?.notes ?? "",
    trackingNumber: raw?.trackingNumber ?? raw?.fulfillment?.trackingNumber,
    appliedOffers,
    fulfillmentType,
    showroom,
    invoiceNo,
    lastEditedBy,
  };
};

export const fetchAdminOrders = async () => {
  const rows = await getJson<any[]>("/admin/orders");
  return Array.isArray(rows) ? rows.map(mapAdminOrder) : [];
};
export const updateAdminOrder = async (orderId: string, payload: any) => {
  const updated = await putJson<any>(`/admin/orders/${encodeURIComponent(orderId)}`, payload);
  return mapAdminOrder(updated);
};
export const fetchAdminActions = () => getJson<any[]>("/admin/actions");
export const fetchAdminNotifications = () => getJson<any[]>("/admin/notifications");
export const fetchVisitorSessions = () => getJson<any[]>("/admin/analytics/visitor-sessions");
export const fetchCartEvents = () => getJson<any[]>("/admin/analytics/cart-events");
