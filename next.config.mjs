/** @type {import('next').NextConfig} */
function normalizeApiBaseUrl(url) {
  const trimmedUrl = url?.trim().replace(/\/+$/, "");

  if (!trimmedUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(trimmedUrl)) {
    return `http://${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
}

const apiBaseUrl =
  normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL) ??
  normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL) ??
  "http://localhost:8000";

const apiImagePattern = apiBaseUrl
  ? (() => {
      const url = new URL(apiBaseUrl);
      return {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port,
        pathname: "/uploads/**"
      };
    })()
  : null;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/uploads/**"
      }
    ].concat(apiImagePattern ? [apiImagePattern] : [])
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${apiBaseUrl}/:path*`
      }
    ];
  }
};

export default nextConfig;
