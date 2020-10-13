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

import ManuscriptIcon from '@manuscripts/assets/react/OutlineIconManuscript'
import {
  Checks,
  iterateChildren,
  OutlineItemIcon,
  RequirementsAlerts,
  RequirementsContext,
} from '@manuscripts/manuscript-editor'
import {
  ActualManuscriptNode,
  buildSubmission,
  ManuscriptNode,
} from '@manuscripts/manuscript-transform'
import { Manuscript, Submission } from '@manuscripts/manuscripts-json-schema'
import {
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

export interface TargetJournal {
  depositoryCode: string
  issn: string
  journalName: string
  journalAbbreviation: string
}

interface NodeValidation {
  node: ManuscriptNode
  alerts: RequirementsAlerts
}

const hasFailedValidations = (validations: NodeValidation[]): boolean =>
  validations.some((validation) =>
    Object.values(validation.alerts).some((alert) => !alert.passed)
  )

const normalizeISSN = (issn: string): string => issn.replace(/\W/g, '')

export const PreflightDialog: React.FC<{
  doc: ActualManuscriptNode
  handleConfirm: (submission: Submission) => Promise<void>
  handleClose: () => void
  issns: string[]
  targetJournals: TargetJournal[]
  manuscript: Manuscript
}> = ({ doc, handleConfirm, handleClose, issns, targetJournals }) => {
  const [targetJournal, setTargetJournal] = useState<TargetJournal | null>()

  const [validations, setValidations] = useState<NodeValidation[]>()

  const [error, setError] = useState<Error>()

  const buildRequirementsAlerts = useContext(RequirementsContext)

  const buildValidations = useCallback(
    async (node: ManuscriptNode) => {
      const output: NodeValidation[] = []

      const alerts = await buildRequirementsAlerts(node)

      // TODO: author metadata checks
      // alerts['corresponding_author'] = {
      //   passed: true,
      //   message: 'A corresponding author has been selected',
      // }
      //
      // alerts['corresponding_author_email'] = {
      //   passed: true,
      //   message: 'All corresponding authors have email addresses',
      // }
      //
      // alerts['author_affiliations'] = {
      //   passed: true,
      //   message: 'All authors have affiliations',
      // }

      if (Object.keys(alerts).length > 0) {
        output.push({ node, alerts })
      }

      for (const childNode of iterateChildren(node, true)) {
        if (childNode.attrs.id) {
          const alerts = await buildRequirementsAlerts(childNode)

          if (Object.keys(alerts).length > 0) {
            output.push({ node: childNode, alerts })
          }
        }
      }

      return output
    },
    [buildRequirementsAlerts]
  )

  useEffect(() => {
    const normalizedISSNs = issns.map(normalizeISSN)

    for (const targetJournal of targetJournals) {
      const normalizedTargetISSN = normalizeISSN(targetJournal.issn)

      if (normalizedISSNs.includes(normalizedTargetISSN)) {
        setTargetJournal(targetJournal)
        return
      }
    }

    setTargetJournal(null)
  }, [issns, targetJournals])

  useEffect(() => {
    if (targetJournal) {
      buildValidations(doc)
        .then(setValidations)
        .catch((error) => {
          setError(error)
        })
    }
  }, [targetJournal, doc, buildValidations])

  const handleSubmit = useCallback(() => {
    if (!targetJournal) {
      return
    }

    if (
      !hasFailedValidations(validations!) ||
      confirm('There are failed validations, are you sure you wish to proceed?')
    ) {
      const submission = buildSubmission()
      submission.journalCode = targetJournal.journalAbbreviation
      submission.journalTitle = targetJournal.journalName
      submission.issn = targetJournal.issn

      handleConfirm(submission as Submission).catch((error) => {
        console.error(error)
      })
    }
  }, [handleConfirm, targetJournal, validations])

  return (
    <StyledModal
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handleClose}
    >
      <ModalBody>
        <ModalTitle>
          Submission
          {targetJournal && (
            <span>
              {' '}
              to <i>{targetJournal.journalName}</i>
            </span>
          )}
        </ModalTitle>

        <ModalMain>
          {targetJournal === undefined && <div>Checking…</div>}

          {targetJournal === null && (
            <div>Submission to this journal is not yet available.</div>
          )}

          {targetJournal && (
            <ManuscriptTitleContainer>
              <OutlineItemIcon>
                <StyledManuscriptIcon />
              </OutlineItemIcon>
              <ManuscriptTitle
                // value={manuscript.title || 'Untitled Manuscript'}
                value={'Manuscript'}
              />
            </ManuscriptTitleContainer>
          )}

          {targetJournal && (
            <>
              {validations
                ? validations.map((validation) => (
                    <Checks
                      node={validation.node}
                      alerts={validation.alerts}
                      key={validation.node.attrs.id}
                    />
                  ))
                : 'Validating…'}
            </>
          )}

          {error && <div>{error.message}</div>}
        </ModalMain>

        {targetJournal && (
          <ModalFooter>
            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>

            <PrimaryButton onClick={handleSubmit} disabled={!validations}>
              Submit to Review
            </PrimaryButton>
          </ModalFooter>
        )}

        {targetJournal === null && (
          <ModalFooter>
            <PrimaryButton onClick={handleClose}>OK</PrimaryButton>
          </ModalFooter>
        )}

        {targetJournal === undefined && (
          <ModalFooter>
            <PrimaryButton onClick={handleClose}>Cancel</PrimaryButton>
          </ModalFooter>
        )}
      </ModalBody>
    </StyledModal>
  )
}

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`

const ModalTitle = styled.div`
  font-size: ${(props) => props.theme.font.size.large};
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 8}px;
`

const ModalMain = styled.div`
  flex: 1;
  padding: 0 ${(props) => props.theme.grid.unit * 8}px
    ${(props) => props.theme.grid.unit * 4}px;
  max-height: 70vh;
  overflow-y: auto;
`

const ModalFooter = styled(ButtonGroup)`
  padding: ${(props) => props.theme.grid.unit * 4}px;
`

const ManuscriptTitle = styled(Title)`
  margin-left: ${(props) => props.theme.grid.unit}px;
`

const ManuscriptTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.grid.unit}px;
`

const StyledManuscriptIcon = styled(ManuscriptIcon)`
  flex-shrink: 0;
  margin-right: ${(props) => props.theme.grid.unit}px;
`
