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
import styled, { css } from 'styled-components'
import { selectStyles } from '../../../lib/select-styles'
import { greyLight } from '../../../theme/colors'

interface StyleProps {
  isDisabled?: boolean
  isDragging?: boolean
  isFocused?: boolean
  isSelected?: boolean
  isDueSoon?: boolean
  isOverdue?: boolean
  defaultColor?: string
  pie?: {
    circumference: number
    percent: number
  }
}
export const customStyles = {
  ...selectStyles,
  clearIndicator: (styles: {}) => {
    return {
      ...styles,
      cursor: 'pointer',
      svg: {
        fill: '#6E6E6E',
      },
    }
  },
  menuList: (styles: {}) => {
    return {
      ...styles,
      padding: '0',
    }
  },
  option: (styles: {}, { isDisabled }: StyleProps) => {
    return {
      ...styles,
      color: '#353535',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      padding: '0',
    }
  },
}
const pieStyles = css<{
  pie: {
    circumference: number
    percent: number
  }
}>`
  .pie {
    stroke-dasharray: ${props => props.pie.percent}
      ${props => props.pie.circumference};
  }
`
const dndStyles = css`
  border: 1px solid ${props => props.theme.colors.border.secondary};
  border-radius: ${props => props.theme.grid.radius.default};
  margin: ${props => props.theme.grid.unit * 4}px 0;
  padding: ${props => props.theme.grid.unit * 2}px;
`
const iconStyles = css<StyleProps>`
  .iconToDo g {
    stroke: ${props =>
      props.isSelected
        ? props.theme.colors.brand.medium
        : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
        ? props.theme.colors.text.error
        : props.defaultColor};
  }
  .iconDone circle {
    fill: ${props =>
      props.isSelected
        ? props.theme.colors.brand.medium
        : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
        ? props.theme.colors.text.error
        : props.defaultColor};
  }
  .iconDoing circle {
    stroke: ${props =>
      props.isSelected
        ? props.theme.colors.brand.medium
        : props.isDueSoon
        ? props.theme.colors.text.warning
        : props.isOverdue
        ? props.theme.colors.text.error
        : props.defaultColor};
  }

  ${props => props.pie && pieStyles}
`
const optionStyles = css<StyleProps>`
  background: ${props =>
    props.isSelected ? props.theme.colors.background.fifth : 'transparent'};

  &.padded {
    padding: ${props => props.theme.grid.unit * 4}px;
  }

  ${iconStyles}
`
export const DndItemButton = styled.div<StyleProps>`
  align-items: center;
  background: ${props => (props.isDragging ? 'pink' : 'white')};
  display: flex;
  font-size: ${props => props.theme.font.size.normal};
  line-height: ${props => props.theme.font.lineHeight.normal};

  ${optionStyles}

  svg {
    margin-right: ${props => props.theme.grid.unit * 2}px;
  }
`
export const IconSpan = styled.span`
  display: inline-flex;
`
export const DndZone = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 4}px;

  ${DndItemButton} {
    ${dndStyles}
  }

  .newStatus .pie {
    stroke-dasharray: 0 26;
  }

  .orderedStatus {
    margin: ${props => props.theme.grid.unit * 10}px 0;
  }
`
export const DndDisclaimer = styled.div`
  background-image: url("data:image/svg+xml,%3Csvg width='212' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1h214' stroke='%23E2E2E2' fill='none' stroke-dasharray='4' stroke-linecap='square'/%3E%3C/svg%3E");
  background-position: bottom;
  background-repeat: repeat-x;

  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 -${props => props.theme.grid.unit * 4}px;

  p {
    color: #6e6e6e;
    font-size: ${props => props.theme.font.size.small};
    font-weight: ${props => props.theme.font.weight.normal};
    line-height: ${props => props.theme.font.lineHeight.normal};
    margin: ${props => props.theme.grid.unit * 3}px 0;
    max-width: 150px;
    text-align: center;
  }
`
export const Details = styled.div`
  color: ${greyLight};
  padding-left: ${props => props.theme.grid.unit * 6}px;
  position: relative;
`
export const Tooltip = styled.div`
  background: #333;
  border-radius: ${props => props.theme.grid.radius.default};
  color: ${props => props.theme.colors.text.onDark};
  display: flex;
  flex-direction: column-reverse;
  left: -72px;
  padding: ${props => props.theme.grid.unit * 4}px;
  position: absolute;
  top: 36px;
  width: 150px;

  &:after {
    bottom: 100%;
    border: ${props => props.theme.grid.unit * 2}px solid transparent;
    border-bottom-color: #333;
    content: ' ';
    height: 0;
    left: 50%;
    margin-left: -${props => props.theme.grid.unit * 2}px;
    position: absolute;
    pointer-events: none;
    width: 0;
  }
`
export const TipItem = styled.div`
  font-size: ${props => props.theme.font.size.small};
  font-weight: ${props => props.theme.font.weight.normal};
  line-height: ${props => props.theme.font.lineHeight.normal};

  ${DndItemButton} {
    font-weight: ${props => props.theme.font.weight.bold};
  }

  & + & {
    margin-bottom: ${props => props.theme.grid.unit}px;

    ${Details} {
      &:before {
        position: absolute;
        content: '';
        left: ${props => props.theme.grid.unit * 2}px;
        top: ${props => props.theme.grid.unit}px;
        height: calc(100% - ${props => props.theme.grid.unit}px);
        width: 1px;
        border-left: 1px dashed #6e6e6e;
      }
    }
  }
`
export const DateStyled = styled.div`
  color: ${greyLight};
`
export const Expiring = styled.div`
  &.dueSoon {
    color: ${props => props.theme.colors.text.warning};
  }
  &.overdue {
    color: ${props => props.theme.colors.text.error};
  }
`
export const StatusInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const AlertContainer = styled.div`
  bottom: -${props => props.theme.grid.unit * 16}px;
  display: flex;
  justify-content: flex-end;
  left: -100px;
  position: absolute;
  right: 0;

  > div {
    max-width: 100%;
    width: fit-content;
  }
`
