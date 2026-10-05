export type SupportedPlatform = 'youtube' | 'tiktok' | 'facebook';

export interface ValidatedUrlResult {
  isValid: boolean;
  platform?: SupportedPlatform;
  normalizedUrl?: string;
  error?: {
    code: 'INVALID_URL' | 'UNSUPPORTED_PLATFORM' | 'SSRF_ATTEMPT' | 'PRIVATE_URL';
    message: string;
  };
}

const PLATFORM_DOMAINS: Record<SupportedPlatform, RegExp[]> = {
  youtube: [
    /^(?:www\.)?youtube\.com$/i,
    /^m\.youtube\.com$/i,
    /^youtu\.be$/i,
    /^music\.youtube\.com$/i,
    /^(?:www\.)?youtube-nocookie\.com$/i,
  ],
  tiktok: [
    /^(?:www\.)?tiktok\.com$/i,
    /^m\.tiktok\.com$/i,
    /^vm\.tiktok\.com$/i,
    /^vt\.tiktok\.com$/i,
  ],
  facebook: [
    /^(?:www\.)?facebook\.com$/i,
    /^m\.facebook\.com$/i,
    /^fb\.watch$/i,
    /^web\.facebook\.com$/i,
  ],
};

const RESTRICTED_PATH_PATTERNS: RegExp[] = [
  /^\/feed\b/i,
  /^\/settings\b/i,
  /^\/messages\b/i,
  /^\/login\b/i,
  /^\/checkpoint\b/i,
  /^\/ads\b/i,
  /^\/analytics\b/i,
];

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return false;
  if (parts[0] === 127) return true;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts[0] === 0) return true;
  return false;
}

export function validateVideoUrl(inputUrl: string): ValidatedUrlResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      error: { code: 'INVALID_URL', message: 'No URL provided.' },
    };
  }

  const trimmed = inputUrl.trim();
  if (trimmed.length > 2048) {
    return {
      isValid: false,
      error: { code: 'INVALID_URL', message: 'The submitted URL is too long.' },
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      error: { code: 'INVALID_URL', message: 'Invalid URL format.' },
    };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: { code: 'INVALID_URL', message: 'Only HTTP/HTTPS URLs permitted.' },
    };
  }

  if (parsed.username || parsed.password) {
    return {
      isValid: false,
      error: { code: 'SSRF_ATTEMPT', message: 'URLs with embedded user credentials blocked.' },
    };
  }

  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return {
      isValid: false,
      error: { code: 'SSRF_ATTEMPT', message: 'Only standard web ports allowed.' },
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    isPrivateIPv4(hostname)
  ) {
    return {
      isValid: false,
      error: { code: 'SSRF_ATTEMPT', message: 'Internal network addresses blocked.' },
    };
  }

  let detectedPlatform: SupportedPlatform | null = null;
  for (const [platform, domainRegexes] of Object.entries(PLATFORM_DOMAINS) as [SupportedPlatform, RegExp[]][]) {
    if (domainRegexes.some(regex => regex.test(hostname))) {
      detectedPlatform = platform;
      break;
    }
  }

  if (!detectedPlatform) {
    return {
      isValid: false,
      error: { code: 'UNSUPPORTED_PLATFORM', message: 'Unsupported platform.' },
    };
  }

  if (RESTRICTED_PATH_PATTERNS.some(pattern => pattern.test(parsed.pathname))) {
    return {
      isValid: false,
      error: { code: 'PRIVATE_URL', message: 'Restricted account or feed URL.' },
    };
  }

  parsed.hash = '';
  return {
    isValid: true,
    platform: detectedPlatform,
    normalizedUrl: parsed.toString(),
  };
}
