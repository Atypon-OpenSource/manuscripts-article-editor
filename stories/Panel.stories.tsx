import { storiesOf } from '@storybook/react'
import React from 'react'
import { Main, Page } from '../src/components/Page'
import Panel from '../src/components/Panel'

storiesOf('Panel', module)
  .add('row', () => (
    <Page>
      <Panel name={'testStart'} minSize={200} direction={'row'} side={'end'}>
        <p style={{ paddingRight: 20 }}>This is a panel at the start</p>
      </Panel>
      <Main>
        <p style={{ paddingLeft: 20 }}>This is the main content.</p>
      </Main>
      <Panel name={'testEnd'} minSize={200} direction={'row'} side={'start'}>
        <p style={{ paddingLeft: 20 }}>This is a panel at the end</p>
      </Panel>
    </Page>
  ))
  .add('combined', () => (
    <Page>
      <Panel name={'testStart'} minSize={200} direction={'row'} side={'end'}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel
            name={'testColumn'}
            minSize={200}
            direction={'column'}
            side={'end'}
          >
            <p>This is a panel</p>
          </Panel>
          <div style={{ paddingTop: 20 }}>This is another section</div>
        </div>
      </Panel>

      <Main>
        <p style={{ paddingLeft: 20 }}>This is the main content.</p>
      </Main>
    </Page>
  ))
