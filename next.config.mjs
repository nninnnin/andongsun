import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    MEMEX_TOKEN: process.env.MEMEX_TOKEN,
    PASSWORD: process.env.PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d133rm4ogbfdzw.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
