/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase static file serving size limits
  staticPageGenerationTimeout: 180,
  // For file processing on server side
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
};

export default nextConfig;
