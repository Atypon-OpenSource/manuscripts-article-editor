import * as React from 'react'
import { DraggableTreeProps } from '../components/DraggableTree'
import { Sidebar } from '../components/Page'
import Panel from '../components/Panel'
// import ComponentsStatusContainer from './ComponentsStatusContainer'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'
import UserContainer from './UserContainer'

const ManuscriptSidebarContainer: React.SFC<DraggableTreeProps> = ({
  doc,
  onDrop,
}) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <UserContainer />
      <ManuscriptOutlineContainer doc={doc} onDrop={onDrop} />
      {/*<ComponentsStatusContainer />*/}
    </Sidebar>
  </Panel>
)

export default ManuscriptSidebarContainer
