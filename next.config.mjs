/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    browserToTerminal: 'warn',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
