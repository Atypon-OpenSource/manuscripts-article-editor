import React from 'react'
import Panel from '../components/Panel'
import { Sidebar } from '../components/Sidebar'
import SidebarNav from '../components/SidebarNav'

const SidebarContainer: React.SFC = () => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar>
      <SidebarNav />
    </Sidebar>
  </Panel>
)

export default SidebarContainer
