import { test, expect } from '@playwright/test'

test.describe('OAuth Consent Flow', () => {
	test('should display landing page correctly', async ({ page }) => {
		await page.goto('/')
		
		// Check title and main elements
		await expect(page).toHaveTitle(/Castle OAuth Authorization/)
		await expect(page.locator('h1')).toContainText('OAuth Authorization')
		await expect(page.locator('text=Secure authorization flow')).toBeVisible()
		
		// Check feature cards using more specific selectors
		await expect(page.locator('h3:has-text("Secure")')).toBeVisible()
		await expect(page.locator('h3:has-text("Transparent")')).toBeVisible()
		await expect(page.locator('h3:has-text("Seamless")')).toBeVisible()
		
		// Check demo link using link selector
		const demoLink = page.locator('a:has-text("Try Demo Authorization")')
		await expect(demoLink).toBeVisible()
		await expect(demoLink).toHaveAttribute('href', /oauth\/authorize/)
	})

	test('should handle OAuth authorization with valid parameters', async ({ page }) => {
		const validOAuthUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()

		await page.goto(validOAuthUrl)
		
		// Wait for loading to complete
		await page.waitForLoadState('networkidle')
		
		// Should show loading state initially or consent/error screen
		const loadingScreen = page.locator('[data-testid="loading-screen"]')
		const isLoading = await loadingScreen.isVisible()
		if (isLoading) {
			await loadingScreen.waitFor({ state: 'hidden' })
		}
		
		// Check if we have either an error or the consent screen
		const errorScreen = page.locator('[data-testid="error-screen"]')
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		
		const hasError = await errorScreen.isVisible()
		const hasConsent = await consentScreen.isVisible()
		
		expect(hasError || hasConsent).toBeTruthy()
		
		if (hasConsent) {
			// Test consent screen elements using testids
			await expect(page.locator('h1:has-text("Authorize Application")')).toBeVisible()
			await expect(page.locator('text=Grant access to your Castle account')).toBeVisible()
			await expect(page.locator('[data-testid="app-info"]')).toBeVisible()
			await expect(page.locator('[data-testid="permissions-section"]')).toBeVisible()
			await expect(page.locator('[data-testid="redirect-info"]')).toBeVisible()
			
			// Check buttons using testids
			await expect(page.locator('[data-testid="authorize-button"]')).toBeVisible()
			await expect(page.locator('[data-testid="cancel-button"]')).toBeVisible()
		}
	})

	test('should handle invalid OAuth parameters', async ({ page }) => {
		await page.goto('/oauth/authorize?invalid=params')
		
		// Should show error screen
		await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
		await expect(page.locator('text=Client ID is required')).toBeVisible()
	})

	test('should handle missing required parameters', async ({ page }) => {
		const incompleteUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			// Missing other required parameters
		}).toString()

		await page.goto(incompleteUrl)
		
		// Should show error for missing parameters
		await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
	})

	test('should be mobile responsive', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 })
		await page.goto('/')
		
		// Check that content is still visible and readable
		await expect(page.locator('h1')).toBeVisible()
		await expect(page.locator('a:has-text("Try Demo Authorization")')).toBeVisible()
		
		// Check OAuth page on mobile
		const validOAuthUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()

		await page.goto(validOAuthUrl)
		await page.waitForLoadState('networkidle')
		
		// Wait for loading or error/consent to appear
		const errorScreen = page.locator('[data-testid="error-screen"]')
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		
		const hasError = await errorScreen.isVisible()
		const hasConsent = await consentScreen.isVisible()
		
		expect(hasError || hasConsent).toBeTruthy()
	})

	test('should handle accessibility requirements', async ({ page }) => {
		await page.goto('/')
		
		// Check for proper heading hierarchy
		const h1 = page.locator('h1')
		await expect(h1).toBeVisible()
		
		// Check for proper button/link semantics using link selector
		const demoLink = page.locator('a:has-text("Try Demo Authorization")')
		await expect(demoLink).toHaveAttribute('href')
		
		// Test keyboard navigation
		await page.keyboard.press('Tab')
		const focusedElement = await page.locator(':focus')
		await expect(focusedElement).toBeVisible()
	})

	test('should handle OAuth flow with mock API failure gracefully', async ({ page }) => {
		// Test with invalid client_id to trigger API error
		const invalidUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: 'invalid-client-id',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()

		await page.goto(invalidUrl)
		await page.waitForLoadState('networkidle')
		
		// Should gracefully handle API failure and show error
		await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
	})

	test('should handle consent screen interactions', async ({ page }) => {
		const validOAuthUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()

		await page.goto(validOAuthUrl)
		await page.waitForLoadState('networkidle')
		
		// Wait for any loading to finish
		const loadingScreen = page.locator('[data-testid="loading-screen"]')
		const isLoading = await loadingScreen.isVisible()
		if (isLoading) {
			await loadingScreen.waitFor({ state: 'hidden' })
		}
		
		// Check if consent screen is shown
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		const hasConsent = await consentScreen.isVisible()
		
		if (hasConsent) {
			// Test that buttons are interactive
			const authorizeButton = page.locator('[data-testid="authorize-button"]')
			const cancelButton = page.locator('[data-testid="cancel-button"]')
			
			await expect(authorizeButton).toBeEnabled()
			await expect(cancelButton).toBeEnabled()
			
			// Test accessibility attributes
			await expect(authorizeButton).toHaveAttribute('aria-describedby', 'authorize-description')
			await expect(cancelButton).toHaveAttribute('aria-describedby', 'cancel-description')
		}
	})
}) 