import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Define static routes that can be prerendered (excluding dynamic routes with params)
const routesToPrerender = [
  '/',
  '/ai-saas-quiz',
  '/ai-saas-quiz/submit',
  '/buyer-matching-quiz',
  '/auth',
  '/nda-policy',
  '/faq',
  '/about',
  '/terms',
  '/policies',
  '/contact',
  '/fees-pricing',
  '/auth-test',
  '/diagnostics',
  '/private-partners-program',
  // Protected routes that can be prerendered (they'll show loading/redirect for unauthenticated users)
  '/onboarding-redirect',
  '/product-dashboard',
  '/profile',
  '/messages',
  '/settings',
  '/list-product',
  '/admin',
  '/listing-thank-you'
]

;(async () => {
  for (const url of routesToPrerender) {
    const appHtml = render(url);
    const html = template.replace(`<!--app-html-->`, appHtml)

    const filePath = `dist${url === '/' ? '/index' : url}.html`
    
    // Ensure directory exists before writing file
    const dirPath = path.dirname(toAbsolute(filePath))
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()