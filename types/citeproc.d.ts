/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

// https://citeproc-js.readthedocs.io/en/latest/running.html#introduction
// https://github.com/citation-style-language/schema

declare module 'citeproc' {
  import { Data } from 'csl-json'

  interface Citation {
    citationItems: Array<{ id: string }>
    properties?: {
      noteIndex?: number
    }
  }

  type VariableWrapper = (
    params: {
      context: string
      itemData: Data
      variableNames: [string]
    },
    prePunct: string,
    str: string,
    postPunct: string
  ) => string

  interface SystemOptions {
    retrieveLocale: (id: string) => string | Document | Locale
    retrieveItem: (id: string) => Data
    variableWrapper: VariableWrapper
  }

  interface BibliographyMetadata {
    bibliography_errors: string[]
  }

  type Bibliography = string[]

  export class Engine {
    constructor(
      sys: SystemOptions,
      style: string | Style,
      lang?: string,
      forceLang?: boolean
    )

    public rebuildProcessorState(
      citations: Citation[],
      mode?: string,
      uncitedItemIDs?: string[]
    ): Array<[string, number, string]> // id, noteIndex, output

    public makeBibliography(): [BibliographyMetadata, Bibliography]
  }

  export function getLocaleNames(
    style: string | Record<string, unknown>,
    preferredLocale: string
  ): string[]

  type Locale = Record<string, unknown>
  type Style = Record<string, unknown>

  type Node = {
    name: string
    attrs: Record<string, unknown>
    children: Node[]
  }

  export class XmlJSON {
    constructor(dataObj: string | Record<string, unknown>)
    dataObj: Record<string, unknown>
    getNodesByName: (data: unknown, name: string) => Node[]
  }

  export function setupXml(style: string | Record<string, unknown>): XmlJSON
}
