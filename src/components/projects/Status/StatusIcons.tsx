/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
import { StatusLabel } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

// TODO Delete the icons when they are ready in assets repository
export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 0 512 512"
    width="16px"
  >
    <path d="M256 0C114.836 0 0 114.836 0 256s114.836 256 256 256 256-114.836 256-256S397.164 0 256 0zm94.273 320.105c8.34 8.344 8.34 21.825 0 30.168a21.275 21.275 0 01-15.086 6.25c-5.46 0-10.921-2.09-15.082-6.25L256 286.164l-64.105 64.11a21.273 21.273 0 01-15.083 6.25 21.275 21.275 0 01-15.085-6.25c-8.34-8.344-8.34-21.825 0-30.169L225.836 256l-64.11-64.105c-8.34-8.344-8.34-21.825 0-30.168 8.344-8.34 21.825-8.34 30.169 0L256 225.836l64.105-64.11c8.344-8.34 21.825-8.34 30.168 0 8.34 8.344 8.34 21.825 0 30.169L286.164 256zm0 0" />
  </svg>
)

export const DoingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="iconDoing">
    <g fill="none" fillRule="evenodd">
      <circle
        cx="8"
        cy="8"
        r="4"
        className="pie"
        stroke="#353535"
        strokeWidth="8"
        strokeDasharray="12.5"
        transform="rotate(-90) translate(-15)"
      />
      <circle stroke="#353535" cx="8" cy="8" r="7.5" />
    </g>
  </svg>
)

export const DoneIcon = () => (
  <svg
    className="iconDone"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <circle fill="#353535" cx="8" cy="8" r="8" />
      <path
        d="M4.97 7.54a1.026 1.026 0 00-1.43.032l.174-.176a.972.972 0 00.018 1.396l2.694 2.536 5.807-5.5a.93.93 0 00-.007-1.374l.18.17a1.089 1.089 0 00-1.467-.003l-4.556 4.25L4.97 7.54z"
        fill="#FFF"
      />
    </g>
  </svg>
)

export const ToDoIcon = () => (
  <svg
    className="iconToDo"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#353535" fill="none" fillRule="evenodd">
      <circle cx="8" cy="8" r="7.5" />
      <circle cx="8" cy="8" r="3.056" />
    </g>
  </svg>
)

export const DndIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <defs>
      <mask
        id="b"
        maskContentUnits="userSpaceOnUse"
        maskUnits="objectBoundingBox"
        x="0"
        y="0"
        width="10"
        height="10"
        fill="#fff"
      >
        <rect x="0" y="0" width="10" height="10" rx="2" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd">
      <rect
        x="0"
        y="0"
        width="10"
        height="10"
        rx="2"
        stroke="#6E6E6E"
        mask="url(#b)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1,3"
      />
      <path
        d="M6 8a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm1 0v6a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1H8a1 1 0 00-1 1z"
        fill="#6E6E6E"
      />
      <path
        d="M8.405 4.605a1.015 1.015 0 011.434 0l1.144 1.436c.552.552.706 1.458.706 2.239 0 .78-.304 1.515-.856 2.066-1.249 1.008-2.092 1.511-2.53 1.511H7.33c-1.11 0-2.013-.287-2.013-1.397V9.66l-.713-.714A1.015 1.015 0 015.15 7.23a1.016 1.016 0 011.29-1.476 1.015 1.015 0 011.687-.624 1.01 1.01 0 01.278-.524z"
        fill="#FFF"
        fillRule="nonzero"
      />
      <path
        d="M8.405 4.605a1.015 1.015 0 011.434 0h0l1.144 1.436c.552.552.706 1.458.706 2.239 0 .78-.304 1.515-.856 2.066-1.249 1.008-2.092 1.511-2.53 1.511h0-.973c-1.11 0-2.013-.287-2.013-1.397h0V9.66l-.713-.714A1.015 1.015 0 015.15 7.23a1.016 1.016 0 011.29-1.476 1.015 1.015 0 011.687-.624 1.01 1.01 0 01.278-.524zm1.119.316a.58.58 0 00-.802 0c-.221.22-.221.58 0 .801h0l.108.108a.223.223 0 010 .317.224.224 0 01-.316 0h0l-.667-.667a.568.568 0 00-.802.801h0l.666.667a.223.223 0 010 .317.224.224 0 01-.316 0h0L6.393 6.262a.568.568 0 00-.802.802h0l1.002 1.002a.223.223 0 010 .317.224.224 0 01-.316 0h0l-.555-.555a.58.58 0 00-.802 0 .564.564 0 000 .801h0l1.673 1.673a.223.223 0 010 .317.224.224 0 01-.316 0h0l-.512-.513v.354c0 .864.702.95 1.565.95h.973c.358 0 1.096-.46 2.214-1.38a2.46 2.46 0 00.725-1.75c0-.661-.107-1.455-.574-1.922h0z"
        stroke="#6E6E6E"
        strokeWidth=".5"
        fill="#353535"
        fillRule="nonzero"
      />
    </g>
  </svg>
)

export const PlusIcon = () => (
  <svg
    width="11"
    height="10"
    viewBox="0 0 11 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 0.5C5.25147 0.5 5.05 0.701472 5.05 0.95V4.55H1.45C1.20147 4.55 1 4.75147 1 5C1 5.24853 1.20147 5.45 1.45 5.45H5.05V9.05C5.05 9.29853 5.25147 9.5 5.5 9.5C5.74853 9.5 5.95 9.29853 5.95 9.05V5.45H9.55C9.79853 5.45 10 5.24853 10 5C10 4.75147 9.79853 4.55 9.55 4.55H5.95V0.95C5.95 0.701472 5.74853 0.5 5.5 0.5Z"
      fill="#6E6E6E"
    />
    <path
      d="M5.05 4.55V5.05H5.55V4.55H5.05ZM5.05 5.45H5.55V4.95H5.05V5.45ZM5.95 5.45V4.95H5.45V5.45H5.95ZM5.95 4.55H5.45V5.05H5.95V4.55ZM5.55 0.95C5.55 0.977614 5.52761 1 5.5 1V0C4.97533 0 4.55 0.425329 4.55 0.95H5.55ZM5.55 4.55V0.95H4.55V4.55H5.55ZM1.45 5.05H5.05V4.05H1.45V5.05ZM1.5 5C1.5 5.02761 1.47761 5.05 1.45 5.05V4.05C0.925329 4.05 0.5 4.47533 0.5 5H1.5ZM1.45 4.95C1.47761 4.95 1.5 4.97239 1.5 5H0.5C0.5 5.52467 0.925328 5.95 1.45 5.95V4.95ZM5.05 4.95H1.45V5.95H5.05V4.95ZM5.55 9.05V5.45H4.55V9.05H5.55ZM5.5 9C5.52761 9 5.55 9.02239 5.55 9.05H4.55C4.55 9.57467 4.97533 10 5.5 10V9ZM5.45 9.05C5.45 9.02239 5.47239 9 5.5 9V10C6.02467 10 6.45 9.57467 6.45 9.05H5.45ZM5.45 5.45V9.05H6.45V5.45H5.45ZM9.55 4.95H5.95V5.95H9.55V4.95ZM9.5 5C9.5 4.97239 9.52238 4.95 9.55 4.95V5.95C10.0747 5.95 10.5 5.52467 10.5 5H9.5ZM9.55 5.05C9.52239 5.05 9.5 5.02761 9.5 5H10.5C10.5 4.47533 10.0747 4.05 9.55 4.05V5.05ZM5.95 5.05H9.55V4.05H5.95V5.05ZM5.45 0.95V4.55H6.45V0.95H5.45ZM5.5 1C5.47239 1 5.45 0.977615 5.45 0.95H6.45C6.45 0.425329 6.02467 0 5.5 0V1Z"
      fill="#6E6E6E"
    />
  </svg>
)

export const calculateCircumference = (id: string, list: StatusLabel[]) => {
  const currentIndex = list.findIndex((obj) => id === obj._id)
  const circumference = 2 * Math.PI * 4
  const percent = (1 / (list.length - 1)) * circumference * currentIndex

  return {
    circumference,
    percent,
  }
}

const RenderIcon = (id: string, list: StatusLabel[]) => {
  const { circumference, percent } = calculateCircumference(id, list)

  switch (percent) {
    case 0: // first item
      return <ToDoIcon />
    case circumference: // last item
      return <DoneIcon />
    default:
      return <DoingIcon />
  }
}

export default RenderIcon
