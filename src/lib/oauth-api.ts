import { OAuthClient, OAuthParams, AuthorizeResponse } from '@/types/oauth'

const API_BASE_URL = 'https://dev.api.savewithcastle.com'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ldGZvcnVtK2N5YnJpZHRlc3RAZ21haWwuY29tIiwiaWQiOjc3LCJvcmdhbml6YXRpb25JZCI6NjYsInJvbGUiOiJvd25lciIsInByb3ZpZGVyIjoibm9uZSIsImlhdCI6MTc0OTc1ODM4NSwiZXhwIjoxNzc1Njc4Mzg1fQ.Drrci1wgqu5HaDgRrkn3S8MwuNtdjFV7IErwz5Mp6h0'

class OAuthAPIError extends Error {
	constructor(
		message: string,
		public status?: number,
		public code?: string
	) {
		super(message)
		this.name = 'OAuthAPIError'
	}
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(url, {
		...options,
		headers: {
			'Authorization': AUTH_TOKEN,
			'Content-Type': 'application/json',
			...options.headers,
		},
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new OAuthAPIError(
			errorData.error_description || errorData.message || 'API request failed',
			response.status,
			errorData.error
		)
	}

	return response.json()
}

export async function getOAuthClient(clientId: string, scope: string): Promise<OAuthClient> {
	const url = `${API_BASE_URL}/oauth/scopes?client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scope)}`
	
	try {
		const response = await apiRequest<{
			data: {
				client_id: string
				name?: string
				display_description?: string
				logo_uri?: string
				scope_description?: string[]
				previous_consented?: boolean
			}
		}>(url)
		
		const { data } = response
		
		// Transform the API response to match our interface
		return {
			id: clientId,
			name: data.name || 'Unknown Application',
			description: data.display_description || 'No description available',
			logo: data.logo_uri,
			scopes: data.scope_description?.map((desc) => ({
				name: desc.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), // Create scope name from description
				description: desc
			})) || [{ name: scope, description: 'Access to conversion data' }]
		}
	} catch (error) {
		if (error instanceof OAuthAPIError) {
			throw error
		}
		throw new OAuthAPIError('Failed to fetch OAuth client information')
	}
}

export async function authorizeOAuth(params: OAuthParams): Promise<AuthorizeResponse> {
	const url = new URL(`${API_BASE_URL}/oauth/authorize`)
	
	// Add all OAuth parameters as query parameters
	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, value)
	})

	try {
		const data = await apiRequest<AuthorizeResponse>(url.toString(), {
			method: 'POST',
		})
		
		return data
	} catch (error) {
		if (error instanceof OAuthAPIError) {
			throw error
		}
		throw new OAuthAPIError('Failed to authorize OAuth request')
	}
}

export { OAuthAPIError } 