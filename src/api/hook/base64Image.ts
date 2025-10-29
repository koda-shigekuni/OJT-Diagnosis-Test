// hooks/useBase64Image.ts
import axios from 'axios'
import { useEffect, useState } from 'react'

/**
 * MinIOからBase64画像を取得するカスタムフック
 * @param fileName ファイル名（例: 'user-image/hoge.png'）
 * @returns base64形式の画像データURL
 */
export const useBase64Image = (fileName?: string | null) => {
  const [base64Url, setBase64Url] = useState<string | null>(null)

  useEffect(() => {
    if (!fileName) {
      setBase64Url(null)
      return
    }

    axios
      .get<{ base64: string }>(`/api/image/base64/${encodeURIComponent(fileName)}`)
      .then(res => {
        let url = res.data.base64
        if (!url.startsWith('data:image/')) {
          const ext = fileName.split('.').pop()?.toLowerCase()
          const mime =
            ext === 'png'
              ? 'image/png'
              : ext === 'jpg' || ext === 'jpeg'
                ? 'image/jpeg'
                : ext === 'gif'
                  ? 'image/gif'
                  : 'application/octet-stream'
          url = `data:${mime};base64,${url}`
        }
        setBase64Url(url)
        console.log('[useBase64Image] APIレスポンス base64Url:', url)
      })
      .catch(() => setBase64Url(null))
  }, [fileName])

  return base64Url
}
