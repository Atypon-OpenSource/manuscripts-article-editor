import * as React from 'react'
import { DraggableTreeProps } from '../components/DraggableTree'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import { Project } from '../types/components'
// import ComponentsStatusContainer from './ComponentsStatusContainer'
import ManuscriptOutlineContainer from './ManuscriptOutlineContainer'

interface ManuscriptSidebarProps {
  project?: Project
}

type Props = DraggableTreeProps & ManuscriptSidebarProps

const ProjectTitle = SidebarTitle.extend`
  font-size: 110%;
  color: black;
`

const ManuscriptSidebar: React.SFC<Props> = ({ doc, onDrop, project }) => (
  <Panel name={'sidebar'} minSize={200} direction={'row'} side={'end'}>
    <Sidebar>
      <SidebarHeader>
        <ProjectTitle>{(project && project.title) || 'Untitled'}</ProjectTitle>
      </SidebarHeader>

      <SidebarContent>
        <ManuscriptOutlineContainer doc={doc} onDrop={onDrop} />
        {/*<ComponentsStatusContainer />*/}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ManuscriptSidebar
