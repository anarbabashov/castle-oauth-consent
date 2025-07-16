import { z } from 'zod'
import { OAuthParams } from '@/types/oauth'

// Zod schema for OAuth parameter validation
export const oauthParamsSchema = z.object({
	client_id: z.string().min(1, 'Client ID is required'),
	scope: z.string().min(1, 'Scope is required'),
	state: z.string().min(1, 'State is required'),
	redirect_uri: z.string().url('Invalid redirect URI'),
	response_type: z.literal('code').refine(val => val === 'code', {
		message: 'Response type must be "code"'
	}),
	code_challenge: z.string().min(1, 'Code challenge is required'),
	code_challenge_method: z.literal('S256').refine(val => val === 'S256', {
		message: 'Code challenge method must be "S256"'
	}),
})

export function parseOAuthParams(searchParams: URLSearchParams): {
	params: OAuthParams | null
	errors: string[]
} {
	const rawParams = {
		client_id: searchParams.get('client_id') || '',
		scope: searchParams.get('scope') || '',
		state: searchParams.get('state') || '',
		redirect_uri: searchParams.get('redirect_uri') || '',
		response_type: searchParams.get('response_type') || '',
		code_challenge: searchParams.get('code_challenge') || '',
		code_challenge_method: searchParams.get('code_challenge_method') || '',
	}

	const result = oauthParamsSchema.safeParse(rawParams)
	
	if (result.success) {
		return { params: result.data, errors: [] }
	} else {
		const errors = result.error.issues.map((err) => err.message)
		return { params: null, errors }
	}
}

export function buildRedirectUrl(redirectUri: string, code: string, state: string): string {
	const url = new URL(redirectUri)
	url.searchParams.set('code', code)
	url.searchParams.set('state', state)
	return url.toString()
}

export function buildErrorRedirectUrl(redirectUri: string, error: string, state?: string, description?: string): string {
	const url = new URL(redirectUri)
	url.searchParams.set('error', error)
	if (state) url.searchParams.set('state', state)
	if (description) url.searchParams.set('error_description', description)
	return url.toString()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ')
} 