/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BlogIcon from '@manuscripts/assets/react/TemplateCategoryBlogPost'
import ChapterIcon from '@manuscripts/assets/react/TemplateCategoryBook'
import DissertationIcon from '@manuscripts/assets/react/TemplateCategoryDissertation'
import EssayIcon from '@manuscripts/assets/react/TemplateCategoryEssay'
import PatentIcon from '@manuscripts/assets/react/TemplateCategoryGrantApplication'
import ManualIcon from '@manuscripts/assets/react/TemplateCategoryManual'
import ResearchIcon from '@manuscripts/assets/react/TemplateCategoryResearchArticle'
import { ManuscriptCategory } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'

const Categories = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Category = styled.div<{ selected: boolean }>`
  display: flex;
  font-weight: 500;
  font-size: 18px;
  padding: 8px 20px;
  cursor: pointer;
  align-items: center;
  color: ${props => props.theme.colors.sidebar.text.primary};
  background-color: ${props =>
    props.selected
      ? props.theme.colors.sidebar.background.selected
      : 'inherit'};

  &:hover {
    background-color: ${props =>
      props.theme.colors.sidebar.background.selected};
  }
`

const CategoryName = styled.div`
  padding-left: 10px;
`

const CategoryIconContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
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
    {options.map(category => (
      <Category
        key={category._id}
        title={category.desc}
        selected={value === category._id}
        onClick={() => handleChange(category._id)}
      >
        <CategoryIconContainer>
          <CategoryIcon name={category.imageName} />
        </CategoryIconContainer>

        <CategoryName>{category.name}</CategoryName>
      </Category>
    ))}
  </Categories>
)
