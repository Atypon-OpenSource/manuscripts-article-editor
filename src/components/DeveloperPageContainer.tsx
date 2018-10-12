import React from 'react'
import { DeveloperActions, DeveloperMenu } from './nav/DeveloperMenu'

class DeveloperPageContainer extends React.Component {
  public render() {
    return (
      <div>
        <DeveloperActions />
        <DeveloperMenu />
      </div>
    )
  }
}

export default DeveloperPageContainer
