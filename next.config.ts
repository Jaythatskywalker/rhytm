import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optional: for Docker/self-hosting
  images: {
    domains: ['www.soundhelix.com'], // For your sample audio previews
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
