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

import SectionIcon from '@manuscripts/assets/react/OutlineIconSection'
import { TreeNode } from '@manuscripts/sync-client'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import styled from 'styled-components'

const SectionList = styled.ul`
  list-style-type: none;
  margin-top: 0;
  padding-left: 1rem;
`

const SectionTreeTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.2em;
  }
`

const SectionListItem = styled.li<{
  depth: number
}>`
  font-size: ${(props) => 1.2 - props.depth * 0.1}rem;
`

interface Props {
  data: TreeNode
  depth?: number
}

const SectionTree: React.FC<Props> = ({ data, depth = 0 }) => {
  if (depth > 7) {
    return null
  }

  const childrenInOrder = Object.values(data.children).sort(
    (a, b) => (a.priority || 0) - (b.priority || 0)
  )

  return (
    <React.Fragment>
      {!data.root && (
        <SectionTreeTitle>
          <SectionIcon />
          <Title value={data.title} />
        </SectionTreeTitle>
      )}
      {childrenInOrder.length ? (
        <SectionList>
          {childrenInOrder.map((child) => (
            <SectionListItem key={child._id} depth={depth}>
              <SectionTree data={child} depth={depth + 1} />
            </SectionListItem>
          ))}
        </SectionList>
      ) : null}
    </React.Fragment>
  )
}

export default SectionTree
