import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
	output: 'standalone',
	experimental: {
		optimizePackageImports: ['lucide-react']
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
}

export default nextConfig
