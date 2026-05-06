/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@tensorflow/tfjs-node', '@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@mapbox/node-pre-gyp': false,
        'node-pre-gyp': false,
        'mock-aws-s3': false,
        'aws-sdk': false,
        'nock': false,
        'worker_threads': false,
        'fs': false,
        'path': false,
      }
      // Exclude node_modules that shouldn't be bundled
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mapbox/node-pre-gyp': false,
      }
    }
    return config
  },
}

export default nextConfig