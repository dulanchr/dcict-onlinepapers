/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove basePath and assetPrefix since you're using a custom domain
  // basePath: '/dcict-onlinepapers',
  // assetPrefix: '/dcict-onlinepapers/',
};

export default nextConfig;
