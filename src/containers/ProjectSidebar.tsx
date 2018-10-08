import React from 'react'
import { Link } from 'react-router-dom'
import { RxDocument } from 'rxdb'
import Panel from '../components/Panel'
import ShareProjectButton from '../components/ShareProjectButton'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTitle,
} from '../components/Sidebar'
import Title from '../editor/title/Title'
import { TitleField } from '../editor/title/TitleField'
import { styled } from '../theme'
import { Manuscript, Project } from '../types/components'

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

    & .empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    & .empty-node:hover::before {
      color: #999;
    }
  }
`

interface Props {
  project: Project
  manuscripts: Manuscript[]
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
        <ShareProjectButton project={project} />
      </SidebarHeader>
      <SidebarContent>
        {manuscripts.map(manuscript => (
          <SidebarManuscript key={manuscript.id}>
            <ManuscriptTitle
              to={`/projects/${project.id}/manuscripts/${manuscript.id}`}
            >
              <Title value={manuscript.title || 'Untitled Manuscript'} />
            </ManuscriptTitle>
          </SidebarManuscript>
        ))}
      </SidebarContent>
    </Sidebar>
  </Panel>
)

export default ProjectSidebar
