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

// https://developers.google.com/identity/branding-guidelines

// tslint:disable:max-line-length

const Google = (props: IconProps) => (
  <svg width={props.size} height={props.size} {...props}>
    <defs>
      <filter
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        id="google-a"
      >
        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation={0.5}
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feOffset in="SourceAlpha" result="shadowOffsetOuter2" />
        <feGaussianBlur
          stdDeviation={0.5}
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0"
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <rect id="google-b" width={40} height={40} rx={2} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(3 3)" filter="url(#google-a)">
        <use fill="#FFF" xlinkHref="#google-b" />
        <use xlinkHref="#google-b" />
        <use xlinkHref="#google-b" />
        <use xlinkHref="#google-b" />
      </g>
      <path
        d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32z"
        fill="#34A853"
      />
      <path
        d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71z"
        fill="#EA4335"
      />
      <path d="M14 14h18v18H14V14z" />
    </g>
  </svg>
)

export default Google
