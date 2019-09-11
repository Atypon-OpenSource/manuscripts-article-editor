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

import aphorisms from '@manuscripts/data/dist/shared/aphorisms.json'
import { sample } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import { styled } from '../theme/styled-components'
import { Aphorism, AphorismView } from './Aphorism'
import {
  IndicatorKind,
  IndicatorSize,
  ProgressIndicator,
} from './ProgressIndicator'

const PlaceholderContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ManuscriptPlaceholder: React.FC = () => (
  <PlaceholderContainer>
    <ProgressIndicator
      isDeterminate={false}
      size={IndicatorSize.Large}
      symbols={IndicatorKind.Project}
    />
  </PlaceholderContainer>
)

export const ProjectPlaceholder: React.FC = () => (
  <PlaceholderContainer>
    <ProgressIndicator
      isDeterminate={false}
      size={IndicatorSize.Large}
      symbols={IndicatorKind.Project}
    />
  </PlaceholderContainer>
)

const FixedPlaceholderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  opacity: 1;
  z-index: 10;
`

const AnimatedFixedPlaceholderContainer = animated(FixedPlaceholderContainer)

export const ProjectAphorismPlaceholder: React.FC<{
  duration: number
}> = ({ duration }) => {
  const [aphorism] = useState(sample(aphorisms) as Aphorism)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setLoading(false)
    }, duration)

    return () => {
      window.clearTimeout(handle)
    }
  })

  const transitions = useTransition(loading, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <AnimatedFixedPlaceholderContainer key={key} style={props}>
              <ProgressIndicator
                isDeterminate={false}
                size={IndicatorSize.Large}
                symbols={IndicatorKind.Project}
              />
              <AphorismView aphorism={aphorism} />
            </AnimatedFixedPlaceholderContainer>
          )
      )}
    </>
  )
}
