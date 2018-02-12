import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import ManuscriptsPage from '../components/ManuscriptsPage'
import Spinner from '../icons/spinner'
import {
  addManuscript,
  loadManuscripts,
  removeManuscript,
  updateManuscript,
} from '../store/manuscripts'
import {
  ManuscriptsDispatchProps,
  ManuscriptsState,
  ManuscriptsStateProps,
} from '../store/manuscripts/types'
import { ApplicationState } from '../store/types'
import { ManuscriptInterface } from '../types/manuscript'

interface ManuscriptsPageContainerState {
  manuscripts: ManuscriptInterface[]
}

class ManuscriptsPageContainer extends React.Component<
  ManuscriptsStateProps & ManuscriptsDispatchProps
> {
  public state: ManuscriptsPageContainerState = {
    manuscripts: [],
  }

  public componentDidMount() {
    const { manuscripts } = this.props

    if (!manuscripts.loaded && !manuscripts.loading) {
      return this.props.dispatch(loadManuscripts)
    }

    this.setState({
      manuscripts: Object.values(manuscripts.items),
    })
  }

  public componentWillUpdate() {
    const { manuscripts } = this.props

    if (!manuscripts.loaded) {
      return null
    }

    this.setState({
      manuscripts: Object.values(manuscripts.items),
    })
  }

  public render() {
    const {
      manuscripts,
      addManuscript,
      updateManuscript,
      removeManuscript,
    } = this.props
    if (!manuscripts.loaded) {
      return <Spinner />
    }

    return (
      <ManuscriptsPage
        manuscripts={this.state.manuscripts}
        addManuscript={addManuscript}
        updateManuscript={updateManuscript}
        removeManuscript={removeManuscript}
      />
    )
  }
}

export default connect<ManuscriptsStateProps, ManuscriptsDispatchProps>(
  (state: ApplicationState) => ({
    manuscripts: state.manuscripts,
  }),
  (dispatch: Dispatch<ManuscriptsState>) => ({
    dispatch,
    ...bindActionCreators(
      {
        addManuscript,
        updateManuscript,
        removeManuscript,
      },
      dispatch
    ),
  })
)(ManuscriptsPageContainer)
