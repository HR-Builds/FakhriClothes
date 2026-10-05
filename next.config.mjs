/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["landless-despite-isolating.ngrok-free.dev"],

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
