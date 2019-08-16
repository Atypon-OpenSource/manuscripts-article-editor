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

import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '../theme/styled-components'

export const FooterBlock = styled('footer')`
  position: absolute;
  bottom: 7px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: #777;
`

export const FooterLinks = styled('nav')`
  display: flex;
  justify-content: center;
`

export const FooterLink = styled(Link)`
  display: inline-flex;
  color: inherit;
  padding: 5px;
  text-decoration: none;
`

export const FooterLinkSeparator = styled.span`
  display: inline-flex;
  padding: 0 5px;
`

export const Footer: React.FunctionComponent<{
  links: Array<{
    url: string
    text: string
  }>
}> = ({ links }) => (
  <FooterBlock>
    <FooterLinks>
      {links.map((link, index) => (
        <span key={link.url}>
          {!!index && <FooterLinkSeparator>|</FooterLinkSeparator>}
          <FooterLink to={link.url}>{link.text}</FooterLink>
        </span>
      ))}
    </FooterLinks>
  </FooterBlock>
)
