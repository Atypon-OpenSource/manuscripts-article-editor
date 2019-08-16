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
