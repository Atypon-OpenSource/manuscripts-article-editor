import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { ApplicationMenu } from '../src/components/ApplicationMenu'
import { menus, options } from '../src/editor/config'

const state = EditorState.create({
  doc: null,
  schema: options.schema,
})

storiesOf('ApplicationMenu', module).add('menu', () => (
  <ApplicationMenu menus={menus} state={state} dispatch={action('dispatch')} />
))
