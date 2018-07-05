import React from 'react'
import { Link } from 'react-router-dom'
import { RxDocument } from 'rxdb'
import Panel from '../components/Panel'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import Title from '../editor/manuscript/Title'
import { TitleField } from '../editor/manuscript/TitleField'
import { styled } from '../theme'
import { Project } from '../types/components'
import { ManuscriptDocument } from '../types/manuscript'

const SidebarManuscript = styled.div`
  padding: 10px 0;
`

const ManuscriptTitle = styled(Link)`
  font-size: 120%;
  color: inherit;
  text-decoration: none;
`

const ProjectTitle = styled(TitleField)`
  & .ProseMirror {
    cursor: text;

    &:focus {
      outline: none;
    }
  }
`

interface Props {
  project: Project
  manuscripts: ManuscriptDocument[]
  saveProject: (data: Partial<Project>) => Promise<RxDocument<Project>>
}

const ProjectSidebar: React.SFC<Props> = ({
  project,
  manuscripts,
  saveProject,
}) => (
  <Panel name={'sidebar'} direction={'row'} side={'end'} minSize={200}>
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>
          <ProjectTitle
            value={project.title}
            handleChange={async (title: string) => {
              if (title && title !== project.title) {
                await saveProject({ title })
              }
            }}
          />
        </SidebarTitle>
      </SidebarHeader>
      <SidebarContent>
        {manuscripts.map(manuscript => (
          <SidebarManuscript key={manuscript.id}>
            <ManuscriptTitle
              to={`/projects/${project.id}/manuscripts/${manuscript.id}`}
            >
              <Title value={manuscript.get('title') || 'Untitled'} />
            </ManuscriptTitle>
          </SidebarManuscript>
        ))}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ProjectSidebar
