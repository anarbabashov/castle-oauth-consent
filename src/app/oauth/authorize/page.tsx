import { Suspense } from 'react'
import OAuthConsent from '@/components/oauth-consent'

export default function OAuthAuthorizePage() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Suspense fallback={
				<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded mb-4"></div>
						<div className="h-4 bg-gray-200 rounded mb-2"></div>
						<div className="h-4 bg-gray-200 rounded mb-6"></div>
						<div className="h-10 bg-gray-200 rounded"></div>
					</div>
				</div>
			}>
				<OAuthConsent />
			</Suspense>
		</div>
	)
} 