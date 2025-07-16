import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Lock, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-4xl mx-auto text-center">
				<div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
					<div className="flex justify-center mb-8">
        <Image
							src="/castle-logo.svg"
							alt="Castle Logo"
							width={200}
          height={38}
							className="h-12 w-auto"
          priority
        />
					</div>
					
					<h1 className="text-4xl font-bold text-gray-900 mb-6">
						OAuth Authorization
					</h1>
					
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Secure authorization flow for third-party applications to access your Castle account. 
						Built with OAuth 2.0 + PKCE for maximum security.
					</p>

					<div className="grid md:grid-cols-3 gap-8 mb-12">
						<div className="text-center">
							<div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
								<Lock className="h-6 w-6 text-green-600" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
							<p className="text-sm text-gray-600">OAuth 2.0 with PKCE ensures secure authorization</p>
						</div>

						<div className="text-center">
							<div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-4">
								<CheckCircle className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
							<p className="text-sm text-gray-600">Clear permission requests and app information</p>
						</div>
						
						<div className="text-center">
							<div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
								<ArrowRight className="h-6 w-6 text-purple-600" />
							</div>
							<h3 className="font-semibold text-gray-900 mb-2">Seamless</h3>
							<p className="text-sm text-gray-600">Quick authorization with immediate redirect</p>
						</div>
					</div>

					<Link
						href="/oauth/authorize?client_id=8f9a0002-ae0f-4412-ac4c-902f1e88e5ff&state=-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y&redirect_uri=https%3A%2F%2Fzapier.com%2Fdashboard%2Fauth%2Foauth%2Freturn%2FApp222291CLIAPI%2F&response_type=code&scope=conversion&code_challenge=BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA&code_challenge_method=S256"
						className="inline-flex items-center space-x-2 text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						style={{ backgroundColor: 'rgb(3 7 18)' }}
					>
						<span>Try Demo Authorization</span>
						<ArrowRight className="h-5 w-5" />
					</Link>
				</div>

				<div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Test Parameters</h2>
					<div className="grid md:grid-cols-2 gap-6 text-left">
						<div>
							<h3 className="font-semibold text-gray-900 mb-3">OAuth Parameters:</h3>
							<div className="space-y-2 text-sm">
								<div><span className="font-medium">Client ID:</span> <code className="bg-gray-100 px-2 py-1 rounded">8f9a0002-ae0f-4412-ac4c-902f1e88e5ff</code></div>
								<div><span className="font-medium">Scope:</span> <code className="bg-gray-100 px-2 py-1 rounded">conversion</code></div>
								<div><span className="font-medium">Response Type:</span> <code className="bg-gray-100 px-2 py-1 rounded">code</code></div>
								<div><span className="font-medium">Challenge Method:</span> <code className="bg-gray-100 px-2 py-1 rounded">S256</code></div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
							<div className="space-y-2 text-sm">
								<div>✅ Application name & description display</div>
								<div>✅ Scope/permission visualization</div>
								<div>✅ Secure authorization with redirect</div>
								<div>✅ Comprehensive error handling</div>
								<div>✅ Mobile-responsive design</div>
							</div>
						</div>
					</div>
				</div>
        </div>
    </div>
	)
}
