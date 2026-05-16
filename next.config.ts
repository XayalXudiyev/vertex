import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://3.127.221.126:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
