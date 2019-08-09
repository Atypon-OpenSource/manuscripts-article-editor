/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import aphorisms from '@manuscripts/data/dist/shared/aphorisms.json'
import { sample } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import { styled } from '../theme/styled-components'
import { AphorismView } from './Aphorism'
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
  const [aphorism] = useState(sample(aphorisms))
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
