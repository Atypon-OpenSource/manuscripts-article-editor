import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { createBrowserHistory } from 'history'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { ApplicationMenu } from '../src/components/projects/ApplicationMenu'
import menus, { MenusProps } from '../src/editor/config/menus'
import { doc } from './data/doc'
import { manuscript } from './data/manuscripts'

const node = document.createElement('div')
const state = EditorState.create({ doc })
const view = new EditorView(node, { state })

const history = createBrowserHistory()

const props: MenusProps = {
  addManuscript: action('add manuscript'),
  importManuscript: action('import manuscript'),
  exportManuscript: action('export manuscript'),
  deleteComponent: action('delete component'),
  manuscript,
  history,
}

storiesOf('Projects/Application Menu', module).add('menu', () => (
  <ApplicationMenu menus={menus(props)} state={state} view={view} />
))
