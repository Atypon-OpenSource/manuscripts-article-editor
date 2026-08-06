/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE.
 */

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useStore } from '../../store'
import { TextSelection } from 'prosemirror-state'

export type AIAssistantMode =
  | 'suggest'
  | 'expand'
  | 'summarize'
  | 'improve'
  | 'cite'
  | 'rephrase'

export interface AIWritingAssistantProps {
  onClose?: () => void
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  onClose,
}) => {
  const [{ view }] = useStore((s) => ({ view: s.view }))
  const [mode, setMode] = useState<AIAssistantMode>('suggest')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const getSelectedText = useCallback(() => {
    if (!view) return ''
    const { state } = view
    const { from, to } = state.selection
    return state.doc.textBetween(from, to, ' ')
  }, [view])

  const insertTextAtCursor = useCallback(
    (text: string) => {
      if (!view) return
      const { state, dispatch } = view
      const { from, to } = state.selection
      const tr = state.tr.replaceWith(from, to, state.schema.text(text))
      dispatch(tr)
      view.focus()
    },
    [view]
  )

  const handleGenerate = useCallback(async () => {
    if (!view) return

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const selectedText = getSelectedText()
      const contextText = selectedText || prompt

      if (!contextText.trim()) {
        throw new Error('Please provide some text or select content to work with.')
      }

      // TODO: Replace with actual AI API endpoint
      const apiResponse = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          text: contextText,
          prompt: prompt,
        }),
      })

      if (!apiResponse.ok) {
        throw new Error(`AI service error: ${apiResponse.status}`)
      }

      const data = await apiResponse.json()
      setResponse(data.suggestion || data.result || '')
    } catch (err) {
      setError((err as Error).message)
      // Fallback demo response for development
      setResponse(getDemoResponse(mode, prompt))
    } finally {
      setIsLoading(false)
    }
  }, [view, mode, prompt, getSelectedText])

  const handleInsert = useCallback(() => {
    if (response) {
      insertTextAtCursor(response)
      setResponse('')
      setPrompt('')
    }
  }, [response, insertTextAtCursor])

  return (
    <Container data-cy="ai-writing-assistant">
      <Header>
        <Title>AI Writing Assistant</Title>
        {onClose && <CloseButton onClick={onClose}>×</CloseButton>}
      </Header>

      <ModeSelector>
        <ModeButton
          $active={mode === 'suggest'}
          onClick={() => setMode('suggest')}
          title="Get writing suggestions"
        >
          💡 Suggest
        </ModeButton>
        <ModeButton
          $active={mode === 'expand'}
          onClick={() => setMode('expand')}
          title="Expand selected text"
        >
          📝 Expand
        </ModeButton>
        <ModeButton
          $active={mode === 'summarize'}
          onClick={() => setMode('summarize')}
          title="Summarize content"
        >
          📋 Summarize
        </ModeButton>
        <ModeButton
          $active={mode === 'improve'}
          onClick={() => setMode('improve')}
          title="Improve clarity and style"
        >
          ✨ Improve
        </ModeButton>
        <ModeButton
          $active={mode === 'rephrase'}
          onClick={() => setMode('rephrase')}
          title="Rephrase in different words"
        >
          🔄 Rephrase
        </ModeButton>
        <ModeButton
          $active={mode === 'cite'}
          onClick={() => setMode('cite')}
          title="Suggest citations"
        >
          📚 Cite
        </ModeButton>
      </ModeSelector>

      <InputSection>
        <Label>
          {getSelectedText()
            ? 'Working with selected text'
            : 'Enter your prompt or select text in the editor'}
        </Label>
        <PromptInput
          placeholder={getModePlaceholder(mode)}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <GenerateButton onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </GenerateButton>
      </InputSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {response && (
        <ResponseSection>
          <Label>Suggestion:</Label>
          <ResponseText>{response}</ResponseText>
          <ActionButtons>
            <InsertButton onClick={handleInsert}>
              Insert into Editor
            </InsertButton>
            <ClearButton onClick={() => setResponse('')}>Clear</ClearButton>
          </ActionButtons>
        </ResponseSection>
      )}

      <InfoText>
        💡 Tip: Select text in the editor first, then choose a mode to get
        context-aware suggestions.
      </InfoText>
    </Container>
  )
}

const getDemoResponse = (mode: AIAssistantMode, prompt: string): string => {
  switch (mode) {
    case 'suggest':
      return 'Consider adding supporting evidence from recent studies. Expand on the methodology to clarify the experimental design.'
    case 'expand':
      return `${prompt}\n\nFurthermore, this finding aligns with established theories in the field and suggests new avenues for investigation. The implications extend beyond the immediate scope of this study.`
    case 'summarize':
      return 'This section discusses the methodology and presents preliminary findings, highlighting three key observations that warrant further investigation.'
    case 'improve':
      return prompt.replace(/\./g, '; ') + ' This formulation enhances clarity and flow.'
    case 'rephrase':
      return 'Alternative phrasing: ' + prompt.split(' ').reverse().join(' ')
    case 'cite':
      return '(Author et al., 2023; Researcher & Colleague, 2024)'
    default:
      return 'AI suggestion will appear here.'
  }
}

const getModePlaceholder = (mode: AIAssistantMode): string => {
  switch (mode) {
    case 'suggest':
      return 'Describe what you want to write about...'
    case 'expand':
      return 'Select text or describe what to expand...'
    case 'summarize':
      return 'Select content to summarize...'
    case 'improve':
      return 'Select text to improve...'
    case 'rephrase':
      return 'Select text to rephrase...'
    case 'cite':
      return 'Describe the claim that needs citation...'
    default:
      return 'Enter your request...'
  }
}

const Container = styled.div`
  background: ${(props) => props.theme.colors.background.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text.secondary};
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`

const ModeSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ModeButton = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active
      ? props.theme.colors.button.primary.background.default
      : props.theme.colors.background.secondary};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.button.primary.color.default
      : props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$active
        ? props.theme.colors.button.primary.background.hover
        : props.theme.colors.background.tertiary};
  }
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.secondary};
`

const PromptInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: 4px;
  font-family: ${(props) => props.theme.font.family.Lato};
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.outline.focus};
    outline-offset: 2px;
  }
`

const GenerateButton = styled.button`
  background: ${(props) =>
    props.theme.colors.button.primary.background.default};
  color: ${(props) => props.theme.colors.button.primary.color.default};
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.theme.colors.button.primary.background.hover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ResponseSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${(props) => props.theme.colors.background.secondary};
  padding: 12px;
  border-radius: 4px;
`

const ResponseText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text.primary};
  white-space: pre-wrap;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const InsertButton = styled.button`
  background: ${(props) =>
    props.theme.colors.button.primary.background.default};
  color: ${(props) => props.theme.colors.button.primary.color.default};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.theme.colors.button.primary.background.hover};
  }
`

const ClearButton = styled.button`
  background: transparent;
  color: ${(props) => props.theme.colors.text.secondary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.tertiary};
  }
`

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.text.error};
  font-size: 13px;
  padding: 8px;
  background: ${(props) => props.theme.colors.background.error};
  border-radius: 4px;
`

const InfoText = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
`
