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

//import { titles } from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'

import config from '../../config'
import { useStore } from '../../store'
import { InspectorSection, Subheading } from '../InspectorSection'
import { DOIInput } from './DOIInput'
//import { RunningTitleField } from './RunningTitleField'

export const ManuscriptInspector: React.FC<{
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
  canWrite?: boolean
}> = ({ state, dispatch }) => {
  const [{ manuscript, saveManuscript }] = useStore((store) => ({
    manuscript: store.manuscript,
    doc: store.doc,
    modelMap: store.trackModelMap,
    saveManuscript: store.saveManuscript,
    saveModel: store.saveTrackModel,
    deleteModel: store.deleteTrackModel,
    user: store.user,
    project: store.project,
  }))
  return (
    <InspectorSection title={'Manuscript'}>
      {config.features.DOI && (
        <>
          <Subheading>DOI</Subheading>

          <DOIInput
            value={manuscript.DOI}
            handleChange={async (DOI) => {
              await saveManuscript({
                DOI,
              })
            }}
          />
        </>
      )}

      {config.features.runningTitle && (
        <>
          <Subheading>Running title</Subheading>

          {/* <RunningTitleField
            placeholder={'Running title'}
            value={doc.content.firstChild?.textContent || ''}
            handleChange={async (runningTitle) => {
              await saveManuscript({
                runningTitle,
              })
            }}
          /> */}
        </>
      )}
    </InspectorSection>
  )
}
