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

import {
  buildAttribution,
  FigureNode,
  ManuscriptEditorView,
} from '@manuscripts/manuscript-transform'
import { Attribution, Figure } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback } from 'react'
import { setNodeAttrs } from '../../lib/node-attrs'
import { InspectorSection, Subheading } from '../InspectorSection'
import { LicenseInput } from '../projects/LicenseInput'
import { URLInput } from '../projects/URLInput'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'

const isImageUrl = (url: string) => url.endsWith('.jpg') || url.endsWith('.png')

export const FigureInspector: React.FC<{
  figure: Figure
  node: FigureNode
  saveFigure: (figure: Figure) => void
  view: ManuscriptEditorView
}> = ({ figure, node, saveFigure, view }) => {
  const attribution = figure.attribution || buildAttribution()

  const handleLicenseChange = useCallback(
    (licenseID: string) => {
      const data = {
        ...attribution,
        licenseID,
      }

      saveFigure({
        ...figure,
        attribution: data as Attribution,
      })
    },
    [saveFigure, figure, attribution]
  )

  return (
    <InspectorSection title={'Figure'}>
      <InspectorField>
        <InspectorLabel>Embed URL</InspectorLabel>

        <URLInput
          value={node.attrs.embedURL}
          handleChange={embedURL => {
            if (embedURL && isImageUrl(embedURL)) {
              // TODO: save the image attachment
              setNodeAttrs(view, figure._id, {
                src: embedURL,
                embedURL: undefined,
              })
            } else {
              setNodeAttrs(view, figure._id, { embedURL })
            }
          }}
        />
      </InspectorField>

      <Subheading>Attribution</Subheading>

      <InspectorField>
        <InspectorLabel>License</InspectorLabel>

        <LicenseInput
          value={attribution.licenseID}
          handleChange={handleLicenseChange}
        />
      </InspectorField>

      {/*<InspectorField>
        <InspectorLabel>Source URL</InspectorLabel>

        <URLInput
          value={attribution.sourceURL}
          handleChange={sourceURL => {
            saveFigure({
              ...figure,
              attribution: {
                ...attribution,
                sourceURL,
              },
            })
          }}
        />
      </InspectorField>

      <InspectorField>
        <InspectorLabel>Source Title</InspectorLabel>

        <URLInput
          value={attribution.sourceURL}
          handleChange={sourceURL => {
            saveFigure({
              ...figure,
              attribution: {
                ...attribution,
                sourceURL,
              },
            })
          }}
        />
      </InspectorField>*/}
    </InspectorSection>
  )
}
