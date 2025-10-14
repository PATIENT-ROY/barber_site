import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence workspace root inference by scoping tracing to this project
  outputFileTracingRoot: path.resolve(__dirname),
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [70, 80, 90], // Добавляем поддерживаемые качества
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
