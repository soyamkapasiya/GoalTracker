/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '/GoalTracker',
  assetPrefix: '/GoalTracker',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
