import { storiesOf } from '@storybook/react'
import React from 'react'
import { Avatar } from '../src/components/Avatar'
import image from './assets/melnitz.jpg'

storiesOf('Avatar', module)
  .add('with image', () => <Avatar src={image} size={32} />)
  .add('with image, large', () => <Avatar src={image} size={60} />)
  .add('without image', () => <Avatar size={32} color={'#000'} />)
  .add('without image, color', () => <Avatar size={32} color={'#788faa'} />)
