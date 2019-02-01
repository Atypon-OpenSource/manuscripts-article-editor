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
