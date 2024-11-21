// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: [
      'edqacqlpvhblvyxkhzuc.supabase.co',
    ],
    remotePatterns: [{
      protocol: 'https',
      hostname: 'edqacqlpvhblvyxkhzuc.supabase.co',
      pathname: '/storage/v1/object/sign/**',
    }],
  },
};

export default config;
