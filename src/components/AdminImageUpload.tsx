import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { resolveCharacterImage } from '../lib/characters'
import type { AdminImageKind } from '../lib/imageUpload'
import { uploadAdminImage } from '../lib/uploadAdminImage'

interface AdminImageUploadProps {
  label: string
  hint: string
  kind: AdminImageKind
  testId: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onDimensions?: (size: { width: number; height: number }) => void
}

function fieldClassName() {
  return 'mt-1 w-full rounded-md border-2 border-ink px-3 py-2 text-sm'
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 읽지 못했어요.'))
    }
    image.src = url
  })
}

export default function AdminImageUpload({
  label,
  hint,
  kind,
  testId,
  value,
  onChange,
  placeholder,
  onDimensions,
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const preview = value.trim() ? resolveCharacterImage(value.trim()) : ''

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!testId.trim()) {
      setError('테스트 id를 먼저 입력해 주세요.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const [url, size] = await Promise.all([
        uploadAdminImage(file, kind, testId),
        onDimensions ? readImageSize(file) : Promise.resolve(null),
      ])
      onChange(url)
      if (size) onDimensions?.(size)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '이미지를 올리지 못했어요.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-bold text-ink">
        {label}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName()}
          placeholder={placeholder}
        />
      </label>
      <label className="mt-2 inline-flex cursor-pointer items-center rounded-md border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold text-ink">
        {uploading ? '올리는 중...' : '파일 올리기'}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          disabled={uploading}
          onChange={onFile}
        />
      </label>
      <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>
      {error ? <p className="mt-1 text-xs font-bold text-accent">{error}</p> : null}
      {preview ? (
        <img
          src={preview}
          alt=""
          className="mt-3 h-32 w-auto max-w-full rounded-md border border-ink/20 object-contain"
        />
      ) : null}
    </div>
  )
}
