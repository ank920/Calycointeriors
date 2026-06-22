/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "videos.pexels.com" }
    ]
  },
  async redirects() {
    return [
      { source: "/why-calyco", destination: "/about", permanent: true }
    ];
  }
};

export default nextConfig;
