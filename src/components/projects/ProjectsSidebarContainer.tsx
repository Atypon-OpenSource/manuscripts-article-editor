import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { DatabaseContext } from '../DatabaseProvider'
import { importManuscript } from './ImportManuscript'
import ProjectsSidebar from './ProjectsSidebar'

class ProjectsSidebarContainer extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <DatabaseContext.Consumer>
        {db => (
          <ProjectsSidebar
            importManuscript={importManuscript(db, this.props.history)}
          />
        )}
      </DatabaseContext.Consumer>
    )
  }
}

export default withRouter(ProjectsSidebarContainer)
