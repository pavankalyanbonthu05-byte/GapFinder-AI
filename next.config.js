/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["groq-sdk"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
