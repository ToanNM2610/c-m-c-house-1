/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  async redirects() {
    return [
      { source: '/about', destination: '/gioi-thieu', permanent: true },
      { source: '/cau-chuyen', destination: '/gioi-thieu', permanent: true },
      { source: '/space', destination: '/khong-gian', permanent: true },
      { source: '/khong-gian-suoi', destination: '/khong-gian', permanent: true },
      { source: '/menu', destination: '/thuc-don', permanent: true },
      { source: '/contact', destination: '/lien-he', permanent: true },
      { source: '/chi-duong-lien-he', destination: '/lien-he', permanent: true },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Disable disk cache on Windows to prevent pack.gz_ file rename collisions
    config.cache = false;
    return config;
  },
};

export default nextConfig;

