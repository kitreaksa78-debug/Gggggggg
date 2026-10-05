/**
 * URL Validator & SSRF Protection Utility for Nexus Video Downloader
 */

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

// Whitelisted public hostnames for each platform
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

// Disallowed private paths or keywords indicating private/account-only endpoints
const RESTRICTED_PATH_PATTERNS: RegExp[] = [
  /^\/feed\b/i,
  /^\/settings\b/i,
  /^\/messages\b/i,
  /^\/login\b/i,
  /^\/checkpoint\b/i,
  /^\/ads\b/i,
  /^\/analytics\b/i,
];

// IPv4 private & loopback ranges check
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link Local / Cloud Metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8
  if (parts[0] === 0) return true;

  return false;
}

/**
 * Validates a video URL against whitelist, SSRF constraints, and platform support.
 */
export function validateVideoUrl(inputUrl: string): ValidatedUrlResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      error: {
        code: 'INVALID_URL',
        message: 'No URL was provided. Please enter a valid video link.',
      },
    };
  }

  const trimmed = inputUrl.trim();

  // Sanity check max length
  if (trimmed.length > 2048) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_URL',
        message: 'The submitted URL is too long.',
      },
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      error: {
        code: 'INVALID_URL',
        message: 'Invalid URL format. Please include a complete HTTP or HTTPS link.',
      },
    };
  }

  // 1. Strict Protocol Check
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: {
        code: 'INVALID_URL',
        message: 'Only HTTP and HTTPS URLs are permitted.',
      },
    };
  }

  // 2. Reject credentials in URL (e.g. http://user:pass@host)
  if (parsed.username || parsed.password) {
    return {
      isValid: false,
      error: {
        code: 'SSRF_ATTEMPT',
        message: 'URLs with embedded user credentials are not permitted.',
      },
    };
  }

  // 3. Reject non-standard ports (SSRF protection)
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return {
      isValid: false,
      error: {
        code: 'SSRF_ATTEMPT',
        message: 'Only default web ports (80 and 443) are allowed.',
      },
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 4. SSRF Check: IP addresses & loopback/internal hosts
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
      error: {
        code: 'SSRF_ATTEMPT',
        message: 'Internal and local network addresses are strictly prohibited.',
      },
    };
  }

  // 5. Match Hostname Against Whitelisted Platforms
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
      error: {
        code: 'UNSUPPORTED_PLATFORM',
        message: 'Unsupported video platform. Nexus Video Downloader only supports public YouTube, TikTok, and Facebook videos.',
      },
    };
  }

  // 6. Check for restricted/private endpoints
  const pathname = parsed.pathname;
  if (RESTRICTED_PATH_PATTERNS.some(pattern => pattern.test(pathname))) {
    return {
      isValid: false,
      error: {
        code: 'PRIVATE_URL',
        message: 'This URL points to an account, feed, or private page. Only public video pages are supported.',
      },
    };
  }

  // Clean and normalize URL
  parsed.hash = ''; // Strip fragment

  return {
    isValid: true,
    platform: detectedPlatform,
    normalizedUrl: parsed.toString(),
  };
}

/**
 * Fast client-side platform detector for UI feedback
 */
export function detectPlatformFromUrl(url: string): SupportedPlatform | null {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();
    for (const [platform, domainRegexes] of Object.entries(PLATFORM_DOMAINS) as [SupportedPlatform, RegExp[]][]) {
      if (domainRegexes.some(regex => regex.test(hostname))) {
        return platform;
      }
    }
  } catch {
    // Return null if not a valid URL yet
  }
  return null;
}
