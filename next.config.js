/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isto desativa o ESLint durante a build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;