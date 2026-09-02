import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function injectOgMeta(): Plugin {
  return {
    name: 'inject-og-meta',
    transformIndexHtml(html) {
      const siteUrl = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
      const ogImage = siteUrl ? `${siteUrl}/og-image.png` : '/og-image.png'

      let result = html
        .replaceAll('__OG_IMAGE__', ogImage)

      if (siteUrl) {
        result = result.replaceAll('__OG_URL__', `${siteUrl}/`)
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

export default defineConfig({
  plugins: [react(), tailwindcss(), injectOgMeta()],
})
