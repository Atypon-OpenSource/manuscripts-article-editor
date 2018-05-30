import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { DropdownLink } from '../components/Dropdown'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { PROJECT } from '../transformer/object-types'
import { AnyComponent, Project } from '../types/components'
import { ProjectDocument } from '../types/project'

interface State {
  projects: Project[]
}

class ProjectsMenu extends React.Component<ComponentsProps, State> {
  public state: Readonly<State> = {
    projects: [],
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    const sub = this.getCollection()
      .find({ objectType: PROJECT })
      .sort({ createdAt: -1 })
      .$.subscribe((projects: ProjectDocument[]) => {
        this.setState({
          projects: projects.map(project => project.toJSON()),
        })
      })

    this.subs.push(sub)
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { projects } = this.state

    return (
      <React.Fragment>
        {projects.map(project => (
          <DropdownLink key={project.id} to={`/projects/${project.id}`}>
            {project.title || 'Untitled'}
          </DropdownLink>
        ))}
      </React.Fragment>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<AnyComponent>
  }
}

export default withComponents(ProjectsMenu)
