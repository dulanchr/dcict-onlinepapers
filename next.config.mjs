/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/dcict-onlinepapers',
  assetPrefix: '/dcict-onlinepapers/',
};

export default nextConfig;
