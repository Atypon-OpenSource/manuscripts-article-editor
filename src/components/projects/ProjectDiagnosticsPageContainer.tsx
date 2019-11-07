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

import { ContainedModel } from '@manuscripts/manuscript-transform'
import React, { useEffect, useState } from 'react'
import { ProjectDump } from '../../pressroom/importers'
import { styled } from '../../theme/styled-components'

const Container = styled.div`
  padding: ${props => props.theme.grid.unit * 4}px;
`

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.grid.unit * 2}px;
  border-radius: ${props => props.theme.grid.radius.small};
  border: 1px solid #888;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: #eee;
  }
`

export const ProjectDiagnosticsPageContainer: React.FC<{
  projectID: string
  data: ContainedModel[]
}> = React.memo(({ projectID, data }) => {
  const [downloadURL, setDownloadURL] = useState<string>()

  useEffect(() => {
    const projectDump: ProjectDump = { version: '2.0', data }
    const json = JSON.stringify(projectDump, null, 2)
    const blob = new Blob([json])
    const downloadURL = window.URL.createObjectURL(blob)

    setDownloadURL(downloadURL)
  }, [projectID, data])

  if (!downloadURL) {
    return <div>Loading project data…</div>
  }

  return (
    <Container>
      <DownloadButton href={downloadURL} download={`${projectID}.json`}>
        Download project data as JSON
      </DownloadButton>
    </Container>
  )
})
