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
import { Build } from '@manuscripts/manuscript-transform'
import { CommentAnnotation } from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'

import {
  InspectorContainer,
  InspectorTab,
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
} from '../Inspector'

export const Inspector: React.FC<{
  tabs: string[]
  commentTarget?: Build<CommentAnnotation>
}> = ({ tabs, commentTarget, children }) => {
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (commentTarget) {
      setTabIndex(tabs.findIndex((tab) => tab === 'Comments'))
    }
    //   else if (submission) {
    //     setTabIndex(tabs.findIndex((tab) => tab === 'Submissions'))
    //   }
  }, [tabs, commentTarget])

  const childrenAsArray = React.Children.toArray(children)

  return (
    <InspectorContainer>
      <InspectorTabs index={tabIndex} onChange={setTabIndex}>
        <InspectorTabList>
          {tabs.map((label, i) => (
            <InspectorTab key={i}>{label}</InspectorTab>
          ))}
        </InspectorTabList>
        <PaddedInspectorTabPanels>
          {tabs.map((label, i) => {
            if (i !== tabIndex) {
              return <InspectorTabPanel key={label} />
            }

            return (
              <InspectorTabPanel key={label}>
                {childrenAsArray[i]}
              </InspectorTabPanel>
            )
          })}
        </PaddedInspectorTabPanels>
      </InspectorTabs>
    </InspectorContainer>
  )
}
