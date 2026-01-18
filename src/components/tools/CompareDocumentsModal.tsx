/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import {
  CloseButton,
  ModalBody,
  ModalContainer,
  ModalHeader,
  PrimaryButton,
  SecondaryButton,
  StyledModal,
  Label,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import { SnapshotLabel } from '../../lib/doc'
export interface CompareDocumentsModalProps {
  snapshots: SnapshotLabel[]
  loading?: boolean
  error?: string | null
  onCancel: () => void
}

export const CompareDocumentsModal: React.FC<CompareDocumentsModalProps> = ({
  snapshots,
  loading = false,
  error = null,
  onCancel,
}) => {
  const [isOpen, setOpen] = useState(true)
  const [originalDocId, setOriginalDocId] = useState<string>('')
  const [comparisonDocId, setComparisonDocId] = useState<string>('')

  const handleCompare = () => {
    setOpen(false)
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('originalId', originalDocId)
    currentUrl.searchParams.set('comparisonId', comparisonDocId)
    window.open(currentUrl.toString(), '_blank')
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
    >
      <StyledModalContainer>
        <StyledModalHeader>
          <ModalTitle>Compare Snapshots</ModalTitle>
          <CloseButton onClick={handleClose} />
        </StyledModalHeader>
        <StyledModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingText>Loading snapshots...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <>
              <DocumentSelectContainer>
                <SelectContainer>
                  <Label htmlFor="original-document">Original Version</Label>
                  <Select
                    id="original-document"
                    value={originalDocId}
                    onChange={(e) => setOriginalDocId(e.target.value)}
                  >
                    <option value="">Select a version</option>
                    {snapshots.map((snapshot) => (
                      <option
                        key={snapshot.id}
                        value={snapshot.id}
                        disabled={snapshot.id === comparisonDocId}
                      >
                        {snapshot.name} ({snapshot.createdAt})
                      </option>
                    ))}
                  </Select>
                </SelectContainer>

                <SelectContainer>
                  <Label htmlFor="comparison-document">
                    Version to Compare
                  </Label>
                  <Select
                    id="comparison-document"
                    value={comparisonDocId}
                    onChange={(e) => setComparisonDocId(e.target.value)}
                  >
                    <option value="">Select a version</option>
                    {snapshots.map((snapshot) => (
                      <option
                        key={snapshot.id}
                        value={snapshot.id}
                        disabled={snapshot.id === originalDocId}
                      >
                        {snapshot.name} ({snapshot.createdAt})
                      </option>
                    ))}
                  </Select>
                </SelectContainer>
              </DocumentSelectContainer>

              <ButtonContainer>
                <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                <PrimaryButton
                  onClick={handleCompare}
                  disabled={
                    !originalDocId ||
                    !comparisonDocId ||
                    originalDocId === comparisonDocId
                  }
                >
                  Compare
                </PrimaryButton>
              </ButtonContainer>
            </>
          )}
        </StyledModalBody>
      </StyledModalContainer>
    </StyledModal>
  )
}

const DocumentSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.grid.unit * 2}px;
`

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.grid.unit}px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`


const Select = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 ${(props) => props.theme.grid.unit * 2}px;
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  background-color: ${(props) => props.theme.colors.background.primary};
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.primary};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='12' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 6L0 0h12z' fill='%23666'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${(props) => props.theme.grid.unit * 2}px center;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.grid.unit * 2}px;
  padding-top: ${(props) => props.theme.grid.unit * 2}px;
  border-top: 1px solid ${(props) => props.theme.colors.border.tertiary};
`

const StyledModalBody = styled(ModalBody)`
  width: 400px;
  padding: ${(props) => props.theme.grid.unit * 3}px;
  flex-direction: column;
  height: 250px;
  justify-content: end;
  margin-bottom: 15px;
`

const StyledModalContainer = styled(ModalContainer)`
  margin: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalTitle = styled.h2`
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`

const StyledModalHeader = styled(ModalHeader)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
`

const LoadingText = styled.div`
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
`

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.text.error};
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  text-align: center;
`
