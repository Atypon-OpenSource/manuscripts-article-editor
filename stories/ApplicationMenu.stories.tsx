import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { createBrowserHistory } from 'history'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import { ApplicationMenu } from '../src/components/ApplicationMenu'
import { options } from '../src/editor/config'
import menus, { MenusProps } from '../src/editor/config/menus'
import manuscripts from './data/manuscripts'

const state = EditorState.create({
  doc: null,
  schema: options.schema,
})

const history = createBrowserHistory()

const props: MenusProps = {
  addManuscript: action('add manuscript'),
  importManuscript: action('import manuscript'),
  exportManuscript: action('export manuscript'),
  manuscript: manuscripts[0],
  deleteComponent: action('delete component'),
  history,
}

storiesOf('Application Menu', module).add('menu', () => (
  <ApplicationMenu
    menus={menus(props)}
    state={state}
    dispatch={action('dispatch')}
  />
))
