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

import { useEditor } from '@manuscripts/manuscript-editor'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  Correction as CorrectionT,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { commands, Commit } from '@manuscripts/track-changes'
import React, { useCallback } from 'react'

import { CorrectionsSection } from './CorrectionsSection'

interface CorrectionsByStatus {
  proposed: CorrectionT[]
  accepted: CorrectionT[]
  rejected: CorrectionT[]
}

export const groupCorrectionsByStatus = (
  corrections: CorrectionT[]
): CorrectionsByStatus => {
  const filteredCorrectionsByStatus: CorrectionsByStatus = {
    proposed: [],
    accepted: [],
    rejected: [],
  }

  const correctionsByStatus = corrections.reduce((total, correction) => {
    if (correction.status.label === 'proposed') {
      total.proposed.push(correction)
    } else if (correction.status.label === 'accepted') {
      total.accepted.push(correction)
    } else if (correction.status.label === 'rejected') {
      total.rejected.push(correction)
    }

    return total
  }, filteredCorrectionsByStatus)

  return correctionsByStatus
}

interface Props {
  project: Project
  corrections: CorrectionT[]
  commits: Commit[]
  editor: ReturnType<typeof useEditor>
  collaborators: Map<string, UserProfileWithAvatar>
  accept: (correctionID: string) => void
  reject: (correctionID: string) => void
  user: UserProfileWithAvatar
}

export const Corrections: React.FC<Props> = ({
  corrections,
  commits,
  editor,
  collaborators,
  accept,
  reject,
  project,
  user,
}) => {
  const getCommitFromCorrectionId = useCallback(
    (correctionId: string) => {
      const correction = corrections.find((corr) => corr._id === correctionId)
      if (!correction) {
        return null
      }
      const commit = commits.find(
        (commit) => commit.changeID === correction.commitChangeID
      )
      return commit || null
    },
    [commits, corrections]
  )

  const getCollaboratorById = useCallback(
    (id: string) => collaborators.get(id),
    [collaborators]
  )

  const focusCorrection = (correctionId: string) => {
    const commit = getCommitFromCorrectionId(correctionId)
    if (!commit) {
      return
    }
    editor.doCommand(commands.focusCommit(commit.changeID))
  }
  const correctionsByStatus = groupCorrectionsByStatus(corrections)

  const approveAll = correctionsByStatus.proposed.length
    ? () => {
        correctionsByStatus.proposed.forEach((correction) => {
          accept(correction._id)
        })
      }
    : undefined

  return (
    <>
      <CorrectionsSection
        title={'Suggestions'}
        corrections={correctionsByStatus.proposed}
        project={project}
        focusedCommit={null}
        getCollaboratorById={getCollaboratorById}
        handleFocus={focusCorrection}
        handleAccept={accept}
        handleReject={reject}
        approveAll={approveAll}
        user={user}
      />
      <CorrectionsSection
        title={'Approved Suggestions'}
        corrections={correctionsByStatus.accepted}
        project={project}
        focusedCommit={null}
        getCollaboratorById={getCollaboratorById}
        handleFocus={focusCorrection}
        handleAccept={accept}
        handleReject={reject}
        user={user}
      />
      <CorrectionsSection
        title={'Rejected Suggestions'}
        corrections={correctionsByStatus.rejected}
        project={project}
        focusedCommit={null}
        getCollaboratorById={getCollaboratorById}
        handleFocus={focusCorrection}
        handleAccept={accept}
        handleReject={reject}
        user={user}
      />
    </>
  )
}
