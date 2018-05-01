import React from 'react'
import Outline from '../components/Outline'
import { Sidebar } from '../components/Page'
import Panel from '../components/Panel'
import ComponentsStatusContainer from './ComponentsStatusContainer'
import UserContainer from './UserContainer'

const OutlineSidebarContainer: React.SFC = () => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <UserContainer />
      <Outline />
      <ComponentsStatusContainer />
    </Sidebar>
  </Panel>
)

export default OutlineSidebarContainer
