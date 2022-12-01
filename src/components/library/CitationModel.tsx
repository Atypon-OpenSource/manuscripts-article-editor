/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import { shortLibraryItemMetadata } from '@manuscripts/library'
import { getModelsByType } from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Citation,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import {
  Category,
  CloseButton,
  Dialog,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import { FormikProps } from 'formik'
import { isEqual } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import styled, { css } from 'styled-components'

import { ScrollableModalMain } from '../metadata/AuthorsModals'
import { GroupIcon } from '../projects/lean-workflow/icons/GroupIcon'
import {
  ModalBody,
  ModalSidebar,
  SidebarContent,
  SidebarHeader,
} from '../Sidebar'
import { CitedItemMetadata, CitedItemTitle } from './CitationEditor'
import ReferenceForm, {
  buildInitialValues,
  ReferenceFormValues,
} from './ReferenceForm'

export const CitationModel: React.FC<{
  editCitation: boolean
  modelMap: Map<string, Model>
  saveCallback: (item?: ReferenceFormValues) => void
  deleteCallback: () => void
  selectedItem?: BibliographyItem
  setSelectedItem: React.Dispatch<React.SetStateAction<BibliographyItem>>
  setShowEditModel: React.Dispatch<React.SetStateAction<boolean>>
  getReferences: (query?: string) => Promise<BibliographyItem[]>
}> = ({
  editCitation,
  modelMap,
  saveCallback,
  selectedItem,
  setSelectedItem,
  setShowEditModel,
  deleteCallback,
  getReferences,
}) => {
  const stopEditing = useCallback(() => setShowEditModel(false), [
    setShowEditModel,
  ])

  const formMikRef = useRef<FormikProps<ReferenceFormValues>>(null)

  const [{ referenceCount, references }, setReferences] = useState<{
    referenceCount: Map<string, number>
    references: BibliographyItem[]
  }>({
    referenceCount: new Map(),
    references: [],
  })
  const [showPendingChangeDialog, setShowPendingChangeDialog] = useState(false)

  const onSelectReference = useCallback(
    (e) => {
      const other = formMikRef.current?.values
      if (!selectedItem || isEqual(buildInitialValues(selectedItem), other)) {
        setSelectedItem(
          references.find(
            ({ _id }) => _id === e.currentTarget.id
          ) as BibliographyItem
        )
      } else {
        setShowPendingChangeDialog(true)
      }
    },
    [references, selectedItem, setSelectedItem]
  )

  useEffect(() => {
    if (editCitation) {
      getReferences(undefined)
        .then((references) => {
          const referenceCount = new Map()

          getModelsByType<Citation>(modelMap, ObjectTypes.Citation).map(
            ({ embeddedCitationItems }) =>
              embeddedCitationItems.map(({ bibliographyItem }) => {
                let value = referenceCount.get(bibliographyItem)
                referenceCount.set(bibliographyItem, (value && ++value) || 1)
              })
          )

          setReferences({ references, referenceCount })
        })
        .catch((e) => console.error(e))
    }
  }, [editCitation, getReferences, modelMap])

  const modelDeleteCallback = useCallback(() => {
    deleteCallback()
    setReferences({
      referenceCount,
      references: [
        ...references.filter(({ _id }) => _id !== selectedItem?._id),
      ],
    })
  }, [deleteCallback, referenceCount, references, selectedItem?._id])

  const modelSaveCallback = useCallback(
    (item) => {
      saveCallback(item)
      setSelectedItem(item)
      setReferences({
        referenceCount,
        references: [
          ...references.map((ref) => (ref._id === item?._id ? item : ref)),
        ],
      })
    },
    [referenceCount, references, saveCallback, setSelectedItem]
  )

  const disableDelete =
    ((selectedItem?._id && referenceCount.get(selectedItem._id)) || 0) > 0

  if (references.length < 1) {
    return <></>
  }

  return (
    <StyledModal
      isOpen={editCitation}
      onRequestClose={stopEditing}
      shouldCloseOnOverlayClick={true}
    >
      <Dialog
        isOpen={showPendingChangeDialog}
        category={Category.confirmation}
        header="You've made changes to this option"
        message="Would you like to save or discard your changes?"
        actions={{
          secondary: {
            action: () => {
              formMikRef.current?.resetForm()
              setShowPendingChangeDialog(false)
            },
            title: 'Discard',
          },
          primary: {
            action: () => {
              modelSaveCallback(formMikRef.current?.values)
              setShowPendingChangeDialog(false)
            },
            title: 'Save',
          },
        }}
      />
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={stopEditing} />
        </ModalHeader>

        <ModalBody>
          <ReferencesSidebar>
            <SidebarHeader title={'References'} />
            <ReferencesSidebarContent>
              {references.map((item, index) => (
                <ReferenceButton
                  key={index}
                  id={item._id}
                  onClick={onSelectReference}
                  selected={selectedItem?._id === item._id}
                >
                  <IconContainer data-tip={true} data-for={'group-icon'}>
                    <ReferenceLibraryIcon />
                    <GroupIcon
                      numberOfCitations={referenceCount.get(item._id) || 0}
                    />
                    <ReactTooltip
                      disable={(referenceCount.get(item._id) || 0) < 1}
                      id={'group-icon'}
                      place="bottom"
                      effect="solid"
                      offset={{ top: 40 }}
                      className="tooltip"
                    >
                      Number of times used in the document
                    </ReactTooltip>
                  </IconContainer>
                  <Grid>
                    <CitedItemTitle
                      value={item.title || 'Untitled'}
                      withOverflow
                    />
                    <CitedItemMetadata>
                      {shortLibraryItemMetadata(item)}
                    </CitedItemMetadata>
                  </Grid>
                </ReferenceButton>
              ))}
            </ReferencesSidebarContent>
          </ReferencesSidebar>
          <ScrollableModalMain>
            {selectedItem && (
              <ReferenceForm
                item={selectedItem}
                formMikRef={formMikRef}
                disableDelete={disableDelete}
                deleteCallback={modelDeleteCallback}
                handleCancel={stopEditing}
                saveCallback={modelSaveCallback}
              />
            )}
          </ScrollableModalMain>
        </ModalBody>
      </ModalContainer>
    </StyledModal>
  )
}

const ReferencesSidebar = styled(ModalSidebar)`
  width: 70%;
`

const ReferencesSidebarContent = styled(SidebarContent)`
  overflow-y: hidden;
`

const Grid = styled.div`
  display: grid;
`

export const Legend = styled.legend`
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.xlarge} /
    ${(props) => props.theme.font.lineHeight.large}
    ${(props) => props.theme.font.family.sans};
  letter-spacing: -0.4px;
  color: ${(props) => props.theme.colors.text.secondary};
`

export const Fields = styled.div`
  padding: 16px;
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Fieldset = styled.fieldset`
  border: none;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`

const selectedReferenceStyle = css`
  background: ${(props) => props.theme.colors.background.info};
  border-top: 1px solid #bce7f6;
  border-bottom: 1px solid #bce7f6;
`

const ReferenceButton = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  path {
    fill: #c9c9c9;
  }

  :hover {
    background: ${(props) => props.theme.colors.background.info};
  }

  ${(props) => props.selected && selectedReferenceStyle}

  .tooltip {
    max-width: ${(props) => props.theme.grid.unit * 25}px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    border-radius: 6px;
  }
`

const IconContainer = styled.div`
  padding-right: ${(props) => props.theme.grid.unit * 5}px;
  position: relative;
`
