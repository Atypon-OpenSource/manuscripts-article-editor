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
import englishLanguageData from '@cospired/i18n-iso-languages/langs/en.json'
import { TickIcon, TriangleCollapsedIcon } from '@manuscripts/style-guide'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

interface LanguageOption {
  code: string
  name: string
  nativeName?: string
  isCommon?: boolean
}

interface DocumentLanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange?: (languageCode: string) => void
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

const DocumentLanguageSelector: React.FC<DocumentLanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  onCloseParent,
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [allLanguages, setAllLanguages] = useState<LanguageOption[]>([])
  const submenuRef = useRef<HTMLDivElement>(null)

  // Initialize language data and load all languages
  useEffect(() => {
    isoLanguages.registerLocale(englishLanguageData)

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
  }, [])

  // Prepare language options with common languages first
  const languageOptions = useMemo(() => {
    const common = allLanguages.filter((lang) => lang.isCommon)
    const others = allLanguages.filter((lang) => !lang.isCommon)

    return [...common, ...others]
  }, [allLanguages])

  // Get display name for selected language
  const getSelectedLanguageName = () => {
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
    onLanguageChange?.(languageCode)
  }

  return (
    <Container ref={submenuRef}>
      <LanguageSelectorButton onClick={handleLanguageButtonClick}>
        <LanguageHeader>
          <LanguageLabel>
            Document language <TriangleCollapsedIcon />
          </LanguageLabel>
          <SelectedLanguageText>
            {getSelectedLanguageName()}
          </SelectedLanguageText>
        </LanguageHeader>
      </LanguageSelectorButton>

      {isSubmenuOpen && (
        <LanguageSubmenu>
          {/* Common languages section */}
          {languageOptions.filter((lang) => lang.isCommon).length > 0 && (
            <>
              {languageOptions
                .filter((lang) => lang.isCommon)
                .map((language) => (
                  <LanguageOption
                    key={language.code}
                    onClick={(event) =>
                      handleLanguageSelect(event, language.code)
                    }
                    $isSelected={selectedLanguage === language.code}
                  >
                    {language.name}
                    {language.nativeName && ` (${language.nativeName})`}
                    {selectedLanguage === language.code && (
                      <TickIconWrapper>
                        <TickIcon />
                      </TickIconWrapper>
                    )}
                  </LanguageOption>
                ))}
            </>
          )}

          {/* All other languages */}
          {languageOptions
            .filter((lang) => !lang.isCommon)
            .map((language) => (
              <LanguageOption
                key={language.code}
                onClick={(event) => handleLanguageSelect(event, language.code)}
                $isSelected={selectedLanguage === language.code}
              >
                {language.name}
                {language.nativeName && ` (${language.nativeName})`}
                {selectedLanguage === language.code && (
                  <TickIconWrapper>
                    <TickIcon />
                  </TickIconWrapper>
                )}
              </LanguageOption>
            ))}
        </LanguageSubmenu>
      )}
    </Container>
  )
}

export default DocumentLanguageSelector

const Container = styled.div`
  position: relative;
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

const LanguageSubmenu = styled.div`
  position: absolute;
  top: 71px;
  right: 0;
  background: ${(props) => props.theme.colors.background.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  min-width: 231px;
  z-index: 9999;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`

const LanguageOption = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 10px 16px;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }

  ${(props) =>
    props.$isSelected &&
    `
    background: ${props.theme.colors.background.fifth};
  `}
`

const TickIconWrapper = styled.div`
  svg path {
    fill: #e6e6e;
  }
`
