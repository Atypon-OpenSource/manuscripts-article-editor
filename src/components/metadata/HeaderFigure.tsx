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

import { Build } from '@manuscripts/manuscript-transform'
import {
  Figure,
  Manuscript,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { RxAttachment, RxAttachmentCreator } from '@manuscripts/rxdb'
import React, { useCallback, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'

export const HeaderFigure: React.FC<{
  manuscript: Manuscript
  saveModel: <T extends Model>(model: Build<T>) => Promise<T>
  getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>
  putAttachment: (
    id: string,
    attachment: RxAttachmentCreator
  ) => Promise<RxAttachment<Model>>
}> = ({ manuscript, saveModel, getAttachment, putAttachment }) => {
  const [loaded, setLoaded] = useState<boolean>()
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    setLoaded(false)
    setSrc(undefined)

    if (manuscript.headerFigure) {
      getAttachment(manuscript.headerFigure, 'image')
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          setSrc(url)
        })
        .finally(() => {
          setLoaded(true)
        })
        .catch(error => {
          console.error(error) // tslint:disable-line:no-console
        })
    } else {
      setLoaded(true)
    }
  }, [manuscript.headerFigure])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const figureID = manuscript.headerFigure

      if (figureID) {
        const [file] = acceptedFiles

        if (!file) {
          return
        }

        putAttachment(figureID, {
          id: 'image',
          data: file,
          type: file.type,
        })
          .then(async () => {
            // set the contentType on the Figure object
            await saveModel<Figure>({
              _id: figureID,
              objectType: ObjectTypes.Figure,
              contentType: file.type,
            })

            const url = window.URL.createObjectURL(file)
            setSrc(url)
          })
          .catch(error => {
            console.error(error) // tslint:disable-line:no-console
          })
      }
    },
    [manuscript]
  )

  if (!manuscript.headerFigure || !loaded) {
    return null
  }

  if (!src) {
    return (
      <Dropzone
        onDrop={handleDrop}
        accept={'.jpg,.jpeg,.png,.gif,.webp'}
        multiple={false}
      >
        {({ isDragActive, isDragAccept, getInputProps, getRootProps }) => (
          <StyledDropArea {...getRootProps()}>
            <input {...getInputProps()} />

            <div>
              Drag an image here or click to browse…
              {isDragActive && <div>Drop here</div>}
              {isDragAccept && <div>Accept here</div>}
            </div>
          </StyledDropArea>
        )}
      </Dropzone>
    )
  }

  return (
    <FigureContainer>
      {src && <img src={src} />}

      {/* TODO: attribution? */}
    </FigureContainer>
  )
}

const FigureContainer = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 0 24px 0;

  img {
    width: 100%;
    object-fit: contain;
  }
`

const StyledDropArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px dashed #ddd;
  margin-bottom: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`
