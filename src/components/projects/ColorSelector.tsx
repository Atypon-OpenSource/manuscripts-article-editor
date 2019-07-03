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

import { MiniButton, PrimaryMiniButton } from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import { ChromePicker, ColorResult } from 'react-color'
import { Manager, Popper, Reference } from 'react-popper'
import { styled } from '../../theme/styled-components'

export const ColorSelector: React.FC<{
  handleChange: (value: string) => void
}> = ({ handleChange }) => {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState('#ffffff')

  const toggleOpen = useCallback(() => {
    setOpen(open => !open)
  }, [setOpen])

  const handleSave = useCallback(() => {
    if (color) {
      handleChange(color)
    }

    setOpen(false)
  }, [color, setOpen])

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
                  <PrimaryMiniButton onClick={handleSave}>
                    Add color
                  </PrimaryMiniButton>

                  <MiniButton onClick={handleCancel}>Cancel</MiniButton>
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
  border: 1px solid ${props => props.theme.colors.dropdown.border};
  border-radius: 4px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.colors.dropdown.background.default};
  padding: 8px;

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
  width: 16px;
  height: 16px;
  margin: 2px;
  cursor: pointer;
  line-height: 0;
  font-size: 16px;

  :hover {
    border-color: #ddd;
  }

  :focus {
    outline: none;
  }
`
