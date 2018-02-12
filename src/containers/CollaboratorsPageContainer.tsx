import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import CollaboratorsPage from '../components/CollaboratorsPage'
import Spinner from '../icons/spinner'
import {
  addCollaborator,
  loadCollaborators,
  removeCollaborator,
  updateCollaborator,
} from '../store/collaborators'
import {
  CollaboratorsDispatchProps,
  CollaboratorsState,
  CollaboratorsStateProps,
} from '../store/collaborators/types'
import { ApplicationState } from '../store/types'
import { Person } from '../types/person'

interface CollaboratorsPageContainerState {
  collaborators: Person[]
}

class CollaboratorsPageContainer extends React.Component<
  CollaboratorsStateProps & CollaboratorsDispatchProps
> {
  public state: CollaboratorsPageContainerState = {
    collaborators: [],
  }

  public componentDidMount() {
    const { collaborators } = this.props

    if (!collaborators.loaded && !collaborators.loading) {
      return this.props.dispatch(loadCollaborators)
    }

    this.setState({
      collaborators: Object.values(collaborators.items),
    })
  }

  public componentWillUpdate() {
    const { collaborators } = this.props

    if (!collaborators.loaded) {
      return null
    }

    this.setState({
      collaborators: Object.values(collaborators.items),
    })
  }

  public render() {
    const {
      collaborators,
      addCollaborator,
      updateCollaborator,
      removeCollaborator,
    } = this.props
    if (!collaborators.loaded) {
      return <Spinner />
    }

    return (
      <CollaboratorsPage
        collaborators={this.state.collaborators}
        addCollaborator={addCollaborator}
        updateCollaborator={updateCollaborator}
        removeCollaborator={removeCollaborator}
      />
    )
  }
}

export default connect<CollaboratorsStateProps, CollaboratorsDispatchProps>(
  (state: ApplicationState) => ({
    collaborators: state.collaborators,
  }),
  (dispatch: Dispatch<CollaboratorsState>) => ({
    dispatch,
    ...bindActionCreators(
      {
        addCollaborator,
        updateCollaborator,
        removeCollaborator,
      },
      dispatch
    ),
  })
)(CollaboratorsPageContainer)
