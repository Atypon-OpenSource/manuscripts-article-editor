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

import { PrimaryButton, SecondaryButton } from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import { ChromePicker, ColorResult } from 'react-color'
import { Manager, Popper, Reference } from 'react-popper'
import styled from 'styled-components'

export const ColorSelector: React.FC<{
  handleChange: (value: string) => void
}> = ({ handleChange }) => {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState('#ffffff')

  const toggleOpen = useCallback(() => {
    setOpen((open) => !open)
  }, [setOpen])

  const handleSave = useCallback(() => {
    if (color) {
      handleChange(color)
    }

    setOpen(false)
  }, [color, handleChange, setOpen])

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex)
    },
    [setColor]
  )

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <AddButton ref={ref} type={'button'} onClick={toggleOpen}>
            +
          </AddButton>
        )}
      </Reference>

      {open && (
        <Popper placement={'left'}>
          {({ ref, style, placement }) => (
            <div
              ref={ref}
              style={{
                ...style,
                zIndex: 10,
              }}
              data-placement={placement}
            >
              <PopperContent>
                <ChromePicker
                  onChangeComplete={handleColorChange}
                  color={color}
                />

                <Actions>
                  <PrimaryButton mini={true} onClick={handleSave}>
                    Add color
                  </PrimaryButton>

                  <SecondaryButton mini={true} onClick={handleCancel}>
                    Cancel
                  </SecondaryButton>
                </Actions>
              </PopperContent>
            </div>
          )}
        </Popper>
      )}
    </Manager>
  )
}

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PopperContent = styled.div`
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  padding: ${(props) => props.theme.grid.unit * 2}px;

  .chrome-picker {
    box-shadow: none !important;
  }
`

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  width: ${(props) => props.theme.grid.unit * 4}px;
  height: ${(props) => props.theme.grid.unit * 4}px;
  margin: 2px;
  cursor: pointer;
  line-height: 0;
  font-size: ${(props) => props.theme.font.size.medium};

  :hover {
    border-color: ${(props) => props.theme.colors.border.secondary};
  }

  :focus {
    outline: none;
  }
`
