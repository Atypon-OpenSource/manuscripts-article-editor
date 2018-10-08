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
    // tslint:disable-next-line:no-object-literal-type-assertion
    <ShareProjectButton project={{ id: 'project-id' } as Project} />
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
        // tslint:disable-next-line:no-object-literal-type-assertion
        project={{ owners: ['user-1'] } as Project}
        // tslint:disable-next-line:no-object-literal-type-assertion
        user={{ userID: 'user-1' } as UserProfile}
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
        // tslint:disable-next-line:no-object-literal-type-assertion
        project={{ owners: ['user-1'] } as Project}
        // tslint:disable-next-line:no-object-literal-type-assertion
        user={{ userID: 'user-1' } as UserProfile}
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
        // tslint:disable-next-line:no-object-literal-type-assertion
        project={{ owners: ['user-1'] } as Project}
        // tslint:disable-next-line:no-object-literal-type-assertion
        user={{ userID: 'user-1' } as UserProfile}
      />
    </PopperStory>
  ))
