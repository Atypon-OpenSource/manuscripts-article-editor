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
import sectionCategories from '@manuscripts/data/dist/shared/section-categories.json'
import { ContainedModel } from '@manuscripts/manuscript-transform'
import { Model, SectionCategory } from '@manuscripts/manuscripts-json-schema'
import { runManuscriptFixes } from '@manuscripts/requirements'
import { isEqual } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { AnyValidationResult } from '../../lib/validations'
import { ValidationDangerIcon, ValidationPassedIcon } from './RequirementsIcons'
import {
  BibliographyDoiExist,
  BibliographyDoiFormat,
  DefaultMessage,
  FigureContainsImage,
  FigureFormatValidation,
  ManuscriptMaximumCharacters,
  ManuscriptMaximumCombinedFigureTables,
  ManuscriptMaximumFigures,
  ManuscriptMaximumReferences,
  ManuscriptMaximumTables,
  ManuscriptMaximumWords,
  ManuscriptMinimumCharacters,
  ManuscriptMinimumWords,
  ManuscriptTitleMaximumWords,
  ManuscriptTitleMinimumCharacters,
  ManuscriptTitleMinimumWords,
  RequiredSection,
  SectionBodyHasContent,
  SectionCategoryUniqueness,
  SectionMaximumCharacters,
  SectionMaximumWords,
  SectionMinimumCharacters,
  SectionMinimumWords,
  SectionOrder,
  SectionTitleContainsContent,
  SectionTitleMatch,
} from './RequirementsMessages'

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
      [node],
      {
        parser: new DOMParser(),
        serializer: new XMLSerializer(),
      }
    )

    const changedItems: Array<ContainedModel> = getDiff(modelMap, result)

    await bulkUpdate(changedItems)
  }, [modelMap, bulkUpdate, manuscriptID, node])

  return (
    <InspectorContainer>
      <Icon>
        {node.passed ? <ValidationPassedIcon /> : <ValidationDangerIcon />}
      </Icon>
      <Message
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <ValidationMessage node={node} />

        {isShown && !node.passed && node.fix && (
          <ButtonsList>
            <Button onClick={fixItHandler}> Fix it</Button>
            <Button> Ignore</Button>
          </ButtonsList>
        )}
      </Message>
    </InspectorContainer>
  )
}

const ValidationMessage: React.FC<{
  node: AnyValidationResult
}> = ({ node }) => {
  // tslint:disable-next-line:cyclomatic-complexity
  switch (node.type) {
    case 'required-section': {
      const category = sectionCategories.map((section: SectionCategory) => {
        if (section._id === node.data.sectionDescription.sectionCategory) {
          return section.name
        }
      })
      return <RequiredSection category={category} />
    }
    case 'section-body-has-content':
      return <SectionBodyHasContent />
    case 'section-title-match':
      return <SectionTitleMatch title={node.data.title} />
    case 'section-title-contains-content':
      return <SectionTitleContainsContent />
    case 'section-minimum-words':
      return <SectionMinimumWords wordsNumber={node.data.count} />
    case 'section-minimum-characters':
      return <SectionMinimumCharacters charNumber={node.data.count} />
    case 'section-maximum-characters':
      return <SectionMaximumCharacters charNumber={node.data.count} />
    case 'section-maximum-words':
      return <SectionMaximumWords wordsNumber={node.data.count} />
    case 'section-order':
      return <SectionOrder sectionOrder={node.data.order} />
    case 'manuscript-maximum-characters':
      return <ManuscriptMaximumCharacters value={node.data.count} />
    case 'manuscript-minimum-characters':
      return <ManuscriptMinimumCharacters value={node.data.count} />
    case 'manuscript-maximum-words':
      return <ManuscriptMaximumWords value={node.data.count} />
    case 'manuscript-minimum-words':
      return <ManuscriptMinimumWords value={node.data.count} />
    case 'manuscript-title-maximum-words':
      return <ManuscriptTitleMaximumWords value={node.data.count} />
    case 'manuscript-title-minimum-words':
      return <ManuscriptTitleMinimumWords value={node.data.count} />
    case 'manuscript-title-maximum-characters':
      return <ManuscriptMaximumCharacters value={node.data.count} />
    case 'manuscript-title-minimum-characters':
      return <ManuscriptTitleMinimumCharacters value={node.data.count} />
    case 'manuscript-maximum-references':
      return <ManuscriptMaximumReferences value={node.data.count} />
    case 'manuscript-maximum-figures':
      return <ManuscriptMaximumFigures value={node.data.count} />
    case 'manuscript-maximum-tables':
      return <ManuscriptMaximumTables value={node.data.count} />
    case 'manuscript-maximum-combined-figure-tables':
      return <ManuscriptMaximumCombinedFigureTables value={node.data.count} />
    case 'figure-format-validation':
      return <FigureFormatValidation format={node.data.contentType} />
    case 'figure-contains-image':
      return <FigureContainsImage />
    case 'section-category-uniqueness':
      return <SectionCategoryUniqueness />
    case 'bibliography-doi-format':
      return <BibliographyDoiFormat />
    case 'bibliography-doi-exist':
      return <BibliographyDoiExist />
    default: {
      return <DefaultMessage passed={node.data.passed} />
    }
  }
}

const InspectorContainer = styled.div`
  display: flex;
  height: 52px;
`
const Icon = styled.div`
  padding: 0 0 0 18px;
`
const Message = styled.div`
  font-family: Lato;
  font-size: 14px;
  color: #353535;
  padding: 4px 0 0 11px;
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
`
