import { useBase64Image } from '../../../api/hook/base64Image'
import noImage from '../../../assets/NOIMAGE.png'

type Props = {
  fileName?: string | null
  alt?: string
} & React.ImgHTMLAttributes<HTMLImageElement>

function isBase64Src(src?: string | null): boolean {
  return !!src && src.startsWith('data:image/')
}

const Base64Image = ({ fileName, alt, ...rest }: Props) => {
  const base64Url = useBase64Image(isBase64Src(fileName) ? undefined : (fileName ?? undefined))

  // ログ出力
  console.log('[Base64Image] props.fileName:', fileName)
  console.log('[Base64Image] isBase64Src:', isBase64Src(fileName))
  console.log('[Base64Image] base64Url:', base64Url)

  let src: string | undefined
  if (!fileName) {
    src = noImage
    console.log('[Base64Image] ファイル名なし→noImage使用:', src)
  } else if (isBase64Src(fileName)) {
    src = fileName
    console.log('[Base64Image] すでにbase64形式→そのまま使用:', src)
  } else {
    src = base64Url || noImage
    console.log('[Base64Image] 通常ファイル→API経由。src:', src)
  }

  return <img src={src} alt={alt} {...rest} />
}

export default Base64Image
