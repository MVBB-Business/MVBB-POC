/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mvbb/ui", "@mvbb/pricing", "@mvbb/inventory", "@mvbb/orders", "@mvbb/api-client"],
};

export default nextConfig;
