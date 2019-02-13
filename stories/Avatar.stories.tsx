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

import { storiesOf } from '@storybook/react'
import React from 'react'
import { Avatar } from '../src/components/Avatar'
import image from './assets/melnitz.jpg'

storiesOf('Avatar', module)
  .add('with image', () => <Avatar src={image} size={32} />)
  .add('with image, large', () => <Avatar src={image} size={60} />)
  .add('without image', () => <Avatar size={32} color={'#000'} />)
  .add('without image, large', () => <Avatar size={60} color={'#000'} />)
  .add('without image, color', () => <Avatar size={32} color={'#788faa'} />)
