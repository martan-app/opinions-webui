/** @type {import('next').NextConfig} */
const { withLogtail } = require('@logtail/next');

const nextConfig = {
  experimental: {
    appDir: false,
  },
  poweredByHeader: false,
}

module.exports = withLogtail(nextConfig)
