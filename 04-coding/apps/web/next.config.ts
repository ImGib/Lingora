import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@lingora/contracts'],
  async rewrites() {
    return [
      {
        source: '/prototype',
        destination: '/prototype/index.html',
      },
      {
        source: '/prototype/',
        destination: '/prototype/index.html',
      },
    ];
  },
};

export default nextConfig;

