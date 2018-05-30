import React from 'react'
// import { IconButton } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'

class ComponentsStatusContainer extends React.Component<ComponentsProps> {
  public render() {
    const { components } = this.props

    if (components.error) {
      return <Spinner color={'red'} />
    }

    if (components.active) {
      return <Spinner color={'green'} />
    }

    return null

    // return (
    //   <IconButton onClick={() => components.sync({ live: true })}>
    //     <Spinner color={'gray'} />
    //   </IconButton>
    // )
  }
}

export default withComponents(ComponentsStatusContainer)
