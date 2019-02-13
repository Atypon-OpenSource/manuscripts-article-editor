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

import React from 'react'
import { IconProps } from './types'

const Bookmark = (props: IconProps) => (
  <svg
    viewBox="0 0 60 113.75"
    width={props.size || 45}
    height={props.size || 45}
    {...props}
  >
    <path
      d="M4.007.812h51.986A4.005 4.005 0 0 1 60 4.808v83.968c0 2.206-1.232 2.694-2.742 1.098L32.742 63.971a3.736 3.736 0 0 0-5.484 0L2.742 89.874C1.228 91.474 0 90.976 0 88.776V4.808A4.002 4.002 0 0 1 4.007.812zM30 42.362l-8.98 6.359c-1.661 1.177-2.535.533-1.949-1.443l3.164-10.66-8.713-6.733c-1.613-1.246-1.281-2.29.745-2.334l10.934-.23 3.594-10.519c.666-1.947 1.744-1.949 2.41 0l3.594 10.519 10.934.23c2.025.043 2.36 1.087.745 2.334l-8.713 6.732 3.164 10.661c.585 1.974-.286 2.62-1.95 1.443L30 42.363z"
      fill={props.color || '#000'}
      fillRule="evenodd"
    />
  </svg>
)

export default Bookmark
