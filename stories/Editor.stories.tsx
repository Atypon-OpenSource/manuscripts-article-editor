import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import CSL from 'citeproc'
import React from 'react'
import Editor, {
  DeleteComponent,
  GetComponent,
  SaveComponent,
} from '../src/editor/Editor'
import PopperManager from '../src/editor/lib/popper'
import { convertBibliographyItemToData } from '../src/lib/csl'
import { Decoder } from '../src/transformer'
import { AnyComponent, BibliographyItem } from '../src/types/components'
import components from './data/components.json'
import citationLocaleData from './data/locales/en-US.xml'
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

const saveComponent: SaveComponent = async (component: AnyComponent) => {
  componentMap.set(component.id, component)
}

const deleteComponent: DeleteComponent = async (id: string) => {
  componentMap.delete(id)
  return id
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
  locale,
  false
)

storiesOf('Editor', module)
  .add('edit', () => (
    <Editor
      autoFocus={true}
      locale={locale}
      componentMap={componentMap}
      editable={true}
      onChange={action('change')}
      citationProcessor={citationProcessor}
      getComponent={getComponent}
      saveComponent={saveComponent}
      deleteComponent={deleteComponent}
      doc={doc}
      subscribe={action('subscribe')}
      popper={popper}
    />
  ))
  .add('view', () => (
    <Editor
      editable={false}
      componentMap={componentMap}
      locale={locale}
      doc={doc}
      popper={popper}
      citationProcessor={citationProcessor}
      getComponent={getComponent}
    />
  ))
