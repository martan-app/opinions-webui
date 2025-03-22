/** @type {import('next').NextConfig} */
const { withLogtail } = require('@logtail/next');

const nextConfig = {
  experimental: {
    appDir: false,
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
      { source: "/ingest/decide", destination: "https://us.i.posthog.com/decide" },
    ];
  },
  skipTrailingSlashRedirect: true,
};

module.exports = withLogtail(nextConfig);
