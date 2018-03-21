import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import * as React from 'react'
import Editor from '../src/editor/Editor'
import { decode } from '../src/transformer'
import { ComponentDocument, ComponentMap } from '../src/types/components'

import * as components from './data/components.json'

const buildComponentMap = (components: ComponentDocument[]): ComponentMap => {
  return components.reduce(
    (output: ComponentMap, component: ComponentDocument) => {
      output.set(component.id, component)
      return output
    },
    new Map()
  )
}

const componentMap = buildComponentMap(components)
const doc: ProsemirrorNode = decode(componentMap)

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
