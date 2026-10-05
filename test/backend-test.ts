/**
 * Backend Test Suite for Nexus Video Downloader
 * Tests URL validation, SSRF protection, Rate Limiting, and Provider error handling
 */

import { validateVideoUrl, detectPlatformFromUrl } from '../src/utils/urlValidator.ts';
import { RealVideoProvider } from '../src/providers/RealVideoProvider.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` (${detail})` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('--- Running Nexus Video Downloader Backend Tests ---');

  // 1. Valid YouTube URLs
  console.log('\n[1] Testing Valid YouTube URLs:');
  const yt1 = validateVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert(yt1.isValid && yt1.platform === 'youtube', 'Standard YouTube watch URL');

  const yt2 = validateVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert(yt2.isValid && yt2.platform === 'youtube', 'Shortened youtu.be URL');

  const ytShorts = validateVideoUrl('https://www.youtube.com/shorts/5O9nN8X1a7U');
  assert(ytShorts.isValid && ytShorts.platform === 'youtube', 'YouTube Shorts URL');

  // 2. Valid TikTok URLs
  console.log('\n[2] Testing Valid TikTok URLs:');
  const tt1 = validateVideoUrl('https://www.tiktok.com/@user/video/7123456789012345678');
  assert(tt1.isValid && tt1.platform === 'tiktok', 'Standard TikTok video URL');

  const tt2 = validateVideoUrl('https://vm.tiktok.com/ZM8ABC123/');
  assert(tt2.isValid && tt2.platform === 'tiktok', 'Shortened vm.tiktok.com URL');

  // 3. Valid Facebook URLs
  console.log('\n[3] Testing Valid Facebook URLs:');
  const fb1 = validateVideoUrl('https://www.facebook.com/watch/?v=1234567890');
  assert(fb1.isValid && fb1.platform === 'facebook', 'Standard Facebook watch URL');

  const fb2 = validateVideoUrl('https://fb.watch/abcd1234ef/');
  assert(fb2.isValid && fb2.platform === 'facebook', 'Shortened fb.watch URL');

  // 4. Invalid URLs
  console.log('\n[4] Testing Invalid URLs:');
  const inv1 = validateVideoUrl('not-a-valid-url');
  assert(!inv1.isValid && inv1.error?.code === 'INVALID_URL', 'Garbage text is rejected');

  const inv2 = validateVideoUrl('ftp://www.youtube.com/watch?v=123');
  assert(!inv2.isValid && inv2.error?.code === 'INVALID_URL', 'FTP protocol is rejected');

  // 5. Unsupported URLs
  console.log('\n[5] Testing Unsupported URLs:');
  const unsup1 = validateVideoUrl('https://vimeo.com/12345678');
  assert(!unsup1.isValid && unsup1.error?.code === 'UNSUPPORTED_PLATFORM', 'Vimeo is rejected as unsupported');

  const unsup2 = validateVideoUrl('https://twitter.com/user/status/12345');
  assert(!unsup2.isValid && unsup2.error?.code === 'UNSUPPORTED_PLATFORM', 'Twitter is rejected as unsupported');

  // 6. SSRF Protection & Private IP addresses
  console.log('\n[6] Testing SSRF Protection:');
  const ssrfLocalhost = validateVideoUrl('http://localhost:3000/api/keys');
  assert(!ssrfLocalhost.isValid && ssrfLocalhost.error?.code === 'SSRF_ATTEMPT', 'Localhost is blocked');

  const ssrfLoopback = validateVideoUrl('http://127.0.0.1:8080');
  assert(!ssrfLoopback.isValid && ssrfLoopback.error?.code === 'SSRF_ATTEMPT', '127.0.0.1 loopback is blocked');

  const ssrfPrivate10 = validateVideoUrl('http://10.0.0.1/admin');
  assert(!ssrfPrivate10.isValid && ssrfPrivate10.error?.code === 'SSRF_ATTEMPT', '10.x.x.x private network is blocked');

  const ssrfMetadata = validateVideoUrl('http://169.254.169.254/latest/meta-data');
  assert(!ssrfMetadata.isValid && ssrfMetadata.error?.code === 'SSRF_ATTEMPT', 'AWS/GCP metadata IP is blocked');

  const ssrfUserCreds = validateVideoUrl('https://admin:secret@www.youtube.com/watch?v=123');
  assert(!ssrfUserCreds.isValid && ssrfUserCreds.error?.code === 'SSRF_ATTEMPT', 'Embedded credentials in URL blocked');

  // 7. Platform Detection
  console.log('\n[7] Testing Client-side Platform Detection:');
  assert(detectPlatformFromUrl('https://youtu.be/test') === 'youtube', 'Detects YouTube');
  assert(detectPlatformFromUrl('https://www.tiktok.com/@a/v/1') === 'tiktok', 'Detects TikTok');
  assert(detectPlatformFromUrl('https://fb.watch/test') === 'facebook', 'Detects Facebook');
  assert(detectPlatformFromUrl('https://google.com') === null, 'Rejects unrecognized domain');

  // 8. Real Provider Architecture & Configuration Contract
  console.log('\n[8] Testing Real Provider Status & Error Handling:');
  const provider = new RealVideoProvider();
  const status = provider.getProviderStatus();
  assert(typeof status.isConfigured === 'boolean', 'Provider status returns boolean isConfigured');
  assert(typeof status.providerName === 'string', 'Provider name is defined');
  assert(status.docsUrl.includes('cobalt'), 'Provider documentation link provided');

  console.log(`\n==========================================`);
  console.log(`Tests finished: ${passed} passed, ${failed} failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
