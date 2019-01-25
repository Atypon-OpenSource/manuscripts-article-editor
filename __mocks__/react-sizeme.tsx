import React from 'react'

interface SizeMeProps {
  size: {
    width: number | null
    height: number | null
  }
}

interface Props {
  children(props: SizeMeProps): JSX.Element
}

export class SizeMe extends React.Component<Props> {
  public render() {
    const size = {
      width: 800,
      height: 600,
    }

    return this.props.children({ size })
  }
}
