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
import {
  Model,
  ObjectTypes,
  RequirementsValidation,
} from '@manuscripts/json-schema'
import {
  AnyValidationResult,
  runManuscriptFixes,
} from '@manuscripts/requirements'
import { ContainedModel } from '@manuscripts/transform'
import { isEqual } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

const getDiff = (
  modelMap: Map<string, Model>,
  containedModelArray: Array<ContainedModel>
): Array<ContainedModel> => {
  const result: Array<ContainedModel> = new Array<ContainedModel>()

  containedModelArray.forEach((value) => {
    if (!modelMap.get(value._id)) {
      // Determine added objects
      result.push(value)
    } else {
      // Determine updated objects
      if (!isEqual(modelMap.get(value._id), value)) {
        result.push(value)
      }
    }
  })

  return result
}

export const RequirementsData: React.FC<{
  node: AnyValidationResult
  modelMap: Map<string, Model>
  manuscriptID: string
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
}> = ({ node, modelMap, manuscriptID, bulkUpdate }) => {
  const [isShown, setIsShown] = useState(false)

  const fixItHandler = useCallback(async () => {
    const manuscriptData: Array<ContainedModel> = new Array<ContainedModel>()
    modelMap.forEach((value) => {
      manuscriptData.push({
        ...value,
      } as ContainedModel)
    })

    const result: Array<ContainedModel> = runManuscriptFixes(
      manuscriptData,
      manuscriptID,
      [node]
    )

    const changedItems: Array<ContainedModel> = getDiff(modelMap, result)

    await bulkUpdate(changedItems)
  }, [modelMap, bulkUpdate, manuscriptID, node])

  const ignoreItHandler = useCallback(async () => {
    modelMap.forEach((model) => {
      if (model.objectType === ObjectTypes.RequirementsValidation) {
        const validationModel = model as RequirementsValidation
        validationModel.results.forEach((value) => {
          if (value._id === node._id) {
            value.ignored = true
          }
        })
        modelMap.set(validationModel._id, validationModel)
      }
    })
  }, [modelMap, node])

  return (
    <InspectorContainer>
      <MessageContainer
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <Message> {node.message} </Message>

        {isShown && !node.passed && node.fixable && (
          <ButtonsList>
            <Button onClick={fixItHandler}> Fix it</Button>
            {!node.ignored && (
              <Button onClick={ignoreItHandler}> Ignore</Button>
            )}
          </ButtonsList>
        )}
      </MessageContainer>
    </InspectorContainer>
  )
}

const InspectorContainer = styled.div`
  display: flex;
  height: 52px;
`
const MessageContainer = styled.div`
  font-family: Lato;
  font-size: 14px;
  color: #353535;
  padding: 4px 0 0 58px;
`
const Message = styled.div`
  display: inline;
  cursor: default;
`
const Button = styled.button`
  font-family: Lato;
  font-size: 14px;
  text-decoration-line: underline;
  color: #0d79d0;
  padding: 0 0 0 9px;
  cursor: pointer;
  background: #fff;
  border: none;
  outline: none;
`
const ButtonsList = styled.div`
  float: right;
  padding: 22px 0 0 0;
  cursor: pointer;
`
