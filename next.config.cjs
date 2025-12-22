/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configura redirecionamentos
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // Usa o código 308
      },
    ];
  },
  // Desativa ESLint na build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração opcional para otimizar a build
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;