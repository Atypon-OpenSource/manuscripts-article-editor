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

import ProjectPlaceholder from '@manuscripts/assets/react/ProjectPlaceholder'
import styled from 'styled-components'

export const ManuscriptPlaceholder = styled(ProjectPlaceholder)`
  > g > path:nth-child(1) {
    fill: #e0eef9;
  }

  > g > g {
    fill: #ffffff;
  }

  // Chemistry
  > g > g:nth-of-type(1) > path:nth-of-type(3) {
    fill: #eaf2f1;
  }

  > g > g:nth-of-type(1) > ellipse {
    fill: #eaf2f1;
  }

  > g > g:nth-of-type(1) > path:last-of-type {
    fill: #ffffff;
  }

  // Astronomy
  > g > g:nth-of-type(2) > ellipse:nth-of-type(3) {
    fill: #eaf2f1;
  }

  > g > g:nth-of-type(2) > ellipse:nth-of-type(4) {
    fill: #ffffff;
  }

  > g > g:nth-of-type(2) > path:nth-of-type(3) {
    fill: #ffffff;
  }

  > g > g:nth-of-type(2) > path:nth-of-type(2) {
    fill: #eaf2f1;
  }

  // Medicine
  > g > g:nth-of-type(3) > path:last-of-type {
    fill: #e0eef9;
  }

  > g > g:nth-of-type(3) > path:nth-of-type(3) {
    fill: #ffffff;
  }

  > g > g:nth-of-type(3) > path:nth-of-type(4) {
    fill: #eaf2f1;
  }

  > g > g:nth-of-type(3) > path:nth-of-type(6) {
    transform: translate(15px, 11px) rotate(90deg);
  }

  // Notepad
  > g > g:nth-of-type(4) > path:last-of-type {
    fill: #eaf2f1;
  }

  // Misc
  > g > g:nth-of-type(5) > ellipse {
    stroke: #979797;
    opacity: 1;
  }

  > g > g:nth-of-type(5) > path {
    fill: #979797;
    opacity: 1;
  }
`
