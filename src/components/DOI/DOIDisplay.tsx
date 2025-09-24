/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import styled from 'styled-components'

import { useStore } from '../../store'

const DOIContainer = styled.div`
  margin: 1rem 64px 0;
  font-size: 12px;
  color: #6e6e6e;
`

const DOILink = styled.a`
  color: #6e6e6e;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const DOIDisplay: React.FC = () => {
  const [storeState] = useStore((s) => ({
    doc: s.doc,
  }))

  const doi = storeState.doc?.attrs?.doi

  if (!doi) {
    return null
  }

  return (
    <DOIContainer className="doi-container block">
      <p>
        DOI:{' '}
        <DOILink
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          https://doi.org/{doi}
        </DOILink>
      </p>
    </DOIContainer>
  )
}

export default DOIDisplay
