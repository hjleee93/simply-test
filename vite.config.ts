import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function injectOgMeta(siteUrl: string): Plugin {
  return {
    name: 'inject-og-meta',
    transformIndexHtml(html) {
      const normalized = siteUrl.replace(/\/$/, '')
      const ogImage = normalized ? `${normalized}/og-image.png` : '/og-image.png'

      let result = html.replaceAll('__OG_IMAGE__', ogImage)

      if (normalized) {
        result = result.replaceAll('__OG_URL__', `${normalized}/`)
      } else {
        result = result.replace(
          /    <meta property="og:url" content="__OG_URL__" \/>\n/,
          '',
        )
      }

      return result
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL ?? ''

  return {
    plugins: [react(), tailwindcss(), injectOgMeta(siteUrl)],
  }
})
