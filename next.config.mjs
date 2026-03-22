/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '/GoalTracker',
  assetPrefix: '/GoalTracker',
}

export default nextConfig
