import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['sqlite3','sqlite', 'bcryptjs'],
  async redirects(){
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'clicktools.co.kr',
          },
        ],
        destination: 'https://www.clicktools.co.kr/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/tools/video-to-audio',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/tools/video-to-audio/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  devIndicators: {
    position:undefined
  },
};

export default nextConfig;
