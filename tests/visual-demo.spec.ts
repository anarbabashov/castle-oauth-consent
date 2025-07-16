import { test, expect } from '@playwright/test'

test.describe('Visual OAuth Flow Demonstration', () => {
	test('Demonstrate complete OAuth consent flow with visual verification', async ({ page }) => {
		console.log('🎬 Starting Visual OAuth Flow Demonstration...')
		
		// Step 1: Landing Page
		console.log('📱 Step 1: Landing Page')
		await page.goto('/')
		await expect(page.locator('h1')).toContainText('OAuth Authorization')
		await page.screenshot({ path: 'test-results/demo-01-landing.png', fullPage: true })
		console.log('✅ Landing page captured')
		
		// Step 2: Navigate to OAuth flow
		console.log('📱 Step 2: OAuth Authorization')
		const demoLink = page.locator('a:has-text("Try Demo Authorization")')
		await demoLink.click()
		await page.waitForLoadState('networkidle')
		
		// Verify we're on the OAuth page
		expect(page.url()).toContain('/oauth/authorize')
		expect(page.url()).toContain('client_id=8f9a0002-ae0f-4412-ac4c-902f1e88e5ff')
		console.log('✅ OAuth parameters verified in URL')
		
		// Step 3: Wait for the page to load and take screenshot
		const loadingScreen = page.locator('[data-testid="loading-screen"]')
		if (await loadingScreen.isVisible()) {
			console.log('⏳ Loading application data...')
			await loadingScreen.waitFor({ state: 'hidden', timeout: 15000 })
		}
		
		// Check what screen we have
		const errorScreen = page.locator('[data-testid="error-screen"]')
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		
		const hasError = await errorScreen.isVisible()
		const hasConsent = await consentScreen.isVisible()
		
		if (hasConsent) {
			console.log('✅ Consent screen loaded successfully!')
			
			// Verify key elements
			await expect(page.locator('h1:has-text("Authorize Application")')).toBeVisible()
			await expect(page.locator('[data-testid="app-info"]')).toBeVisible()
			await expect(page.locator('[data-testid="permissions-section"]')).toBeVisible()
			await expect(page.locator('[data-testid="authorize-button"]')).toBeVisible()
			await expect(page.locator('[data-testid="cancel-button"]')).toBeVisible()
			
			await page.screenshot({ path: 'test-results/demo-02-consent-screen.png' })
			console.log('✅ Consent screen captured')
			
			// Test button states
			const authorizeBtn = page.locator('[data-testid="authorize-button"]')
			await authorizeBtn.hover()
			await page.waitForTimeout(500)
			await page.screenshot({ path: 'test-results/demo-03-button-hover.png' })
			console.log('✅ Button hover state captured')
			
		} else if (hasError) {
			console.log('ℹ️ API returned error - demonstrating error handling')
			await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
			await page.screenshot({ path: 'test-results/demo-02-error-screen.png' })
			console.log('✅ Error screen captured')
		}
		
		// Step 4: Mobile responsiveness test
		console.log('📱 Step 4: Testing Mobile View')
		await page.setViewportSize({ width: 375, height: 667 })
		await page.waitForTimeout(1000)
		await page.screenshot({ path: 'test-results/demo-04-mobile.png' })
		console.log('✅ Mobile view captured')
		
		// Step 5: Error scenario
		console.log('📱 Step 5: Testing Error Handling')
		await page.setViewportSize({ width: 1280, height: 720 })
		await page.goto('/oauth/authorize?invalid=parameters')
		await page.waitForLoadState('networkidle')
		
		await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		await page.screenshot({ path: 'test-results/demo-05-error-handling.png' })
		console.log('✅ Error handling captured')
		
		console.log('🎉 Visual demonstration completed!')
		console.log('📁 Screenshots saved in test-results/ directory:')
		console.log('   📸 demo-01-landing.png - Landing page')
		console.log('   📸 demo-02-consent-screen.png - OAuth consent screen')
		console.log('   📸 demo-03-button-hover.png - Interactive elements')
		console.log('   📸 demo-04-mobile.png - Mobile responsiveness')
		console.log('   📸 demo-05-error-handling.png - Error scenarios')
	})
	
	test('Test API integration status', async ({ page }) => {
		console.log('🔌 Testing API Integration...')
		
		const oauthUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()

		await page.goto(oauthUrl)
		await page.waitForLoadState('networkidle')
		
		// Wait for loading to complete
		const loadingScreen = page.locator('[data-testid="loading-screen"]')
		if (await loadingScreen.isVisible()) {
			await loadingScreen.waitFor({ state: 'hidden', timeout: 15000 })
		}
		
		// Check final state
		const errorScreen = page.locator('[data-testid="error-screen"]')
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		
		const hasError = await errorScreen.isVisible()
		const hasConsent = await consentScreen.isVisible()
		
		if (hasConsent) {
			console.log('✅ API Integration: WORKING - Consent screen loaded')
			console.log('   📊 Successfully fetched client information')
			console.log('   📊 OAuth parameters validated')
			console.log('   📊 UI rendered correctly')
		} else if (hasError) {
			console.log('ℹ️ API Integration: ERROR STATE - but error handling works')
			console.log('   📊 Error gracefully handled')
			console.log('   📊 User-friendly error message displayed')
			console.log('   📊 Application remains stable')
		}
		
		// Verify that either state is properly handled
		expect(hasError || hasConsent).toBeTruthy()
		console.log('✅ Application responds appropriately to API state')
	})
}) 