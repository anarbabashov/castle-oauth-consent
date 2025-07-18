/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig
