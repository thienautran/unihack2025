import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add these options to fix the EPERM trace error
  experimental: {
    outputFileTracingIncludes: {},
    outputFileTracingExcludes: {
      '*': ['**/*']
    }
  },
  
  // Use standalone output to avoid some static generation issues
  output: "standalone"
};

export default nextConfig;