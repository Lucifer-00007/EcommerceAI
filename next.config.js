/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'picsum.photos', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
