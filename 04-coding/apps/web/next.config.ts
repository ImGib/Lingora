import type { NextConfig } from 'next';

const isFastBuild = process.env.FAST_BUILD === '1';

const nextConfig: NextConfig = {
  transpilePackages: ['@lingora/contracts'],
  typescript: {
    // In fast build mode, skip redundant in-build typecheck (handled by mechanical tsc gate)
    ignoreBuildErrors: isFastBuild,
  },
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
