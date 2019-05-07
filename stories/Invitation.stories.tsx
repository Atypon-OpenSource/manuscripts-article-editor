/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InvitationPopper } from '../src/components/collaboration/InvitationPopper'
import ShareProjectButton from '../src/components/collaboration/ShareProjectButton'
import { ShareURIPopper } from '../src/components/collaboration/ShareURIPopper'
import { styled } from '../src/theme/styled-components'
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
