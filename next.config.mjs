/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings
  reactStrictMode: true,
  
  // Webpack configuration to handle potential issues
  webpack: (config, { isServer }) => {
    // Ignore missing files that might cause 404s
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        canvas: false,
      };
    }
    
    // Ignore canvas module for client-side builds
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    
    return config;
  },
  
  // Disable source maps in development to avoid 404s for internal files
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    domains: [],
  },
};

export default nextConfig;
