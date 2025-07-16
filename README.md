# Castle OAuth 2.0 + PKCE Consent Screen

A modern, secure OAuth 2.0 authorization consent screen built with Next.js 14, TypeScript, and Tailwind CSS. This application implements the OAuth 2.0 Authorization Code flow with PKCE (Proof Key for Code Exchange) for secure third-party application authorization.

![OAuth Consent Screen](https://img.shields.io/badge/OAuth-2.0%20%2B%20PKCE-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-teal)

## ✨ Features

### Core OAuth Features
- ✅ **OAuth 2.0 + PKCE Implementation** - Secure authorization code flow with PKCE
- ✅ **Application Information Display** - Shows app name, icon, and description
- ✅ **Scope/Permission Visualization** - Clear presentation of requested permissions
- ✅ **Secure Authorization Flow** - Proper redirect handling with code and state parameters
- ✅ **Comprehensive Error Handling** - Graceful error states with user-friendly messages

### User Experience
- ✅ **Modern UI Design** - Inspired by Castle's design system
- ✅ **Mobile Responsive** - Optimized for all device sizes
- ✅ **Loading States** - Smooth loading indicators during API calls
- ✅ **Accessibility Compliant** - WCAG guidelines with proper ARIA attributes
- ✅ **Dark Mode Ready** - Prepared for theme switching

### Technical Features
- ✅ **Type Safety** - Full TypeScript implementation with Zod validation
- ✅ **Server Components** - Next.js 14 App Router with server-side rendering
- ✅ **API Integration** - RESTful API client with error handling
- ✅ **Testing Suite** - Comprehensive Playwright tests
- ✅ **Security Best Practices** - Input validation and XSS protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd castle-oauth-consent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Testing the OAuth Flow

The application includes a demo link with pre-configured test parameters:

**Test URL:**
```
http://localhost:3000/oauth/authorize?client_id=8f9a0002-ae0f-4412-ac4c-902f1e88e5ff&state=-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y&redirect_uri=https%3A%2F%2Fzapier.com%2Fdashboard%2Fauth%2Foauth%2Freturn%2FApp222291CLIAPI%2F&response_type=code&scope=conversion&code_challenge=BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA&code_challenge_method=S256
```

### Required OAuth Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `client_id` | `8f9a0002-ae0f-4412-ac4c-902f1e88e5ff` | Unique identifier for the OAuth client |
| `scope` | `conversion` | Requested permissions/scopes |
| `state` | `-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y` | CSRF protection token |
| `redirect_uri` | `https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/` | Callback URL after authorization |
| `response_type` | `code` | OAuth flow type (authorization code) |
| `code_challenge` | `BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA` | PKCE code challenge |
| `code_challenge_method` | `S256` | PKCE challenge method |

## 🏗️ Project Structure

```
castle-oauth-consent/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── oauth/authorize/          # OAuth authorization page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # React components
│   │   └── oauth-consent.tsx         # Main consent component
│   ├── lib/                          # Utility functions
│   │   ├── oauth-api.ts              # API client
│   │   └── utils.ts                  # Helper utilities
│   └── types/                        # TypeScript definitions
│       └── oauth.ts                  # OAuth type definitions
├── tests/                            # Playwright tests
│   └── oauth-consent.spec.ts         # Consent flow tests
├── playwright.config.ts              # Playwright configuration
└── package.json                      # Project dependencies
```

## 🧪 Testing

### Running Tests

```bash
# Run all Playwright tests
npm run test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/oauth-consent.spec.ts
```

### Test Coverage

The test suite covers:
- ✅ Landing page functionality
- ✅ OAuth parameter validation
- ✅ Consent screen rendering
- ✅ Error handling scenarios
- ✅ Mobile responsiveness
- ✅ Accessibility compliance
- ✅ API failure scenarios

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dev.api.savewithcastle.com
NEXT_PUBLIC_AUTH_TOKEN=your-jwt-token-here
```

### API Integration

The application integrates with Castle's OAuth API endpoints:

- **GET** `/oauth/scopes` - Retrieve client information and scopes
- **POST** `/oauth/authorize` - Process authorization request

Authentication uses JWT tokens in the `Authorization` header.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_AUTH_TOKEN`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

1. **Build Docker image**
   ```bash
   docker build -t castle-oauth-consent .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 castle-oauth-consent
   ```

### Traditional Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🛡️ Security Considerations

- **PKCE Implementation** - Protects against authorization code interception
- **State Parameter Validation** - Prevents CSRF attacks
- **Input Sanitization** - All user inputs are validated with Zod schemas
- **Secure Headers** - Next.js provides security headers by default
- **JWT Authentication** - Secure API communication with Castle backend

## 🎨 Design System

The UI follows Castle's design principles:
- **Typography** - Inter font family for readability
- **Colors** - Blue primary (#2563eb) with gray accents
- **Spacing** - Consistent 8px grid system
- **Components** - Rounded corners (12px-24px) for modern feel
- **Shadows** - Subtle elevation with tailwind shadow utilities

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Playwright tests |

### Code Quality

- **ESLint** - Code linting with Next.js rules
- **TypeScript** - Strict type checking
- **Prettier** - Code formatting (configured in .eslintrc)
- **Playwright** - End-to-end testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions or support, please open an issue or contact the development team.

---

**Built with ❤️ for Castle - Secure OAuth 2.0 + PKCE Authorization**
