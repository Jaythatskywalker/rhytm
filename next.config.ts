import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone', // Commented out for Vercel deployment
  images: {
    domains: ['www.soundhelix.com'], // For your sample audio previews
  },
  env: {
    // Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Beatport OAuth2 Configuration
    BEATPORT_CLIENT_ID: process.env.BEATPORT_CLIENT_ID,
    BEATPORT_CLIENT_SECRET: process.env.BEATPORT_CLIENT_SECRET,
    BEATPORT_REDIRECT_URI: process.env.BEATPORT_REDIRECT_URI,
  },
};

export default nextConfig;
