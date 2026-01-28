/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['resend'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
};

export default nextConfig;
