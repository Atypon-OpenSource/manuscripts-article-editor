# AI Writing Assistant

## Overview

The AI Writing Assistant is an integrated tool that helps manuscript authors draft, improve, and refine their scientific writing directly within the editor interface.

## Features

### Writing Modes

1. **💡 Suggest** - Get contextual writing suggestions based on your current content
2. **📝 Expand** - Elaborate on selected text or concepts with additional detail
3. **📋 Summarize** - Create concise summaries of selected content
4. **✨ Improve** - Enhance clarity, style, and readability
5. **🔄 Rephrase** - Reword text while maintaining the original meaning
6. **📚 Cite** - Suggest appropriate citations for claims and statements

## Usage

### Accessing the Assistant

1. Navigate to the manuscript editor
2. Click the **"🤖 AI Assistant"** tab in the right sidebar
3. The assistant panel will appear with all available modes

### Working with Selected Text

1. Select any text in the manuscript editor
2. Switch to the AI Assistant tab
3. Choose a mode (e.g., "Improve" or "Rephrase")
4. Click **Generate** to get AI suggestions
5. Review the suggestion and click **Insert into Editor** to apply

### Using Prompts

For new content generation:
1. Type your request in the prompt field
2. Choose the appropriate mode
3. Click **Generate**
4. Review and insert the generated content

## Integration

The AI Assistant is embedded in `ManuscriptSidebar.tsx` and accessible via a tab interface alongside the manuscript outline.

### Component Architecture

```
ManuscriptSidebar
├── TabBar (Outline / AI Assistant)
└── ContentArea
    ├── ManuscriptOutline
    └── AIWritingAssistant
```

### State Management

- Uses the same Zustand store as the rest of the editor
- Accesses `view` for editor state and transaction dispatch
- Maintains local state for mode selection and responses

## API Integration

### Current Implementation

The assistant includes demo responses for development and testing. To connect a production AI service:

1. Replace the fetch endpoint in `AIWritingAssistant.tsx`:
```typescript
const apiResponse = await fetch('/api/ai/assist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode,
    text: contextText,
    prompt: prompt,
  }),
})
```

2. Configure your AI provider (OpenAI, Anthropic, etc.)
3. Implement the `/api/ai/assist` endpoint with proper authentication

### Expected API Contract

**Request:**
```json
{
  "mode": "suggest" | "expand" | "summarize" | "improve" | "cite" | "rephrase",
  "text": "selected or context text",
  "prompt": "user prompt if provided"
}
```

**Response:**
```json
{
  "suggestion": "AI-generated content",
  "result": "alternative field for result"
}
```

## Security Considerations

### Chain of Custody

AI-assisted content should be tracked in the audit trail to maintain research integrity:

- Consider adding metadata to track AI-modified sections
- Log AI interactions for peer review transparency
- Implement version control for AI-suggested changes

### Data Privacy

- Ensure manuscript content sent to AI providers complies with privacy policies
- Consider implementing local/on-premise AI models for sensitive research
- Add user consent flows for external AI service usage

## Testing

Run the test suite:
```bash
npm test src/components/ai/__tests__/
```

Tests cover:
- Component rendering
- Mode switching
- Text selection and insertion
- Error handling
- Demo response generation

## Future Enhancements

1. **Citation Integration** - Connect to reference databases (PubMed, Crossref)
2. **Style Guides** - Support for journal-specific writing styles
3. **Readability Metrics** - Flesch score, sentence complexity analysis
4. **Plagiarism Detection** - Check for originality
5. **Collaborative Feedback** - Multi-user review and suggestions
6. **Custom Prompts** - User-defined template prompts for common tasks

## Related Documentation

- [SECURITY_INGESTION.md](../SECURITY_INGESTION.md) - External content security
- [External Ingestion API](../src/lib/external-ingestion.ts) - File import chain of custody
