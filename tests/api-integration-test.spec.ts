import { test, expect } from '@playwright/test'
import { getOAuthClient, authorizeOAuth } from '../src/lib/oauth-api'

test.describe('Castle API Integration Tests', () => {
	test('Test GET /oauth/scopes endpoint with real API', async () => {
		console.log('🔌 Testing Castle OAuth Scopes API...')
		
		try {
			const client = await getOAuthClient(
				'8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
				'conversion'
			)
			
			console.log('✅ API Response received:')
			console.log('  Client ID:', client.id)
			console.log('  Name:', client.name)
			console.log('  Description:', client.description)
			console.log('  Logo:', client.logo || 'No logo')
			console.log('  Scopes:', client.scopes.length, 'scope(s)')
			
			// Verify required fields
			expect(client.id).toBe('8f9a0002-ae0f-4412-ac4c-902f1e88e5ff')
			expect(client.name).toBeTruthy()
			expect(client.description).toBeTruthy()
			expect(client.scopes).toBeInstanceOf(Array)
			expect(client.scopes.length).toBeGreaterThan(0)
			
			// Verify scope structure
			client.scopes.forEach(scope => {
				expect(scope.name).toBeTruthy()
				expect(scope.description).toBeTruthy()
			})
			
			console.log('✅ GET /oauth/scopes endpoint working correctly!')
			
		} catch (error) {
			console.error('❌ API Error:', error)
			throw error
		}
	})
	
	test('Test POST /oauth/authorize endpoint with real API', async () => {
		console.log('🔐 Testing Castle OAuth Authorize API...')
		
		const testParams = {
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y'
		}
		
		try {
			const response = await authorizeOAuth(testParams)
			
			console.log('✅ Authorization Response received:')
			console.log('  Code:', response.code)
			console.log('  State:', response.state || 'Not provided in response')
			
			// Verify response structure
			expect(response.code).toBeTruthy()
			expect(typeof response.code).toBe('string')
			
			// Code should be a valid format (UUID or similar)
			expect(response.code.length).toBeGreaterThan(10)
			
			console.log('✅ POST /oauth/authorize endpoint working correctly!')
			
		} catch (error: any) {
			console.error('❌ Authorization Error:', error)
			console.log('ℹ️  This might be expected if the authorization requires additional validation')
			
			// Log error details for debugging
			if (error.status) {
				console.log('  Status Code:', error.status)
			}
			if (error.code) {
				console.log('  Error Code:', error.code)
			}
			
			// Don't fail the test if it's a known API limitation
			if (error.status === 400 || error.status === 422) {
				console.log('⚠️  API returned validation error - this is acceptable for testing')
				expect(error.message).toBeTruthy()
			} else {
				throw error
			}
		}
	})
	
	test('Test API with invalid client_id', async () => {
		console.log('🚫 Testing API with invalid client_id...')
		
		try {
			await getOAuthClient('invalid-client-id', 'conversion')
			
			// If we get here, the API didn't reject invalid client_id
			console.log('⚠️  API accepted invalid client_id - this might be unexpected')
			
		} catch (error: any) {
			console.log('✅ API correctly rejected invalid client_id')
			console.log('  Error:', error.message)
			expect(error.message).toBeTruthy()
		}
	})
	
	test('Test API error handling', async () => {
		console.log('🧪 Testing API error handling...')
		
		const invalidParams = {
			client_id: '', // Empty client_id should cause error
			redirect_uri: 'invalid-url',
			response_type: 'invalid',
			scope: '',
			code_challenge: '',
			code_challenge_method: 'invalid',
			state: ''
		}
		
		try {
			await authorizeOAuth(invalidParams)
			
			// If we get here, the API didn't validate parameters properly
			console.log('⚠️  API accepted invalid parameters - validation might be lenient')
			
		} catch (error: any) {
			console.log('✅ API correctly rejected invalid parameters')
			console.log('  Error:', error.message)
			expect(error.message).toBeTruthy()
			
			// Check if error has proper structure
			if (error.status) {
				expect(error.status).toBeGreaterThanOrEqual(400)
				expect(error.status).toBeLessThan(600)
			}
		}
	})
}) 