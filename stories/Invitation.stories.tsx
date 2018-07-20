import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InvitationPopper } from '../src/components/InvitationPopper'
import { ShareURIPopper } from '../src/components/ShareURIPopper'
import ShareProjectButton from '../src/containers/ShareProjectButton'
import { styled } from '../src/theme'

const PopperStory = styled.div`
  width: 300px;
`

storiesOf('Invitation', module)
  .add('Invite', () => (
    <PopperStory>
      <InvitationPopper
        handleInvitationSubmit={action('submit')}
        handleSwitching={action('switch')}
      />
    </PopperStory>
  ))
  .add('Share Project Button', () => (
    <ShareProjectButton projectID={'project-1'} />
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
      />
    </PopperStory>
  ))
