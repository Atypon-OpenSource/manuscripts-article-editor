import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import * as React from 'react'
import Editor from '../src/editor/Editor'
import { decode } from '../src/transformer'

import * as components from './data/components.json'

const doc: ProsemirrorNode = decode(components)

storiesOf('Editor', module)
  .add('edit', () => (
    <Editor
      autoFocus={true}
      doc={doc}
      editable={true}
      onChange={action('change')}
    />
  ))
  .add('view', () => <Editor doc={doc} editable={false} />)
