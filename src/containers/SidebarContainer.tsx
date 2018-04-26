import * as React from 'react'
import { Sidebar } from '../components/Page'
import Panel from '../components/Panel'
import SidebarNav from '../components/SidebarNav'
import ComponentsStatusContainer from './ComponentsStatusContainer'
import UserContainer from './UserContainer'

const SidebarContainer = () => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar>
      <UserContainer />
      <SidebarNav />
      <ComponentsStatusContainer />
    </Sidebar>
  </Panel>
)

export default SidebarContainer
