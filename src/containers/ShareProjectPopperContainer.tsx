import copyToClipboard from 'clipboard-copy'
import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import {
  InvitationErrors,
  InvitationValues,
} from '../components/InvitationForm'
import { InvitationPopper } from '../components/InvitationPopper'
import { ShareProjectPopper } from '../components/ShareProjectPopper'
import { ShareURIPopper } from '../components/ShareURIPopper'
import { projectInvite, requestProjectInvitationToken } from '../lib/api'

type ShareProjectUri = () => Promise<void>

interface ShareURI {
  viewer: string
  writer: string
}

interface State {
  shareURI: ShareURI
  isShareURIPopperOpen: boolean
  isURILoaded: boolean
  selectedShareURIRole: string
  isCopied: boolean
  shownURI: string
  isInvite: boolean
  error: boolean
}

interface Props {
  projectID: string
  popperProps: PopperChildrenProps
}

class ShareProjectPopperContainer extends React.Component<Props, State> {
  public state: State = {
    shareURI: {
      viewer: '',
      writer: '',
    },
    isShareURIPopperOpen: true,
    isURILoaded: false,
    isCopied: false,
    selectedShareURIRole: 'Writer',
    shownURI: '',
    isInvite: false,
    error: false,
  }

  public componentDidMount() {
    this.shareProjectURI()
      .then(() => {
        this.setState({
          isURILoaded: true,
          shownURI: this.state.shareURI.writer,
        })
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }

  public render() {
    const { popperProps } = this.props

    const {
      isCopied,
      isInvite,
      isURILoaded,
      shownURI,
      selectedShareURIRole,
    } = this.state

    return (
      <ShareProjectPopper popperProps={popperProps}>
        {isInvite ? (
          <InvitationPopper
            handleInvitationSubmit={this.handleInvitationSubmit}
            handleSwitching={this.handleSwitching}
          />
        ) : (
          <ShareURIPopper
            dataLoaded={isURILoaded}
            URI={shownURI}
            selectedRole={selectedShareURIRole}
            isCopied={isCopied}
            handleChange={this.handleShareURIRoleChange}
            handleCopy={this.copyURI}
            handleSwitching={this.handleSwitching}
          />
        )}
      </ShareProjectPopper>
    )
  }

  private handleSwitching = (isInvite: boolean) => {
    this.setState({ isInvite })
  }

  private handleShareURIRoleChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { shareURI } = this.state
    switch (event.currentTarget.value) {
      case 'Writer':
        this.setState({
          selectedShareURIRole: event.currentTarget.value,
          shownURI: shareURI.writer,
        })
        break
      case 'Viewer':
        this.setState({
          selectedShareURIRole: event.currentTarget.value,
          shownURI: shareURI.viewer,
        })
        break
    }
  }

  private handleInvitationSubmit = (
    values: InvitationValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<InvitationValues | InvitationErrors>
  ) => {
    projectInvite(
      this.props.projectID,
      [values.email],
      values.role,
      'message'
    ).then(
      () => {
        setSubmitting(false)
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<InvitationErrors> = {}

        if (error.response) {
          errors.submit = error.response
        }

        setErrors(errors)
      }
    )
  }

  private copyURI = async () => {
    const { selectedShareURIRole, shareURI } = this.state
    switch (selectedShareURIRole) {
      case 'Writer':
        await copyToClipboard(shareURI.writer)
        break
      case 'Viewer':
        await copyToClipboard(shareURI.viewer)
        break
    }

    this.setState({ isCopied: true })
  }

  private shareProjectURI: ShareProjectUri = async () => {
    const { projectID } = this.props
    const [viewerToken, writerToken] = await Promise.all([
      requestProjectInvitationToken(projectID, 'Viewer'),
      requestProjectInvitationToken(projectID, 'Writer'),
    ])

    this.setState({
      isShareURIPopperOpen: true,
      shareURI: {
        viewer: this.invitationURI(projectID, viewerToken),
        writer: this.invitationURI(projectID, writerToken),
      },
    })
  }

  private invitationURI = (projectID: string, invitationToken: string) => {
    return `${
      process.env.BASE_URL
    }/projects/${projectID}/invitation/${invitationToken}/`
  }
}

export default ShareProjectPopperContainer
