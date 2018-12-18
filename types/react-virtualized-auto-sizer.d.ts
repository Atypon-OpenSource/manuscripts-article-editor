declare module 'react-virtualized-auto-sizer' {
  interface Size {
    height: number
    width: number
  }

  class AutoSizer extends React.Component<{
    className?: string
    defaultHeight?: number
    defaultWidth?: number
    disableHeight?: boolean
    disableWidth?: boolean
    nonce?: string
    onResize?: (size: Size) => void
    style?: React.CSSProperties
    children: (size: Size) => React.ReactNode
  }> {}

  export default AutoSizer
}
