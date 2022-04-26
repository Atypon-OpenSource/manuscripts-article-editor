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

import { ContainedModel, isFigure } from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import {
  AnyValidationResult,
  createTemplateValidator,
  validationOptions,
} from '@manuscripts/requirements'
import toBuffer from 'blob-to-buffer'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import config from '../../config'
import { useRequirementsValidation } from '../../hooks/use-requirements-validation'
import { useStore } from '../../store'
import { ExceptionDialog } from '../projects/lean-workflow/ExceptionDialog'
import { RequirementsList } from './RequirementsList'

export const buildQualityCheck = async (
  modelMap: Map<string, Model>,
  prototypeId: string | undefined,
  manuscriptID: string,
  validationOptions?: validationOptions
): Promise<AnyValidationResult[]> => {
  if (typeof prototypeId === 'undefined') {
    return []
  }

  const getData = async (id: string): Promise<Buffer | undefined> => {
    if (modelMap.has(id)) {
      const model = modelMap.get(id) as Model
      if (isFigure(model)) {
        const modelSrc = model.src as string
        const blobData = await fetch(modelSrc).then((res) => res.blob())
        const blobFile = new File([blobData], id, {
          type: blobData.type,
        })
        return fileToBuffer(blobFile)
      }
    }
    return undefined
  }

  const fileToBuffer = (file: File): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      toBuffer(file, (err, buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(buffer)
        }
      })
    })

  const validateManuscript = createTemplateValidator(prototypeId)
  // TODO: remove `as AnyValidationResult[]`
  const results = (await validateManuscript(
    Array.from(modelMap.values()) as ContainedModel[],
    manuscriptID,
    getData,
    validationOptions
  )) as AnyValidationResult[]

  return results
}

export const RequirementsInspector: React.FC = () => {
  const [{ modelMap, manuscript, manuscriptID }] = useStore((store) => ({
    modelMap: store.modelMap,
    manuscript: store.manuscript,
    manuscriptID: store.manuscriptID,
  }))

  const prototypeId = manuscript.prototype

  const [result, setResult] = useState<AnyValidationResult[]>([])
  const [error, setError] = useState<Error>()

  useEffect(() => {
    buildQualityCheck(modelMap, prototypeId, manuscriptID)
      .then(setResult)
      .catch(setError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prototypeId, manuscriptID, JSON.stringify([...modelMap.values()])])

  return (
    <RequirementsInspectorView
      prototypeId={prototypeId}
      result={result}
      error={error}
    />
  )
}

interface Props {
  prototypeId?: string
}

export const RequirementsInspectorView: React.FC<
  Props & ReturnType<typeof useRequirementsValidation>
> = ({ error, result }) => {
  const [prototypeId] = useStore((store) => store.manuscript?.prototype)
  if (error) {
    return (
      <>
        <ErrorMessage> {error?.message}</ErrorMessage>
        {config.leanWorkflow.enabled && (
          <ExceptionDialog errorCode={'QR_SERVICE_UNAVAILABLE'} />
        )}
      </>
    )
  }

  if (!prototypeId) {
    return (
      <>
        <AlertMessage>
          You need to select a template to display the quality report check
        </AlertMessage>
        {config.leanWorkflow.enabled && (
          <ExceptionDialog errorCode={'QR_PROFILE_NOT_FOUND'} />
        )}
      </>
    )
  }

  if (!result) {
    return null // TODO
  }

  return <RequirementsList validationResult={result} />
}

const AlertMessage = styled.div`
  margin: 13px 0 9px 17px;
`
const ErrorMessage = styled.div`
  margin: 13px 0 9px 17px;
`
