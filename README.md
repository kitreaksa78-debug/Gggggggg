# Nexus Video Downloader

Nexus Video Downloader is a production-grade web application engineered to download publicly accessible videos and extract audio tracks from YouTube, TikTok, and Facebook.

**Core Philosophy:** Nexus contains **absolutely zero mock providers, zero fake MP4 downloads, and zero fake percentage progress**. It connects directly to real media processing engines and processes only content that users are legally authorized to download.

---

## 1. Real Provider Architecture

Nexus does not fabricate media data or simulate downloads. All media analysis and streaming are handled through a configured real external video processing provider.

### Supported Real Providers

1. **Cobalt Media Processing Engine (Recommended)**
   - **Provider Name:** Cobalt API (v10 / v7)
   - **Official Documentation:** [https://github.com/imputnet/cobalt/blob/current/docs/api.md](https://github.com/imputnet/cobalt/blob/current/docs/api.md)
   - **Public Endpoint:** `https://api.cobalt.tools` (or your private self-hosted Cobalt Docker instance)
   - **Required Credentials:** `DOWNLOAD_PROVIDER_API_KEY` (if your instance requires authorization)
   - **Environment Variables:**
     ```env
     DOWNLOAD_PROVIDER=real
     DOWNLOAD_PROVIDER_API_URL=https://api.cobalt.tools
     DOWNLOAD_PROVIDER_API_KEY=your_cobalt_api_key
     ```

2. **RapidAPI Social Video Downloader**
   - **Provider Name:** RapidAPI Social Media Video API
   - **Endpoint:** `https://social-download-all-in-one.p.rapidapi.com`
   - **Required Credentials:** RapidAPI Key
   - **Environment Variables:**
     ```env
     DOWNLOAD_PROVIDER=real
     DOWNLOAD_PROVIDER_API_URL=https://social-download-all-in-one.p.rapidapi.com
     DOWNLOAD_PROVIDER_API_KEY=your_rapidapi_key
     ```

### Credential Protection Guarantee
- `DOWNLOAD_PROVIDER_API_KEY` is **strictly isolated on the backend**.
- It is **never** bundled into Vite client JavaScript, HTML output, or browser network responses.
- If upstream credentials are missing or expired, the backend returns a structured `PROVIDER_CONFIG_REQUIRED` error with documentation links—it **never** falls back to fake or simulated data.

---

## 2. Project Structure

```text
nexus-video-downloader/
├── src/                      # Full-stack source code
│   ├── components/           # React components
│   │   ├── Header.tsx        # Top Bar contract (brand, nav, theme toggle, provider status)
│   │   ├── Hero.tsx          # Real-time URL input & platform detection
│   │   ├── VideoResultCard.tsx # Real video thumbnail, title, formats, download action
│   │   ├── ErrorMessage.tsx  # Structured error presenter with setup guide
│   │   ├── DownloadHistory.tsx # LocalStorage history manager
│   │   ├── HowItWorks.tsx    # 5-step operational workflow
│   │   ├── SupportedPlatforms.tsx # YouTube, TikTok, Facebook capability matrix
│   │   ├── PrivacyView.tsx   # Zero-credential retention privacy policy
│   │   ├── TermsView.tsx     # Legal terms & DRM prohibition notice
│   │   ├── ProviderModal.tsx # Live provider health check & configuration instructions
│   │   └── Footer.tsx        # Quiet brand footer
│   ├── controllers/          # Express API controllers
│   │   └── videoController.ts # /api/video/info and /api/video/download handlers
│   ├── middleware/           # Backend security middlewares
│   │   ├── rateLimit.ts      # Sliding-window rate limiter
│   │   ├── validation.ts     # Request payload validation
│   │   └── errorHandler.ts   # Global structured error handler
│   ├── providers/            # Provider abstraction
│   │   ├── VideoProvider.ts  # IVideoProvider interface & data models
│   │   └── RealVideoProvider.ts # Genuine HTTP client for Cobalt / RapidAPI
│   ├── services/             # Domain service layer
│   │   └── videoService.ts   # Video orchestration service
│   ├── utils/                # Security utilities
│   │   └── urlValidator.ts   # SSRF protection & domain whitelist
│   ├── types/                # Shared TypeScript types
│   │   └── index.ts
│   ├── App.tsx               # Main application container
│   ├── main.tsx              # React DOM bootstrap
│   ├── server.ts             # Full-Stack Express server with Vite middleware
│   └── index.css             # Tailwind CSS v4 design layer
├── backend/                  # Standalone backend export
│   ├── src/                  # Standalone Express backend files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── public/                   # Static SEO assets
│   ├── robots.txt
│   └── sitemap.xml
├── test/                     # Automated backend test suite
│   └── backend-test.ts       # SSRF, URL validation, and provider tests
├── .env.example              # Server environment template
├── index.html                # SEO-optimized HTML entry point with JSON-LD
├── metadata.json             # Applet manifest
├── package.json              # Unified dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

---

## 3. Security Architecture & SSRF Protection

Nexus implements defense-in-depth protection:
1. **SSRF Guard**:
   - Rejects loopback addresses (`127.0.0.1`, `localhost`, `::1`).
   - Rejects private RFC-1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
   - Rejects cloud metadata addresses (`169.254.169.254`).
   - Rejects internal DNS suffix resolution (`.local`, `.internal`, `.lan`).
   - Blocks non-standard ports (only port `80` and `443` permitted).
   - Rejects embedded URL credentials (`http://user:pass@host`).
2. **Strict Platform Whitelist**:
   - YouTube: `youtube.com`, `www.youtube.com`, `m.youtube.com`, `youtu.be`, `youtube-nocookie.com`.
   - TikTok: `tiktok.com`, `www.tiktok.com`, `vm.tiktok.com`, `m.tiktok.com`.
   - Facebook: `facebook.com`, `www.facebook.com`, `fb.watch`, `web.facebook.com`.
3. **Rate Limiting**:
   - Metadata inspection: 30 requests/minute per IP.
   - Media downloads: 15 requests/minute per IP.
4. **Ephemeral Memory Streaming**:
   - Streams media bytes directly from the upstream provider to the browser.
   - Disconnect listeners clean up streams immediately upon completion or cancellation.
5. **No Credential Harvesting**:
   - Never prompts for or accepts social media account passwords, session cookies, or tokens.
   - Never circumvents digital rights management (DRM) or access control paywalls.

---

## 4. Development Setup

### Prerequisites
- Node.js 18+ (Node 20 or 22 recommended)
- npm or pnpm

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your real provider credentials in `.env`:
```env
PORT=3000
DOWNLOAD_PROVIDER=real
DOWNLOAD_PROVIDER_API_URL=https://api.cobalt.tools
DOWNLOAD_PROVIDER_API_KEY=
CORS_ORIGIN=
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Start Full-Stack Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:3000` with the Express API and Vite frontend connected.

---

## 5. Production Deployment

### Option A: Unified Container / Node.js Host
1. Build the frontend assets:
   ```bash
   npm run build
   ```
2. Set production environment variables:
   ```env
   NODE_ENV=production
   PORT=3000
   DOWNLOAD_PROVIDER=real
   DOWNLOAD_PROVIDER_API_URL=https://api.cobalt.tools
   DOWNLOAD_PROVIDER_API_KEY=your_key_here
   ```
3. Start the production server:
   ```bash
   npm start
   ```
   Express will serve the API at `/api/*` and static SPA assets from `./dist`.

### Option B: Standalone Backend Deployment
If deploying the backend to a dedicated container (e.g. AWS ECS, GCP Cloud Run, or Railway):
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## 6. Testing Verification Matrix

The automated test suite (`npm run test`) verifies:
- [x] Valid YouTube URL patterns (`watch?v=`, `youtu.be/`, Shorts)
- [x] Valid TikTok URL patterns (`tiktok.com/@user/video/`, `vm.tiktok.com/`)
- [x] Valid Facebook URL patterns (`facebook.com/watch/`, `fb.watch/`)
- [x] Rejection of invalid and malformed URLs
- [x] Rejection of unsupported platforms (e.g. Vimeo, Twitter)
- [x] SSRF blocking of localhost, 127.0.0.1, 10.x.x.x, AWS metadata (169.254.169.254)
- [x] Detection of embedded user:password credentials
- [x] Provider status and configuration validation
- [x] Rate limiting sliding window behavior

---

## 7. Legal Notice & Copyright Compliance
Nexus Video Downloader is intended solely for personal archiving of user-owned videos, creative-commons media, and public broadcasts where downloading is authorized by the content owner and permitted by applicable platform terms. Nexus does not circumvent DRM, paywalls, or private account protections.
