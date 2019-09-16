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

import { Model } from '@manuscripts/manuscripts-json-schema'
import { Button, ButtonGroup, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { TemplateData } from '../../types/templates'

const ModalFooter = styled.div`
  box-shadow: 0 -2px 12px 0 rgba(216, 216, 216, 0.26);
  padding: 20px 32px;
  z-index: 1;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`
const FooterText = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  max-width: 55%;

  @media (max-width: 767px) {
    margin-bottom: 16px;
  }
`
const SelectedTemplateDesc = styled.div`
  color: ${props => props.theme.colors.global.text.secondary};
`

const SelectedTemplateDetails = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`

const SelectedTemplateTitle = styled.span`
  color: ${props => props.theme.colors.global.text.primary};
  font-weight: 500;
`

const SelectedTemplateType = styled.span`
  color: ${props => props.theme.colors.global.text.tertiary};
  margin-left: 8px;
`

const FooterButtons = styled(ButtonGroup)`
  flex: 1;

  @media (max-width: 767px) {
    justify-content: center;
  }

  button {
    line-height: 24px;
    transition: background-color 0.25s;

    &:disabled {
      &,
      &:hover {
        border-color: ${props => props.theme.colors.button.secondary};
        background-color: ${props => props.theme.colors.button.secondary};
      }
    }
  }
`

interface Props {
  createEmpty: () => Promise<void>
  importManuscript: (models: Model[]) => Promise<void>
  selectTemplate: () => Promise<void>
  template?: TemplateData
  creatingManuscript: boolean
}

export const TemplateModalFooter: React.FC<Props> = ({
  createEmpty,
  selectTemplate,
  template,
  creatingManuscript,
}) => {
  return (
    <ModalFooter>
      <FooterText>
        <SelectedTemplateDesc>
          {template ? 'Selected Template' : 'Select a Template'}
        </SelectedTemplateDesc>

        {template && (
          <SelectedTemplateDetails>
            <SelectedTemplateTitle>{template.title}</SelectedTemplateTitle>
            {template.articleType &&
              template.articleType !== template.title && (
                <SelectedTemplateType>
                  {template.articleType}
                </SelectedTemplateType>
              )}
          </SelectedTemplateDetails>
        )}
      </FooterText>
      <FooterButtons>
        <Button onClick={createEmpty} disabled={creatingManuscript}>
          Add Empty
        </Button>
        <PrimaryButton
          onClick={selectTemplate}
          disabled={creatingManuscript || !template}
        >
          Add Manuscript
        </PrimaryButton>
      </FooterButtons>
    </ModalFooter>
  )
}
