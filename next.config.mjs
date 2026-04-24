/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}

export default nextConfig