import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InvitationPopper } from '../src/components/InvitationPopper'
import ShareProjectButton from '../src/components/ShareProjectButton'
import { ShareURIPopper } from '../src/components/ShareURIPopper'
import { styled } from '../src/theme'
import { Project, UserProfile } from '../src/types/components'

const PopperStory = styled.div`
  width: 400px;
`

// tslint:disable-next-line:no-object-literal-type-assertion
const project = { id: 'project-id', owners: ['user-1'] } as Project

// tslint:disable-next-line:no-object-literal-type-assertion
const owner = { userID: 'user-1' } as UserProfile

// tslint:disable-next-line:no-object-literal-type-assertion
const notOwner = { userID: 'user-2' } as UserProfile

storiesOf('Invitation', module)
  .add('Invite', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project}
        user={owner}
        invitationError={null}
      />
    </PopperStory>
  ))
  .add('Invite: not owner', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project}
        user={notOwner}
        invitationError={null}
      />
    </PopperStory>
  ))
  .add('Invite: error', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
        project={project}
        user={owner}
        invitationError={new Error('An error occurred.')}
      />
    </PopperStory>
  ))
  .add('Share Project Button', () => <ShareProjectButton project={project} />)
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
        project={project}
        user={owner}
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
        project={project}
        user={owner}
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
        project={project}
        user={owner}
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
        project={project}
        user={notOwner}
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
        project={project}
        user={owner}
        requestURI={action('request URI')}
        loadingURIError={new Error('An error occurred.')}
      />
    </PopperStory>
  ))
