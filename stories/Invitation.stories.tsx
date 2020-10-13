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
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InvitationPopper } from '../src/components/collaboration/InvitationPopper'
import ShareProjectButton from '../src/components/collaboration/ShareProjectButton'
import { ShareURIPopper } from '../src/components/collaboration/ShareURIPopper'
import { user } from './data/contributors'

const PopperStory = styled.div`
  width: 400px;
`

const project: Partial<Project> = {
  _id: 'project-id',
  owners: ['user-1'],
}

const owner: Partial<UserProfile> = { userID: 'user-1' }

const notOwner: Partial<UserProfile> = { userID: 'user-2' }

storiesOf('Collaboration/Invitation', module)
  .add('Invite', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        tokenActions={{
          delete: action('delete token'),
          update: action('update token'),
        }}
      />
    </PopperStory>
  ))
  .add('Invite: not owner', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={notOwner as UserProfile}
        tokenActions={{
          delete: action('delete token'),
          update: action('update token'),
        }}
      />
    </PopperStory>
  ))
  .add('Share Project Button', () => (
    <ShareProjectButton
      project={project as Project}
      user={user}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Share Link: loading', () => (
    <PopperStory>
      <ShareURIPopper
        dataLoaded={false}
        URI={'http://example.com'}
        selectedRole={'Writer'}
        isCopied={false}
        handleChange={action('change')}
        handleCopy={action('copy')}
        handleSwitching={action('switch')}
        requestURI={action('request URI')}
        project={project as Project}
        user={owner as UserProfile}
        loadingURIError={null}
      />
    </PopperStory>
  ))
  .add('Share Link: loaded', () => (
    <PopperStory>
      <ShareURIPopper
        dataLoaded={true}
        URI={'http://example.com'}
        selectedRole={'Writer'}
        isCopied={false}
        handleChange={action('change')}
        handleCopy={action('copy')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        requestURI={action('request URI')}
        loadingURIError={null}
      />
    </PopperStory>
  ))
  .add('Share Link: copied', () => (
    <PopperStory>
      <ShareURIPopper
        dataLoaded={true}
        URI={'http://example.com'}
        selectedRole={'Writer'}
        isCopied={true}
        handleChange={action('change')}
        handleCopy={action('copy')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        requestURI={action('request URI')}
        loadingURIError={null}
      />
    </PopperStory>
  ))
  .add('Share Link: not owner', () => (
    <PopperStory>
      <ShareURIPopper
        dataLoaded={true}
        URI={'http://example.com'}
        selectedRole={'Writer'}
        isCopied={true}
        handleChange={action('change')}
        handleCopy={action('copy')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={notOwner as UserProfile}
        requestURI={action('request URI')}
        loadingURIError={null}
      />
    </PopperStory>
  ))
  .add('Share Link: error', () => (
    <PopperStory>
      <ShareURIPopper
        dataLoaded={true}
        URI={'http://example.com'}
        selectedRole={'Writer'}
        isCopied={true}
        handleChange={action('change')}
        handleCopy={action('copy')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        requestURI={action('request URI')}
        loadingURIError={new Error('An error occurred.')}
      />
    </PopperStory>
  ))
