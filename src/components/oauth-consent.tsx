'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'
import { OAuthClient, OAuthParams } from '@/types/oauth'
import { parseOAuthParams, buildRedirectUrl, buildErrorRedirectUrl, cn } from '@/lib/utils'
import { getOAuthClient, authorizeOAuth, OAuthAPIError } from '@/lib/oauth-api'

interface ConsentState {
	loading: boolean
	client: OAuthClient | null
	params: OAuthParams | null
	errors: string[]
	isAuthorizing: boolean
}

export default function OAuthConsent() {
	const searchParams = useSearchParams()
	const [state, setState] = useState<ConsentState>({
		loading: true,
		client: null,
		params: null,
		errors: [],
		isAuthorizing: false,
	})

	useEffect(() => {
		const initializeConsent = async () => {
			// Parse OAuth parameters from URL
			const { params, errors } = parseOAuthParams(searchParams)
			
			if (!params || errors.length > 0) {
				setState(prev => ({
					...prev,
					loading: false,
					errors: errors.length > 0 ? errors : ['Invalid OAuth parameters'],
				}))
				return
			}

			try {
				// Fetch client information
				const client = await getOAuthClient(params.client_id, params.scope)
				setState(prev => ({
					...prev,
					loading: false,
					client,
					params,
					errors: [],
				}))
			} catch (error) {
				console.error('Failed to fetch OAuth client:', error)
				setState(prev => ({
					...prev,
					loading: false,
					errors: [error instanceof OAuthAPIError ? error.message : 'Failed to load application information'],
				}))
			}
		}

		initializeConsent()
	}, [searchParams])

	const handleAuthorize = async () => {
		if (!state.params || !state.client) return

		setState(prev => ({ ...prev, isAuthorizing: true }))

		try {
			const response = await authorizeOAuth(state.params!)
			const redirectUrl = buildRedirectUrl(
				state.params.redirect_uri,
				response.code,
				state.params.state // Use original state from params instead of response
			)
			window.location.href = redirectUrl
		} catch (error) {
			console.error('Authorization failed:', error)
			
			// Redirect to error URL if possible
			if (state.params?.redirect_uri) {
				const errorUrl = buildErrorRedirectUrl(
					state.params.redirect_uri,
					'server_error',
					state.params.state,
					error instanceof OAuthAPIError ? error.message : 'Authorization failed'
				)
				window.location.href = errorUrl
			} else {
				setState(prev => ({
					...prev,
					isAuthorizing: false,
					errors: [error instanceof OAuthAPIError ? error.message : 'Authorization failed'],
				}))
			}
		}
	}

	const handleDeny = () => {
		if (!state.params?.redirect_uri) return
		
		const errorUrl = buildErrorRedirectUrl(
			state.params.redirect_uri,
			'access_denied',
			state.params.state,
			'User denied the authorization request'
		)
		window.location.href = errorUrl
	}

	if (state.loading) {
		return (
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" data-testid="loading-screen">
				<div className="flex items-center justify-center mb-6">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
				</div>
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
					<p className="text-gray-600">Verifying application details</p>
				</div>
			</div>
		)
	}

	if (state.errors.length > 0) {
		return (
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" data-testid="error-screen">
				<div className="flex items-center justify-center mb-6">
					<AlertCircle className="h-12 w-12 text-red-500" />
				</div>
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Authorization Error</h2>
					<div className="space-y-2" role="alert" aria-live="polite">
						{state.errors.map((error, index) => (
							<p key={index} className="text-red-600 text-sm">{error}</p>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (!state.client || !state.params) {
		return (
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" data-testid="not-found-screen">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-900 mb-2">No application found</h2>
					<p className="text-gray-600">Unable to load application information</p>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" data-testid="consent-screen">
			{/* Header */}
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<Image
						src="/castle-logo.svg"
						alt="Castle Logo"
						width={120}
						height={23}
						className="h-6 w-auto"
						priority
					/>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Authorize Application</h1>
				<p className="text-gray-600">Grant access to your Castle account</p>
			</div>

			{/* Application Info */}
			<div className="bg-gray-50 rounded-xl p-6 mb-6" data-testid="app-info">
				<div className="flex items-start space-x-4">
					{state.client.logo ? (
						<Image
							src={state.client.logo}
							alt={`${state.client.name} logo`}
							width={48}
							height={48}
							className="w-12 h-12 rounded-lg bg-white border border-gray-200 p-2"
						/>
					) : (
						<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
							<span className="text-white font-semibold text-lg" aria-label={`${state.client.name} logo`}>
								{state.client.name.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-gray-900 mb-1">{state.client.name}</h3>
						<p className="text-sm text-gray-600 line-clamp-2">{state.client.description}</p>
					</div>
				</div>
			</div>

			{/* Permissions */}
			<div className="mb-8" data-testid="permissions-section">
				<h3 className="font-semibold text-gray-900 mb-4 flex items-center">
					<CheckCircle2 className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
					Permissions Requested
				</h3>
				<div className="space-y-3" role="list">
					{state.client.scopes.map((scope, index) => (
						<div key={index} className="flex items-start space-x-3" role="listitem">
							<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" aria-hidden="true" />
							<div>
								<p className="text-sm font-medium text-gray-900 capitalize">{scope.name}</p>
								<p className="text-xs text-gray-600">{scope.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Redirect URL Info */}
			<div className="bg-blue-50 rounded-lg p-4 mb-6" data-testid="redirect-info">
				<div className="flex items-start space-x-3">
					<ExternalLink className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
					<div>
						<p className="text-sm font-medium text-blue-900">You&apos;ll be redirected to:</p>
						<p className="text-xs text-blue-700 break-all" title={state.params.redirect_uri}>
							{state.params.redirect_uri}
						</p>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="space-y-3" data-testid="action-buttons">
				<button
					onClick={handleAuthorize}
					disabled={state.isAuthorizing}
					data-testid="authorize-button"
					className={cn(
						'w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200',
						'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
						'disabled:opacity-50 disabled:cursor-not-allowed',
						state.isAuthorizing ? 'bg-gray-800' : 'bg-gray-900'
					)}
					style={{ backgroundColor: state.isAuthorizing ? 'rgb(17 24 39)' : 'rgb(3 7 18)' }}
					aria-describedby="authorize-description"
				>
					{state.isAuthorizing ? (
						<div className="flex items-center justify-center space-x-2">
							<Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
							<span>Authorizing...</span>
						</div>
					) : (
						'Authorize Application'
					)}
				</button>
				
				<button
					onClick={handleDeny}
					disabled={state.isAuthorizing}
					data-testid="cancel-button"
					className={cn(
						'w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200',
						'hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
						'disabled:opacity-50 disabled:cursor-not-allowed'
					)}
					aria-describedby="cancel-description"
				>
					Cancel
				</button>
			</div>

			{/* Security Note */}
			<div className="mt-6 text-center">
				<p id="authorize-description" className="text-xs text-gray-500">
					Only authorize applications you trust. You can revoke access at any time in your Castle account settings.
				</p>
				<p id="cancel-description" className="sr-only">
					Cancel the authorization request and return to the application
				</p>
			</div>
		</div>
	)
} 