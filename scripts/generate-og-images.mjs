import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const outDir = path.join(publicDir, 'og')
const ogConfig = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/og.json'), 'utf8'))

const fontRegular = fs.readFileSync(
  path.join(root, 'node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff'),
)
const fontBold = fs.readFileSync(
  path.join(root, 'node_modules/@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff'),
)

const WIDTH = 1200
const HEIGHT = 630

function resolveCharacterPath(character) {
  if (character.startsWith('/')) return path.join(publicDir, character.slice(1))
  if (character.endsWith('.png')) return path.join(publicDir, character)
  return path.join(publicDir, 'characters/pixel', `${character}.png`)
}

function toDataUrl(filePath) {
  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).slice(1)
  return `data:image/${ext};base64,${buffer.toString('base64')}`
}

function getTitleFontSize(title) {
  if (title.length <= 14) return 44
  if (title.length <= 22) return 38
  if (title.length <= 30) return 34
  return 30
}

function getDescriptionFontSize(description) {
  if (description.length <= 28) return 28
  if (description.length <= 48) return 24
  return 22
}

function buildMarkup({ title, description, characterPath, badge = 'Simply Test' }) {
  const characterSrc = toDataUrl(resolveCharacterPath(characterPath))
  const titleSize = getTitleFontSize(title)
  const descriptionSize = getDescriptionFontSize(description)

  return {
    type: 'div',
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF9E8',
        backgroundImage:
          'radial-gradient(circle, rgba(255, 107, 107, 0.18) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        padding: '48px 64px',
        fontFamily: 'Noto Sans KR',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              width: '100%',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#FF6B6B',
                    marginBottom: 20,
                  },
                  children: badge,
                },
              },
              {
                type: 'img',
                props: {
                  src: characterSrc,
                  width: 220,
                  height: 220,
                  style: {
                    objectFit: 'contain',
                    marginBottom: 28,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 980,
                    backgroundColor: '#FFFFFF',
                    border: '4px solid #2D2A26',
                    borderRadius: 40,
                    padding: '32px 48px',
                    boxShadow: '0 8px 0 rgba(45, 42, 38, 0.12)',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: titleSize,
                          fontWeight: 700,
                          color: '#2D2A26',
                          textAlign: 'center',
                          lineHeight: 1.35,
                          maxWidth: 900,
                        },
                        children: title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          marginTop: 16,
                          fontSize: descriptionSize,
                          fontWeight: 400,
                          color: '#6B7280',
                          textAlign: 'center',
                          lineHeight: 1.5,
                          maxWidth: 900,
                        },
                        children: description,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}

async function renderOgImage(markup) {
  const svg = await satori(markup, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: 'Noto Sans KR',
        data: fontRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Noto Sans KR',
        data: fontBold,
        weight: 700,
        style: 'normal',
      },
    ],
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })

  return resvg.render().asPng()
}

async function writeOgImage(filename, markup) {
  const png = await renderOgImage(markup)
  const dest = path.join(outDir, filename)
  fs.writeFileSync(dest, png)
  console.log(`generated ${path.relative(root, dest)}`)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })

  const pages = [
    {
      filename: 'home.png',
      title: 'Simply Test',
      description: ogConfig.home.description,
      character: 'brand-sprout.png',
    },
    {
      filename: 'list.png',
      title: '테스트 목록',
      description: ogConfig.list.description,
      character: 'brand-sprout.png',
    },
    ...ogConfig.tests.map((test) => ({
      filename: `${test.id}.png`,
      title: test.title,
      description: test.description,
      character: test.character,
    })),
  ]

  for (const page of pages) {
    await writeOgImage(
      page.filename,
      buildMarkup({
        title: page.title,
        description: page.description,
        characterPath: page.character,
      }),
    )
  }

  fs.copyFileSync(path.join(outDir, 'home.png'), path.join(publicDir, 'og-image.png'))
  console.log('updated public/og-image.png')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
