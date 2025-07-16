export interface OAuthParams {
	client_id: string
	scope: string
	state: string
	redirect_uri: string
	response_type: string
	code_challenge: string
	code_challenge_method: string
}

export interface OAuthClient {
	id: string
	name: string
	description: string
	logo?: string
	scopes: OAuthScope[]
}

export interface OAuthScope {
	name: string
	description: string
}

export interface OAuthError {
	error: string
	error_description?: string
}

export interface AuthorizeResponse {
	code: string
	state: string
} 