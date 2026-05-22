/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow serverless functions to run longer
  serverRuntimeConfig: {
    maxDuration: 30,
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Compress responses
  compress: true,
  // Images optimization
  images: {
    domains: ['vercel.app'],
    unoptimized: false,
  },
  // Environment variables that will be exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Enable React strict mode
  reactStrictMode: true,
  // SwcMinify for faster builds
  swcMinify: true,
}

module.exports = nextConfig