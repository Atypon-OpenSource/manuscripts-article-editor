import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import {
  EmptyProjectsDropdownList,
  ProjectsDropdownList,
} from '../components/ProjectsDropdownList'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { PROJECT } from '../transformer/object-types'
import { Project } from '../types/components'
import { ProjectDocument } from '../types/project'

interface State {
  projects: Project[] | null
}

interface Props {
  handleClose?: React.MouseEventHandler<HTMLElement>
}

class ProjectsMenu extends React.Component<Props & ComponentsProps, State> {
  public state: Readonly<State> = {
    projects: null,
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
    const { handleClose } = this.props
    const { projects } = this.state

    if (projects === null) return null

    if (!projects.length) {
      return (
        <EmptyProjectsDropdownList>No projects yet</EmptyProjectsDropdownList>
      )
    }

    return (
      <ProjectsDropdownList handleClose={handleClose} projects={projects} />
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }
}

export default withComponents<Props>(ProjectsMenu)
