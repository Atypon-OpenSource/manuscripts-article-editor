import copyToClipboard from 'clipboard-copy'
import { FormikActions } from 'formik'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import {
  InvitationErrors,
  InvitationValues,
} from '../components/InvitationForm'
import { InvitationPopper } from '../components/InvitationPopper'
import { CustomPopper } from '../components/Popper'
import { ShareURIPopper } from '../components/ShareURIPopper'
import config from '../config'
import { projectInvite, requestProjectInvitationToken } from '../lib/api'
import { isOwner } from '../lib/roles'
import { UserProps, withUser } from '../store/UserProvider'
import { Project, UserProfile } from '../types/components'

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
  loadingURIError: Error | null
  invitationError: Error | null
  invitationSent: boolean
}

interface Props {
  project: Project
  popperProps: PopperChildrenProps
}

class ShareProjectPopperContainer extends React.Component<
  Props & UserProps,
  State
> {
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
    loadingURIError: null,
    invitationError: null,
    invitationSent: false,
  }

  public componentDidMount() {
    const { project, user } = this.props
    const isProjectOwner = isOwner(project, (user.data as UserProfile).userID)

    if (isProjectOwner) {
      this.requestURI()
    }
  }

  public render() {
    const { popperProps, user, project } = this.props

    const {
      isCopied,
      isInvite,
      isURILoaded,
      shownURI,
      selectedShareURIRole,
      loadingURIError,
      invitationError,
      invitationSent,
    } = this.state

    if (isInvite) {
      return (
        <CustomPopper popperProps={popperProps}>
          <InvitationPopper
            handleInvitationSubmit={this.handleInvitationSubmit}
            handleSwitching={this.handleSwitching}
            project={project}
            user={user.data as UserProfile}
            dismissSentAlert={this.dismissSentAlert}
            invitationError={invitationError}
            invitationSent={invitationSent}
          />
        </CustomPopper>
      )
    }

    return (
      <CustomPopper popperProps={popperProps}>
        <ShareURIPopper
          dataLoaded={isURILoaded}
          URI={shownURI}
          selectedRole={selectedShareURIRole}
          isCopied={isCopied}
          user={user.data as UserProfile}
          project={project}
          loadingURIError={loadingURIError}
          requestURI={this.requestURI}
          handleChange={this.handleShareURIRoleChange}
          handleCopy={this.copyURI}
          handleSwitching={this.handleSwitching}
        />
      </CustomPopper>
    )
  }

  private requestURI = () => {
    this.shareProjectURI()
      .then(() => {
        this.setState({
          isURILoaded: true,
          shownURI: this.state.shareURI.writer,
          loadingURIError: null,
        })
      })
      .catch(error => {
        this.setState({ loadingURIError: error })
      })
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

  private handleInvitationSubmit = async (
    values: InvitationValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<InvitationValues | InvitationErrors>
  ) => {
    const { project } = this.props
    const { email, name, role } = values

    try {
      await projectInvite(project.id, [{ email, name }], role)
      this.setState({ invitationSent: true })
    } catch (error) {
      this.setState({ invitationError: error })
    } finally {
      setSubmitting(false)
    }
  }

  private copyURI = async () => {
    const { isCopied } = this.state

    if (!isCopied) {
      const { selectedShareURIRole, shareURI } = this.state
      switch (selectedShareURIRole) {
        case 'Writer':
          await copyToClipboard(shareURI.writer)
          break
        case 'Viewer':
          await copyToClipboard(shareURI.viewer)
          break
      }
    }

    this.setState({ isCopied: !isCopied })
  }

  private shareProjectURI: ShareProjectUri = async () => {
    const { project } = this.props

    this.setState({
      isShareURIPopperOpen: true,
      shareURI: {
        viewer: await this.fetchInvitationURI(project.id, 'Viewer'),
        writer: await this.fetchInvitationURI(project.id, 'Writer'),
      },
    })
  }

  private fetchInvitationURI = async (projectID: string, role: string) => {
    const {
      data: { token },
    } = await requestProjectInvitationToken(projectID, role)

    return `${config.url}/projects/${encodeURIComponent(
      projectID
    )}/invitation/${encodeURIComponent(token)}/`
  }

  private dismissSentAlert = () => this.setState({ invitationSent: false })
}

export default withUser<Props>(ShareProjectPopperContainer)
