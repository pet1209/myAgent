import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/',
      destination: '/auth/signin',
      permanent: true, 
    },
  ],
};

export default nextConfig;