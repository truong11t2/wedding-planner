import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  allowedDevOrigins: ['saigonchieumua.ddns.net', 'http://155.94.144.195:3001'],
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
