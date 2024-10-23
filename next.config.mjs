/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
    images: {
      domains: ["www.sportonspec.co.uk", "cdn.vox-cdn.com", "media.asroma.com"],
    },
  };
  
  export default nextConfig;
  