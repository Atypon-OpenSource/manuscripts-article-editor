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
import AlertMessage, { AlertMessageType } from '../src/components/AlertMessage'

storiesOf('AlertMessage', module)
  .add('success', () => (
    <AlertMessage type={AlertMessageType.success}>
      Example of overall success message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('error', () => (
    <AlertMessage type={AlertMessageType.error}>
      Example of overall error message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('info', () => (
    <AlertMessage type={AlertMessageType.info}>
      Example of overall info message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('warning', () => (
    <AlertMessage type={AlertMessageType.warning}>
      Example of overall warning message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('without close button', () => (
    <AlertMessage type={AlertMessageType.warning} hideCloseButton={true}>
      Example of overall warning message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('with dismiss text', () => (
    <AlertMessage
      type={AlertMessageType.warning}
      dismissButton={{ text: 'Dismiss' }}
    >
      Example of overall warning message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
