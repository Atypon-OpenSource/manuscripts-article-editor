import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import CSL from 'citeproc'
import { createBrowserHistory } from 'history'
import React from 'react'
import Editor, {
  DeleteComponent,
  GetComponent,
  SaveComponent,
} from '../src/editor/Editor'
import PopperManager from '../src/editor/lib/popper'
import { convertBibliographyItemToData, DEFAULT_BUNDLE } from '../src/lib/csl'
import { Decoder } from '../src/transformer'
import { BIBLIOGRAPHY_ITEM, MANUSCRIPT } from '../src/transformer/object-types'
import {
  AnyComponent,
  AnyContainedComponent,
  Attachments,
  BibliographyItem,
  ComponentAttachment,
  Manuscript,
} from '../src/types/components'
import components from './data/components.json'
import citationLocaleData from './data/locales/en-US.xml'
import { people } from './data/people'
import citationStyleData from './data/styles/apa.xml'

const citationLocales: Map<string, string> = new Map([
  ['en-US', citationLocaleData],
])

const componentMap = new Map()

components.forEach((component: AnyComponent) => {
  componentMap.set(component.id, component)
})

const getComponent: GetComponent = <T extends AnyComponent>(id: string): T => {
  return componentMap.get(id) as T
}

const saveComponent: SaveComponent = async <T extends AnyContainedComponent>(
  component: (T & ComponentAttachment) | Partial<T>
) => {
  componentMap.set(component.id, component)

  return component as T & Attachments
}

const deleteComponent: DeleteComponent = async (id: string) => {
  componentMap.delete(id)
  return id
}

const manuscript: Manuscript = {
  id: 'manuscript-1',
  containerID: 'project-1',
  objectType: MANUSCRIPT,
  title: 'Foo',
  bundle: DEFAULT_BUNDLE,
}

const libraryItem: BibliographyItem = {
  id: 'bibliography-item-1',
  containerID: 'project-1',
  objectType: BIBLIOGRAPHY_ITEM,
  title: 'Foo',
}

const locale = 'en-US'

const decoder = new Decoder(componentMap)
const doc = decoder.createArticleNode()
const popper = new PopperManager()

const citationProcessor = new CSL.Engine(
  {
    retrieveItem: (id: string) =>
      convertBibliographyItemToData(getComponent<BibliographyItem>(id)),
    retrieveLocale: localeName => citationLocales.get(localeName) as string,
    // embedBibliographyEntry: '',
    // wrapCitationEntry: '',
  },
  citationStyleData,
  manuscript.primaryLanguageCode,
  false
)

const history = createBrowserHistory()

storiesOf('Editor', module)
  .add('edit', () => (
    <Editor
      editable={true}
      locale={locale}
      componentMap={componentMap}
      onChange={action('change')}
      getCitationProcessor={() => citationProcessor}
      getLibraryItem={() => libraryItem}
      getManuscript={() => manuscript}
      addManuscript={action('add manuscript')}
      saveManuscript={action('save manuscript')}
      exportManuscript={action('export manuscript')}
      importManuscript={action('import manuscript')}
      getComponent={getComponent}
      getCurrentUser={() => people[0]}
      manuscript={manuscript}
      projectID={'project-1'}
      saveComponent={saveComponent}
      deleteComponent={deleteComponent}
      doc={doc}
      subscribe={action('subscribe')}
      popper={popper}
      history={history}
      handleSectionChange={action('section change')}
    />
  ))
  .add('view', () => (
    <Editor
      editable={false}
      locale={locale}
      componentMap={componentMap}
      onChange={action('change')}
      getCitationProcessor={() => citationProcessor}
      getLibraryItem={() => libraryItem}
      getManuscript={() => manuscript}
      exportManuscript={action('export manuscript')}
      importManuscript={action('import manuscript')}
      getComponent={getComponent}
      saveComponent={saveComponent}
      deleteComponent={deleteComponent}
      getCurrentUser={() => people[0]}
      manuscript={manuscript}
      projectID={'project-1'}
      doc={doc}
      subscribe={action('subscribe')}
      popper={popper}
      history={history}
      handleSectionChange={action('section change')}
    />
  ))
