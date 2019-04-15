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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import { PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'

const CreateButton = styled(PrimaryButton)`
  padding: 0 4px;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`

const Heading = styled.div`
  margin-bottom: 2px;
  display: flex;
`

const Title = styled.div`
  color: ${props => props.theme.colors.global.text.primary};
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 0.5ch;
  overflow-x: hidden;
`

const BundleTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const Actions = styled.div`
  padding: 4px 8px;
  flex-shrink: 0;
  visibility: hidden;
`

const Container = styled.div`
  padding: 4px 12px;
  margin: 0 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  position: relative;
  background-color: ${props =>
    props.theme.colors.templateSelector.item.container.background.default};

  &:hover {
    background-color: ${props =>
      props.theme.colors.templateSelector.item.container.background.hovered};

    ${Actions} {
      visibility: visible;
    }
  }
`

interface Props {
  item: Bundle
  selectBundle: (item: Bundle) => void
}

export const CitationStyleListItem: React.FunctionComponent<Props> = ({
  item,
  selectBundle,
}) => (
  <Container
    onClick={event => {
      event.stopPropagation()
      selectBundle(item)
    }}
  >
    <Heading>
      <Title>
        <BundleTitle>{item.csl!.title}</BundleTitle>
      </Title>

      <Actions>
        <CreateButton>Select</CreateButton>
      </Actions>
    </Heading>
  </Container>
)
