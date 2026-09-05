import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LỚP 1: Tắt Source Maps trên Production để giấu mã nguồn gốc (Chống dò ngược)
  productionBrowserSourceMaps: false,
  
  // LỚP 2: Sử dụng bộ biên dịch SWC tích hợp của Next.js để minify (Mangle)
  // và loại bỏ TOÀN BỘ console rác (log, info, error) không để lại dấu vết.
  compiler: {
    removeConsole: true,
  },

  turbopack: {},

  images: {
    dangerouslyAllowSVG: true,
    qualities: [75, 80, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // LỚP 4 & 5: Cấu hình Webpack để tích hợp kiến trúc WebAssembly (Wasm Binary)
  webpack: (config, { isServer }) => {
    // Cấu hình thử nghiệm hỗ trợ nạp thẳng mã máy nhị phân (.wasm)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // (Tùy chọn) Có thể import TerserPlugin ở đây nếu không dùng SWC minifier:
    // config.optimization.minimizer.push(new TerserPlugin({
    //   terserOptions: { mangle: true, compress: { drop_console: true } }
    // }));

    return config;
  },
};

export default nextConfig;
