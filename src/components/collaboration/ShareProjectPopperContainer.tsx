/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import copyToClipboard from 'clipboard-copy'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import config from '../../config'
import { TokenActions } from '../../data/TokenData'
import { projectInvite, requestProjectInvitationToken } from '../../lib/api'
import { isOwner } from '../../lib/roles'
import { trackEvent } from '../../lib/tracking'
import { CustomPopper } from '../Popper'
import { InvitationValues } from './InvitationForm'
import { InvitationPopper } from './InvitationPopper'
import { ShareURIPopper } from './ShareURIPopper'

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
}

interface Props {
  project: Project
  popperProps: PopperChildrenProps
  user: UserProfile
  tokenActions: TokenActions
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
    loadingURIError: null,
  }

  public componentDidMount() {
    const { project, user } = this.props

    if (isOwner(project, user.userID)) {
      this.requestURI()
    }
  }

  public render() {
    const { popperProps, user, project, tokenActions } = this.props

    const {
      isCopied,
      isInvite,
      isURILoaded,
      shownURI,
      selectedShareURIRole,
      loadingURIError,
    } = this.state

    if (isInvite) {
      return (
        <CustomPopper popperProps={popperProps}>
          <InvitationPopper
            handleInvitationSubmit={this.handleInvitationSubmit}
            handleSwitching={this.handleSwitching}
            project={project}
            user={user}
            tokenActions={tokenActions}
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
          user={user}
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
        if (
          error.response &&
          error.response.status === HttpStatusCodes.UNAUTHORIZED
        ) {
          this.props.tokenActions.delete()
        } else {
          this.setState({ loadingURIError: error })
        }
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

  private handleInvitationSubmit = async (values: InvitationValues) => {
    const { project } = this.props
    const { email, name, role } = values

    await projectInvite(project._id, [{ email, name }], role)
    trackEvent({
      category: 'Invitations',
      action: 'Send',
      label: `projectID=${project._id}`,
    })
  }

  private copyURI = async () => {
    const { isCopied } = this.state
    const { _id } = this.props.project

    if (!isCopied) {
      const { selectedShareURIRole, shareURI } = this.state
      switch (selectedShareURIRole) {
        case 'Writer':
          await copyToClipboard(shareURI.writer)
          trackEvent({
            category: 'Invitations',
            action: 'Share',
            label: `role=Writer&projectID=${_id}`,
          })
          break

        case 'Viewer':
          await copyToClipboard(shareURI.viewer)
          trackEvent({
            category: 'Invitations',
            action: 'Share',
            label: `role=Viewer&projectID=${_id}`,
          })
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
        viewer: await this.fetchInvitationURI(project._id, 'Viewer'),
        writer: await this.fetchInvitationURI(project._id, 'Writer'),
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
}

export default ShareProjectPopperContainer
