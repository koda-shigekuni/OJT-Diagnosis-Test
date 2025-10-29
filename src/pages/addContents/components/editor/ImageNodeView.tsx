import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import Base64Image from '../../../contents/components/Base64Image'

const ImageNodeView = (props: NodeViewProps) => {
  const { node, selected } = props
  const src: string = node.attrs.src
  const alt: string | undefined = node.attrs.alt

  return (
    <NodeViewWrapper as="span" className={selected ? 'ProseMirror-selectednode' : undefined}>
      <Base64Image fileName={src} alt={alt} style={{ maxWidth: '100%' }} />
    </NodeViewWrapper>
  )
}

export default ImageNodeView
