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

import VerticalEllipsis from '@manuscripts/assets/react/VerticalEllipsis'
import React, { useCallback, useState } from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import { styled } from '../../theme/styled-components'

export const ParagraphStyleActions: React.FC<{
  deleteParagraphStyle: () => void
  duplicateParagraphStyle: () => void
  isDefault: boolean
  renameParagraphStyle: () => void
}> = ({
  deleteParagraphStyle,
  duplicateParagraphStyle,
  isDefault,
  renameParagraphStyle,
}) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setOpen(value => !value)
  }, [])

  const executeMenuAction = useCallback(
    callback => () => {
      setOpen(false)

      // Use a timer so the menu closes first
      window.setTimeout(callback, 0)
    },
    []
  )

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <MenuButton type="button" ref={ref} onClick={toggleOpen}>
            <VerticalEllipsis height={12} />
          </MenuButton>
        )}
      </Reference>
      {open && (
        <Popper placement="bottom">
          {({ ref, style, placement }) => (
            <div ref={ref} style={style} data-placement={placement}>
              <Menu>
                <MenuItem onClick={executeMenuAction(duplicateParagraphStyle)}>
                  Duplicate
                </MenuItem>

                {isDefault && (
                  <>
                    <MenuItem onClick={executeMenuAction(renameParagraphStyle)}>
                      Rename
                    </MenuItem>
                    <MenuItem onClick={executeMenuAction(deleteParagraphStyle)}>
                      Delete
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>
          )}
        </Popper>
      )}
    </Manager>
  )
}

const MenuButton = styled.button`
  border: none;
  background: white;
  cursor: pointer;
  margin: 0 8px;

  &:focus {
    outline: none;
  }
`

const Menu = styled.div`
  background: ${props => props.theme.colors.dropdown.background.default};
  color: ${props => props.theme.colors.dropdown.text.primary};
  border: 1px solid ${props => props.theme.colors.dropdown.border};
  border-radius: 4px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
`

const MenuItem = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.dropdown.background.hovered};
    color: ${props => props.theme.colors.dropdown.text.hovered};
  }
`
