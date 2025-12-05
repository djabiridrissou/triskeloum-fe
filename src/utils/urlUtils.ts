export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return filePath;
  if (typeof filePath !== 'string') return filePath;

  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!baseUrl) return filePath;

  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return normalizeUrl(filePath);
  }

  if (filePath.startsWith('uploads/')) {
    return `${baseUrl}/${filePath}`;
  }

  return filePath;
};

export const normalizeUrl = (url: string): string => {
  if (!url) return url;
  if (typeof url !== 'string') return url;

  if (url.startsWith('http://')) {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'localhost' && !urlObj.hostname.startsWith('127.')) {
      urlObj.hostname = 'localhost';
      return urlObj.toString();
    }
  }

  return url;
};

export const normalizeObject = (obj: any): any => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    return buildFileUrl(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeObject(item));
  }

  if (typeof obj === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      normalized[key] = normalizeObject(value);
    }
    return normalized;
  }

  return obj;
};
