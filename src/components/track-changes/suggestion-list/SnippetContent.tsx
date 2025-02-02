/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */

import purify from 'dompurify'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface ContentProps {
  content: string
}

const SnippetContent: React.FC<ContentProps> = ({ content }) => {
  const contentRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (contentRef.current && content) {
      contentRef.current.innerHTML = purify.sanitize(': ' + content) || ''
    }
  }, [content])

  return <StyledContent ref={contentRef} />
}

export default SnippetContent

const StyledContent = styled.span`
  color: #353535;
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;

  .inspector-list-item::after {
    content: '...';
  }
`
