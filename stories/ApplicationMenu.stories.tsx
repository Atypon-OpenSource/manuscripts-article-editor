import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { ApplicationMenu } from '../src/components/ApplicationMenu'
import { menus, options } from '../src/editor/config'
import { MenusProps } from '../src/editor/config/menus'
import manuscripts from './data/manuscripts'

const state = EditorState.create({
  doc: null,
  schema: options.schema,
})

const props: MenusProps = {
  addManuscript: action('add manuscript'),
  importManuscript: action('import manuscript'),
  manuscript: manuscripts[0],
  deleteComponent: action('delete component'),
}

storiesOf('Application Menu', module).add('menu', () => (
  <ApplicationMenu
    menus={menus(props)}
    state={state}
    dispatch={action('dispatch')}
  />
))
