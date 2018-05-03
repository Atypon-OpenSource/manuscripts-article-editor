import React from 'react'
import { Sidebar } from '../components/Page'
import Panel from '../components/Panel'
import SidebarNav from '../components/SidebarNav'
import UserContainer from './UserContainer'

const SidebarContainer: React.SFC = () => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar>
      <UserContainer />
      <SidebarNav />
    </Sidebar>
  </Panel>
)

export default SidebarContainer
