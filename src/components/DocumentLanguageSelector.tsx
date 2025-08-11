/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import isoLanguages from '@cospired/i18n-iso-languages'
import {
  DropdownContainer,
  DropdownList,
  TickIcon,
  TriangleCollapsedIcon,
} from '@manuscripts/style-guide'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { useStore } from '../store/useStore'

interface LanguageOption {
  code: string
  name: string
  nativeName?: string
  isCommon?: boolean
}

interface DocumentLanguageSelectorProps {
  onCloseParent?: () => void
}

// Native names lookup for common languages
const NATIVE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية',
}

const COMMON_LANGUAGES = Object.keys(NATIVE_NAMES)

// Get display name for selected language
const getSelectedLanguageName = (
  selectedLanguage: string,
  allLanguages: LanguageOption[]
): string => {
  if (!allLanguages.length) {
    return 'English (Default)'
  }

  const lang =
    allLanguages.find((l) => l.code === selectedLanguage) ||
    allLanguages.find((l) => l.code === 'en')

  if (!lang) {
    return 'English (Default)'
  }

  return lang.code === 'en'
    ? 'English (Default)'
    : `${lang.name}${lang.nativeName ? ` (${lang.nativeName})` : ''}`
}

const LanguageOptionItem: React.FC<{
  language: LanguageOption
  isSelected: boolean
  onSelect: (event: React.MouseEvent, languageCode: string) => void
}> = ({ language, isSelected, onSelect }) => (
  <LanguageOption
    key={language.code}
    onClick={(event) => onSelect(event, language.code)}
  >
    {language.name}
    {language.nativeName && ` (${language.nativeName})`}
    {isSelected && (
      <TickIconWrapper>
        <TickIcon />
      </TickIconWrapper>
    )}
  </LanguageOption>
)

const DocumentLanguageSelector: React.FC<DocumentLanguageSelectorProps> = ({
  onCloseParent,
}) => {
  const [storeState] = useStore((s) => ({
    doc: s.doc,
    view: s.view,
  }))

  // Get selected language from document's primaryLanguageCode or default to 'en'
  const selectedLanguage = storeState.doc?.attrs?.primaryLanguageCode || 'en'
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [allLanguages, setAllLanguages] = useState<LanguageOption[]>([])
  const submenuRef = useRef<HTMLDivElement>(null)

// Initialize language data and load all languages
useEffect(() => {
  const loadLanguages = async () => {
    try {
      // Dynamically import the English language data
      const englishLanguageData = await import(
        '@cospired/i18n-iso-languages/langs/en.json'
      )
      isoLanguages.registerLocale(englishLanguageData.default)

      // Get all available language codes
      const languageCodes = isoLanguages.getAlpha2Codes()
      const languagesList = Object.keys(languageCodes).map((code) => ({
        code,
        name: isoLanguages.getName(code, 'en') || code,
        nativeName:
          NATIVE_NAMES[code] || isoLanguages.getName(code, code) || undefined,
        isCommon: COMMON_LANGUAGES.includes(code),
      }))

      setAllLanguages(languagesList)
    } catch (error) {
      console.error('Failed to load language data:', error)
      // Fallback to English only if loading fails
      setAllLanguages([{
        code: 'en',
        name: 'English',
        nativeName: 'English',
        isCommon: true
      }])
    }
  }

  loadLanguages()
}, [])

  // Prepare language options with common languages first
  const languageOptions = useMemo(() => {
    return [...allLanguages].sort((a, b) => {
      // Sort common languages first
      if (a.isCommon && !b.isCommon) return -1
      if (!a.isCommon && b.isCommon) return 1
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name)
    })
  }, [allLanguages])



  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Element)
      ) {
        setIsSubmenuOpen(false)
        onCloseParent?.()
      }
    }

    if (isSubmenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSubmenuOpen, onCloseParent])

  const handleLanguageButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsSubmenuOpen(!isSubmenuOpen)
  }

  const handleLanguageSelect = (
    event: React.MouseEvent,
    languageCode: string
  ) => {
    event.stopPropagation()
    if (storeState.view) {
      const { state, dispatch } = storeState.view
      const tr = state.tr
      tr.setDocAttribute('primaryLanguageCode', languageCode)
      dispatch(tr)
    }
  }

  return (
    <DropdownContainer ref={submenuRef}>
      <LanguageSelectorButton onClick={handleLanguageButtonClick}>
        <LanguageHeader>
          <LanguageLabel>
            Document language <TriangleCollapsedIcon />
          </LanguageLabel>
          <SelectedLanguageText>
            {getSelectedLanguageName(selectedLanguage, allLanguages)}
          </SelectedLanguageText>
        </LanguageHeader>
      </LanguageSelectorButton>

      {isSubmenuOpen && (
        <StyledDropdownList direction="right" width={231} top={18} height={400}>
          {languageOptions.map((language) => (
            <LanguageOptionItem
              key={language.code}
              language={language}
              isSelected={selectedLanguage === language.code}
              onSelect={handleLanguageSelect}
            />
          ))}
        </StyledDropdownList>
      )}
    </DropdownContainer>
  )
}

export default DocumentLanguageSelector

const StyledDropdownList = styled(DropdownList)`
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background.secondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6e6e6e;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #6e6e6e;
  }
`

const LanguageSelectorButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 10px 16px;
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

const LanguageHeader = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const LanguageLabel = styled.span`
  display: flex;
  align-items: center;

  svg {
    top: 10px;
    right: -10px;
    position: relative;
  }
`

const SelectedLanguageText = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 2px;
`

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 10px 16px;
`

const TickIconWrapper = styled.div`
  svg path {
    fill: #6e6e6e;
  }
`
