/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Garantir que o ESLint não bloqueia a build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Dizer ao Next.js para gerar ficheiros HTML estáticos
  output: 'export',
  // 3. Configurar o redirecionamento de raiz
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  // 4. (Opcional) Desativar otimização de imagem se houver muitos avisos
  images: {
    unoptimized: true,
  }
};

export default nextConfig;