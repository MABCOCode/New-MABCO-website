const STORAGE_KEY_PREFIX = 'company_profile_download_';
const DAILY_DOWNLOAD_LIMIT = 3;

const getTodayKey = () => new Date().toISOString().slice(0, 10);
const normalizeUserId = (userId?: string | null) => (userId ? String(userId) : 'guest');

export type CompanyProfileDownloadMeta = {
  date: string;
  count: number;
};

export const getCompanyProfileDownloadKey = (userId?: string | null) =>
  `${STORAGE_KEY_PREFIX}${normalizeUserId(userId)}`;

export const getCompanyProfileDownloadMeta = (userId?: string | null): CompanyProfileDownloadMeta => {
  try {
    const key = getCompanyProfileDownloadKey(userId);
    const raw = localStorage.getItem(key);
    const today = getTodayKey();
    if (!raw) {
      return { date: today, count: 0 };
    }
    const parsed = JSON.parse(raw) as CompanyProfileDownloadMeta;
    if (parsed?.date !== today) {
      return { date: today, count: 0 };
    }
    return { date: parsed.date, count: Math.max(0, parsed.count || 0) };
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
};

export const canDownloadCompanyProfile = (userId?: string | null) => {
  const meta = getCompanyProfileDownloadMeta(userId);
  return meta.count < DAILY_DOWNLOAD_LIMIT;
};

export const getCompanyProfileDownloadsLeft = (userId?: string | null) => {
  const meta = getCompanyProfileDownloadMeta(userId);
  return Math.max(0, DAILY_DOWNLOAD_LIMIT - meta.count);
};

export const recordCompanyProfileDownload = (userId?: string | null) => {
  const key = getCompanyProfileDownloadKey(userId);
  const today = getTodayKey();
  const meta = getCompanyProfileDownloadMeta(userId);
  const updated = {
    date: today,
    count: meta.date === today ? Math.min(DAILY_DOWNLOAD_LIMIT, meta.count + 1) : 1,
  };
  localStorage.setItem(key, JSON.stringify(updated));
  return updated.count;
};

export const triggerCompanyProfileDownload = (
  userId?: string | null,
  fileUrl = 'https://www.mabcoonline.com/images/Mabco-Company-Profile-V5.pdf'
) => {
  if (!canDownloadCompanyProfile(userId)) {
    return false;
  }

  recordCompanyProfileDownload(userId);

  const anchor = document.createElement('a');
  anchor.href = fileUrl;
  anchor.download = fileUrl.split('/').pop() || 'Mabco-Company-Profile-V5.pdf';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  return true;
};
