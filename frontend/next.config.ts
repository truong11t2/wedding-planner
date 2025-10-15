import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  allowedDevOrigins: ['saigonchieumua.ddns.net'],
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
