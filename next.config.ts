import type { NextConfig } from "next";

// Backend URL — used server-side for API proxying via rewrites.
// In production, set BACKEND_URL in your deployment environment (e.g. Vercel env vars).
// The frontend browser code never sees this value; it always hits /api/* on the same origin.
const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://eduverse-backend-production.up.railway.app";

import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  /**
   * Proxy all /api/* requests to the FastAPI backend.
   * This means:
   *  - The browser always requests /api/... (same origin, no CORS issues).
   *  - Next.js forwards those requests to the real backend on the server side.
   *  - Works correctly from ANY route: /, /login, /docs, /shop, etc.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
