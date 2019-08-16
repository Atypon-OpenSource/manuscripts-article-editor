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

import SadAnimal1 from '@manuscripts/assets/png/SadAnimal1.png'
import SadAnimal2 from '@manuscripts/assets/png/SadAnimal2.png'
import SadAnimal3 from '@manuscripts/assets/png/SadAnimal3.png'
import SadAnimal4 from '@manuscripts/assets/png/SadAnimal4.png'
import SadAnimal5 from '@manuscripts/assets/png/SadAnimal5.png'
import { sample } from 'lodash-es'
import React from 'react'
import { styled } from '../../theme/styled-components'

const images: { [key: string]: string } = {
  '😿': SadAnimal1,
  '🐼': SadAnimal2,
  '🐹': SadAnimal3,
  '🙀': SadAnimal4,
  '🐶': SadAnimal5,
}

const key = sample(Object.keys(images)) as string

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SadAnimal: React.FunctionComponent = () => (
  <Container>
    <img src={images[key]} alt={key} height={154} />
  </Container>
)

export default SadAnimal
