/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api-b2b.dcistg.id/:path*", // Proxy to the API
      },
    ];
  },
};

export default nextConfig;
