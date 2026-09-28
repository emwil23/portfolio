/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces Next.js to build a static 'out' folder instead of a Node server
  output: "export",
  
  // GitHub Pages does not support the Next.js Image Optimization API
  images: {
    unoptimized: true,
  },
  
  // Optional: Add a trailing slash to URLs to prevent 404s on direct navigation
  trailingSlash: true,
};

export default nextConfig;
