const KAKAO_SDK_VERSION = '2.8.4'
const KAKAO_SDK_URL = `https://t1.kakaocdn.net/kakao_js_sdk/${KAKAO_SDK_VERSION}/kakao.min.js`
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined

interface KakaoShareLink {
  mobileWebUrl: string
  webUrl: string
}

interface KakaoSdk {
  init(key: string): void
  isInitialized(): boolean
  Share: {
    sendDefault(options: {
      objectType: 'feed'
      content: {
        title: string
        description: string
        imageUrl: string
        link: KakaoShareLink
      }
      buttons: { title: string; link: KakaoShareLink }[]
    }): void
  }
}

declare global {
  interface Window {
    Kakao?: KakaoSdk
  }
}

let sdkPromise: Promise<KakaoSdk> | null = null

function loadKakaoSdk(): Promise<KakaoSdk> {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<KakaoSdk>((resolve, reject) => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized() && KAKAO_JS_KEY) window.Kakao.init(KAKAO_JS_KEY)
      resolve(window.Kakao)
      return
    }

    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (!window.Kakao) {
        reject(new Error('Kakao SDK load failed'))
        return
      }
      if (!window.Kakao.isInitialized() && KAKAO_JS_KEY) window.Kakao.init(KAKAO_JS_KEY)
      resolve(window.Kakao)
    }
    script.onerror = () => reject(new Error('Kakao SDK load failed'))
    document.head.appendChild(script)
  })

  sdkPromise.catch(() => {
    sdkPromise = null
  })

  return sdkPromise
}

export function isKakaoShareEnabled() {
  return Boolean(KAKAO_JS_KEY)
}

export async function shareToKakao(options: {
  title: string
  description: string
  imageUrl: string
  url: string
}): Promise<boolean> {
  if (!KAKAO_JS_KEY || !options.imageUrl) return false

  const link: KakaoShareLink = { mobileWebUrl: options.url, webUrl: options.url }
  const kakao = await loadKakaoSdk()

  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: options.title,
      description: options.description,
      imageUrl: options.imageUrl,
      link,
    },
    buttons: [{ title: '결과 보러가기', link }],
  })

  return true
}
