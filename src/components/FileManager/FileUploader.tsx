/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import React, { ChangeEvent, useCallback, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import styled, { css } from 'styled-components'

import {
  fetchRemoteFileWithRecord,
  IngestionRecord,
  readManifestUrls,
  SecurityValidationError,
} from '../../lib/external-ingestion'

type Files = {
  files: File[]
}

export interface FileUploaderProps {
  onUpload: (file: File) => void | Promise<void>
  placeholder: string
  accept?: string
  allowExternalIngestion?: boolean
}

/**
 * This component will show the drag or upload file area
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  placeholder,
  accept,
  allowExternalIngestion = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const manifestInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setImporting] = React.useState(false)
  const [importUrl, setImportUrl] = React.useState('')
  const [ingestionError, setIngestionError] = React.useState('')
  const [ingestionRecords, setIngestionRecords] = React.useState<IngestionRecord[]>(
    []
  )

  const openFileDialog = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0]
      await onUpload(file)
    }
  }

  const importFromRemoteUrl = async (url: string) => {
    const { file, record } = await fetchRemoteFileWithRecord(url)
    await onUpload(file)
    setIngestionRecords((prev) => [record, ...prev])
  }

  const openManifestDialog = () => {
    manifestInputRef.current?.click()
  }

  const handleUrlImport = async () => {
    const trimmed = importUrl.trim()
    if (!trimmed) {
      setIngestionError('Please provide a URL to import.')
      return
    }

    setImporting(true)
    setIngestionError('')
    try {
      await importFromRemoteUrl(trimmed)
      setImportUrl('')
    } catch (error) {
      if (error instanceof SecurityValidationError) {
        setIngestionError(`Security: ${error.message}`)
      } else {
        setIngestionError((error as Error).message)
      }
    } finally {
      setImporting(false)
    }
  }

  const handleManifestImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const manifest = event.target.files?.[0]
    if (!manifest) {
      return
    }

    setImporting(true)
    setIngestionError('')
    try {
      const urls = await readManifestUrls(manifest)
      if (urls.length === 0) {
        throw new Error('No valid URLs were found in the uploaded workbook.')
      }

      for (const url of urls) {
        await importFromRemoteUrl(url)
      }
    } catch (error) {
      if (error instanceof SecurityValidationError) {
        setIngestionError(`Security: ${error.message}`)
      } else {
        setIngestionError((error as Error).message)
      }
    } finally {
      event.target.value = ''
      setImporting(false)
    }
  }

  const downloadAuditTrail = () => {
    if (ingestionRecords.length === 0) {
      return
    }

    const json = JSON.stringify(ingestionRecords, null, 2)
    const auditBlob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(auditBlob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `ingestion-custody-log-${new Date().toISOString()}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(href)
  }

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: async (item: Files) => {
      const file = item.files[0]
      await onUpload(file)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const drop = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node)
    },
    [dropRef]
  )

  const isActive = canDrop && isOver

  return (
    <Container
      ref={drop}
      data-cy="file-uploader"
      $active={isActive}
      onClick={openFileDialog}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          openFileDialog()
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
        accept={accept}
        value={''}
      />
      {placeholder}
      {allowExternalIngestion && (
        <ExternalIngestionContainer>
          <InteractionBlocker
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
          <ExternalLabel>
            Import from URL or a workbook export (.csv/.tsv/.txt)
          </ExternalLabel>
          <ExternalControls>
            <UrlInput
              ref={urlInputRef}
              type="url"
              value={importUrl}
              placeholder="https://example.com/file.pdf"
              onChange={(event) => setImportUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void handleUrlImport()
                }
              }}
            />
            <ExternalActionButton
              type="button"
              onClick={() => void handleUrlImport()}
              disabled={isImporting}
            >
              Import URL
            </ExternalActionButton>
            <ExternalActionButton
              type="button"
              onClick={openManifestDialog}
              disabled={isImporting}
            >
              Import Workbook
            </ExternalActionButton>
            <input
              ref={manifestInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              style={{ display: 'none' }}
              onChange={(event) => void handleManifestImport(event)}
            />
          </ExternalControls>
          {ingestionError && <ErrorText>{ingestionError}</ErrorText>}
          {ingestionRecords.length > 0 && (
            <AuditTrailContainer>
              <AuditTrailHeader>
                <AuditTrailTitle>Digital footprint</AuditTrailTitle>
                <ExternalActionButton type="button" onClick={downloadAuditTrail}>
                  Export Chain of Custody
                </ExternalActionButton>
              </AuditTrailHeader>
              {ingestionRecords.map((record) => (
                <AuditTrailEntry key={`${record.sha256}-${record.importedAt}`}>
                  <AuditTrailText><strong>File:</strong> {record.fileName}</AuditTrailText>
                  <AuditTrailText><strong>Imported:</strong> {record.importedAt}</AuditTrailText>
                  <AuditTrailText><strong>Validated:</strong> {record.validatedAt}</AuditTrailText>
                  <AuditTrailText><strong>Type:</strong> {record.mimeType}</AuditTrailText>
                  <AuditTrailText><strong>Size:</strong> {record.size} bytes</AuditTrailText>
                  <AuditTrailText><strong>SHA-256:</strong> {record.sha256}</AuditTrailText>
                  <AuditTrailText><strong>Source:</strong> {record.sourceUrl}</AuditTrailText>
                  <ExternalActionButton
                    type="button"
                    onClick={() => void importFromRemoteUrl(record.sourceUrl)}
                    disabled={isImporting}
                  >
                    Restore
                  </ExternalActionButton>
                </AuditTrailEntry>
              ))}
            </AuditTrailContainer>
          )}
          </InteractionBlocker>
        </ExternalIngestionContainer>
      )}
    </Container>
  )
}

const activeBoxStyle = css`
  background: #f2fbfc;
  border: 1px dashed #bce7f6;
`

const Container = styled.div<{ $active: boolean }>`
  background: ${(props) => props.theme.colors.background.secondary};
  border: 1px dashed #e2e2e2;
  box-sizing: border-box;
  border-radius: 8px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 24px;
  font-family: ${(props) => props.theme.font.family.Lato};
  color: ${(props) => props.theme.colors.text.onLight};
  cursor: pointer;
  margin: 16px 16px 8px;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.outline.focus};
    outline-offset: 2px;
  }

  ${(props) =>
    props.$active
      ? css`
          ${activeBoxStyle}
        `
      : css``}
`

const ExternalIngestionContainer = styled.div`
  width: 100%;
  padding: 0 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const InteractionBlocker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ExternalLabel = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 12px;
`

const ExternalControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const UrlInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  height: 30px;
  padding: 0 8px;
`

const ExternalActionButton = styled.button`
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.text.primary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  padding: 0 10px;
  height: 30px;
  cursor: pointer;
`

const ErrorText = styled.span`
  color: ${(props) => props.theme.colors.text.error};
  font-size: 12px;
`

const AuditTrailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const AuditTrailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const AuditTrailTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`

const AuditTrailEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid ${(props) => props.theme.colors.border.tertiary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  padding: 8px;
  background: ${(props) => props.theme.colors.background.primary};
`

const AuditTrailText = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme.colors.text.secondary};
  overflow-wrap: anywhere;
`
