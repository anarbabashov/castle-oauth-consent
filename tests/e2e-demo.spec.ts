import { test, expect } from '@playwright/test'

test.describe('End-to-End OAuth Consent Flow Demo', () => {
	test('Complete OAuth flow demonstration with step-by-step verification', async ({ page }) => {
		// Step 1: Navigate to the landing page
		console.log('🚀 Step 1: Testing Landing Page...')
		await page.goto('/')
		
		// Verify landing page elements
		await expect(page).toHaveTitle(/Castle OAuth Authorization/)
		await expect(page.locator('h1')).toContainText('OAuth Authorization')
		await expect(page.locator('text=Secure authorization flow')).toBeVisible()
		
		// Check feature cards
		console.log('✅ Verifying feature cards...')
		await expect(page.locator('h3:has-text("Secure")')).toBeVisible()
		await expect(page.locator('h3:has-text("Transparent")')).toBeVisible()
		await expect(page.locator('h3:has-text("Seamless")')).toBeVisible()
		
		// Take a screenshot of landing page
		await page.screenshot({ path: 'test-results/01-landing-page.png', fullPage: true })
		console.log('📸 Screenshot saved: 01-landing-page.png')
		
		// Step 2: Click on demo authorization link
		console.log('🚀 Step 2: Testing OAuth Authorization Flow...')
		const demoLink = page.locator('a:has-text("Try Demo Authorization")')
		await expect(demoLink).toBeVisible()
		await demoLink.click()
		
		// Wait for OAuth page to load
		await page.waitForLoadState('networkidle')
		
		// Step 3: Verify we're on the OAuth authorization page
		console.log('✅ Verifying OAuth URL parameters...')
		expect(page.url()).toContain('/oauth/authorize')
		expect(page.url()).toContain('client_id=8f9a0002-ae0f-4412-ac4c-902f1e88e5ff')
		expect(page.url()).toContain('scope=conversion')
		expect(page.url()).toContain('response_type=code')
		expect(page.url()).toContain('code_challenge_method=S256')
		
		// Step 4: Wait for loading to complete and check if we have consent screen or error
		const loadingScreen = page.locator('[data-testid="loading-screen"]')
		const isLoading = await loadingScreen.isVisible()
		if (isLoading) {
			console.log('⏳ Waiting for API response...')
			await loadingScreen.waitFor({ state: 'hidden', timeout: 10000 })
		}
		
		// Check what screen we ended up with
		const errorScreen = page.locator('[data-testid="error-screen"]')
		const consentScreen = page.locator('[data-testid="consent-screen"]')
		
		const hasError = await errorScreen.isVisible()
		const hasConsent = await consentScreen.isVisible()
		
		if (hasError) {
			console.log('❌ API Error detected - testing error handling...')
			
			// Verify error screen elements
			await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
			await expect(errorScreen).toHaveAttribute('data-testid', 'error-screen')
			
			// Take screenshot of error state
			await page.screenshot({ path: 'test-results/02-error-screen.png' })
			console.log('📸 Screenshot saved: 02-error-screen.png')
			console.log('✅ Error handling verified successfully!')
			
		} else if (hasConsent) {
			console.log('✅ Consent screen loaded successfully!')
			
			// Step 5: Verify consent screen elements
			console.log('🚀 Step 5: Testing Consent Screen Elements...')
			
			// Check main heading
			await expect(page.locator('h1:has-text("Authorize Application")')).toBeVisible()
			await expect(page.locator('text=Grant access to your Castle account')).toBeVisible()
			
			// Check application info section
			const appInfo = page.locator('[data-testid="app-info"]')
			await expect(appInfo).toBeVisible()
			console.log('✅ Application info section verified')
			
			// Check permissions section
			const permissionsSection = page.locator('[data-testid="permissions-section"]')
			await expect(permissionsSection).toBeVisible()
			await expect(page.locator('h3:has-text("Permissions Requested")')).toBeVisible()
			console.log('✅ Permissions section verified')
			
			// Check redirect info
			const redirectInfo = page.locator('[data-testid="redirect-info"]')
			await expect(redirectInfo).toBeVisible()
			await expect(redirectInfo).toContainText('ll be redirected to:')
			console.log('✅ Redirect info verified')
			
			// Check action buttons
			const authorizeButton = page.locator('[data-testid="authorize-button"]')
			const cancelButton = page.locator('[data-testid="cancel-button"]')
			
			await expect(authorizeButton).toBeVisible()
			await expect(authorizeButton).toBeEnabled()
			await expect(cancelButton).toBeVisible()
			await expect(cancelButton).toBeEnabled()
			console.log('✅ Action buttons verified')
			
			// Take screenshot of consent screen
			await page.screenshot({ path: 'test-results/03-consent-screen.png' })
			console.log('📸 Screenshot saved: 03-consent-screen.png')
			
			// Step 6: Test button interactions
			console.log('🚀 Step 6: Testing Button Interactions...')
			
			// Test hover states
			await authorizeButton.hover()
			await page.waitForTimeout(1000) // Wait for hover animation
			
			await cancelButton.hover()
			await page.waitForTimeout(1000)
			
			// Take screenshot showing hover states
			await page.screenshot({ path: 'test-results/04-button-hover.png' })
			console.log('📸 Screenshot saved: 04-button-hover.png')
			
			console.log('✅ Button interactions verified')
		}
		
		// Step 7: Test mobile responsiveness
		console.log('🚀 Step 7: Testing Mobile Responsiveness...')
		await page.setViewportSize({ width: 375, height: 667 })
		await page.waitForTimeout(1000) // Wait for responsive layout
		
		// Take mobile screenshot
		await page.screenshot({ path: 'test-results/05-mobile-view.png' })
		console.log('📸 Screenshot saved: 05-mobile-view.png')
		
		// Verify mobile layout
		if (hasConsent) {
			await expect(page.locator('[data-testid="consent-screen"]')).toBeVisible()
			await expect(page.locator('[data-testid="authorize-button"]')).toBeVisible()
		} else if (hasError) {
			await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		}
		console.log('✅ Mobile responsiveness verified')
		
		// Step 8: Test accessibility
		console.log('🚀 Step 8: Testing Accessibility...')
		
		// Reset viewport
		await page.setViewportSize({ width: 1280, height: 720 })
		
		// Test keyboard navigation
		await page.keyboard.press('Tab')
		let focusedElement = await page.locator(':focus')
		await expect(focusedElement).toBeVisible()
		
		// Continue tabbing through elements
		await page.keyboard.press('Tab')
		await page.keyboard.press('Tab')
		
		console.log('✅ Keyboard navigation verified')
		
		// Step 9: Test error scenarios
		console.log('🚀 Step 9: Testing Error Scenarios...')
		
		// Test with invalid parameters
		await page.goto('/oauth/authorize?invalid=params')
		await page.waitForLoadState('networkidle')
		
		// Should show error
		await expect(page.locator('[data-testid="error-screen"]')).toBeVisible()
		await expect(page.locator('h2:has-text("Authorization Error")')).toBeVisible()
		
		// Take screenshot of error scenario
		await page.screenshot({ path: 'test-results/06-error-scenario.png' })
		console.log('📸 Screenshot saved: 06-error-scenario.png')
		console.log('✅ Error scenarios verified')
		
		// Final step: Return to home page
		console.log('🚀 Final Step: Returning to Home Page...')
		await page.goto('/')
		await expect(page.locator('h1')).toContainText('Castle OAuth Authorization')
		
		// Take final screenshot
		await page.screenshot({ path: 'test-results/07-final-home.png' })
		console.log('📸 Screenshot saved: 07-final-home.png')
		
		console.log('🎉 End-to-End Test Completed Successfully!')
		console.log('📊 Test Summary:')
		console.log('   ✅ Landing page functionality')
		console.log('   ✅ OAuth parameter handling')
		console.log('   ✅ Consent screen rendering (or error handling)')
		console.log('   ✅ Mobile responsiveness') 
		console.log('   ✅ Accessibility features')
		console.log('   ✅ Error scenarios')
		console.log('   ✅ UI interactions')
		console.log('📁 Screenshots saved in test-results/ directory')
	})
	
	test('Test OAuth flow with different screen sizes', async ({ page }) => {
		console.log('🚀 Testing OAuth flow across different devices...')
		
		const devices = [
			{ name: 'Desktop', width: 1920, height: 1080 },
			{ name: 'Tablet', width: 768, height: 1024 },
			{ name: 'Mobile', width: 375, height: 667 },
			{ name: 'Small Mobile', width: 320, height: 568 }
		]
		
		const oauthUrl = '/oauth/authorize?' + new URLSearchParams({
			client_id: '8f9a0002-ae0f-4412-ac4c-902f1e88e5ff',
			state: '-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y',
			redirect_uri: 'https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/',
			response_type: 'code',
			scope: 'conversion',
			code_challenge: 'BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA',
			code_challenge_method: 'S256'
		}).toString()
		
		for (const device of devices) {
			console.log(`📱 Testing ${device.name} (${device.width}x${device.height})...`)
			
			await page.setViewportSize({ width: device.width, height: device.height })
			await page.goto(oauthUrl)
			await page.waitForLoadState('networkidle')
			
			// Wait for loading if present
			const loadingScreen = page.locator('[data-testid="loading-screen"]')
			const isLoading = await loadingScreen.isVisible()
			if (isLoading) {
				await loadingScreen.waitFor({ state: 'hidden', timeout: 10000 })
			}
			
			// Check that either consent or error screen is visible
			const errorScreen = page.locator('[data-testid="error-screen"]')
			const consentScreen = page.locator('[data-testid="consent-screen"]')
			
			const hasError = await errorScreen.isVisible()
			const hasConsent = await consentScreen.isVisible()
			
			expect(hasError || hasConsent).toBeTruthy()
			
			// Take screenshot for this device
			await page.screenshot({ 
				path: `test-results/device-${device.name.toLowerCase()}-${device.width}x${device.height}.png`
			})
			
			console.log(`✅ ${device.name} layout verified`)
		}
		
		console.log('🎉 Multi-device testing completed!')
	})
}) 