import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    MEMEX_TOKEN: process.env.MEMEX_TOKEN,
  },
};

export default nextConfig;
