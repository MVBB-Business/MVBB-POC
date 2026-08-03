/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mvbb/ui",
    "@mvbb/pricing",
    "@mvbb/inventory",
    "@mvbb/orders",
    "@mvbb/khata",
    "@mvbb/dispatch",
  ],
};

export default nextConfig;
