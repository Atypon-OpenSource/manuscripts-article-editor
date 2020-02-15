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

import BlogIcon from '@manuscripts/assets/react/TemplateCategoryBlogPost'
import ChapterIcon from '@manuscripts/assets/react/TemplateCategoryBook'
import DissertationIcon from '@manuscripts/assets/react/TemplateCategoryDissertation'
import EssayIcon from '@manuscripts/assets/react/TemplateCategoryEssay'
import PatentIcon from '@manuscripts/assets/react/TemplateCategoryGrantApplication'
import ManualIcon from '@manuscripts/assets/react/TemplateCategoryManual'
import ResearchIcon from '@manuscripts/assets/react/TemplateCategoryResearchArticle'
import { ManuscriptCategory } from '@manuscripts/manuscripts-json-schema'
import { ToggleButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Slider } from '../Slider'
import { TemplateCategory } from './TemplateCategory'

const Categories = styled.nav.attrs(props => ({ role: 'navigation' }))`
  margin: 0 64px 40px;
  position: relative;

  @media (max-width: 450px) {
    margin-left: 70px;
    margin-right: 70px;
  }
`

const Category = styled(ToggleButton)<{ selected: boolean }>`
  align-items: center;
  border-radius: ${props => props.theme.grid.radius.small};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
`

const CategoryName = styled.span`
  padding-left: 10px;
`

const icons: { [key: string]: JSX.Element } = {
  Essay: <EssayIcon />,
  Research: <ResearchIcon />,
  Dissertation: <DissertationIcon />,
  Chapter: <ChapterIcon />,
  Patent: <PatentIcon />,
  Blog: <BlogIcon />,
  Manual: <ManualIcon />,
}

const CategoryIcon: React.FunctionComponent<{ name?: string }> = ({ name }) =>
  name && icons[name] ? icons[name] : null

interface Props {
  options: ManuscriptCategory[]
  value: string
  handleChange: (value: string) => void
}

export const TemplateCategorySelector: React.FunctionComponent<Props> = ({
  options,
  handleChange,
  value,
}) => (
  <Categories>
    <Slider>
      {options.map(category => (
        <TemplateCategory isSelected={value === category._id}>
          <Category
            autoFocus={value === category._id}
            key={category._id}
            title={category.desc}
            selected={value === category._id}
            onClick={() => handleChange(category._id)}
          >
            <CategoryIcon name={category.imageName} />
            <CategoryName>{category.name}</CategoryName>
          </Category>
        </TemplateCategory>
      ))}
    </Slider>
  </Categories>
)
