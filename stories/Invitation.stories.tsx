import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InvitationPopper } from '../src/components/collaboration/InvitationPopper'
import ShareProjectButton from '../src/components/collaboration/ShareProjectButton'
import { ShareURIPopper } from '../src/components/collaboration/ShareURIPopper'
import { styled } from '../src/theme'
import { Project, UserProfile } from '../src/types/components'

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
        invitationError={null}
        invitationSent={false}
        dismissSentAlert={action('dismiss success alert')}
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
        invitationError={null}
        invitationSent={false}
        dismissSentAlert={action('dismiss success alert')}
      />
    </PopperStory>
  ))
  .add('Invite: error', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        invitationError={new Error('An error occurred.')}
        invitationSent={false}
        dismissSentAlert={action('dismiss success alert')}
      />
    </PopperStory>
  ))
  .add('Invite: invitation sent successfully', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project as Project}
        user={owner as UserProfile}
        invitationError={null}
        invitationSent={true}
        dismissSentAlert={action('dismiss success alert')}
      />
    </PopperStory>
  ))
  .add('Share Project Button', () => (
    <ShareProjectButton project={project as Project} />
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
