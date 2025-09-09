/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  // Remove experimental appDir as it's now stable in Next.js 14
  // Remove api config as it's not valid in next.config.js
}

module.exports = nextConfig
