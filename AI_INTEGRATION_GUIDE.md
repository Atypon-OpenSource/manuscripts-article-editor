# AI Integration for Manuscript Analysis

## Overview

This platform integrates three revolutionary AI systems designed specifically for "The Mathematics of Vietnam" and similar data-driven narratives:

1. **Social Physics Engine** - Behavioral modeling with vector mathematics
2. **Sacred Data Engine** - Treating data points as narrative soul
3. **Integration Hub** - OAuth, workflows, and external tools

## Philosophy: Data Points as Narrative Truth

In traditional editing, numbers are just details to verify. In "The Mathematics of Vietnam," **data points ARE the story**. When Duc counts "Forty-three" children, that's not metadata - it's the **moral weight of the entire narrative**.

### The Sacred Data Principle

```typescript
// Every data point carries:
- Moral weight (0.0 to 1.0)
- Chain of custody (who verified it, when, why)
- Narrative function (what does this number mean?)
- Verification sources (historical, textual, mathematical)
```

When you have:
- **31 children** in Chapter 25
- **68 children** in the PDF insert
- **43 children** in Chapter 30

This isn't just an inconsistency - it's a **violation of narrative integrity**. The climax depends on Duc counting exactly **43**. That number is sacred.

## Social Physics Engine

Models human behavior using vector mathematics and behavioral schemas.

### Core Formula

```
M_survival = lim(t→0) Σ(α_tactical + β_carnalismo) / γ_bureaucracy
```

Where:
- `α_tactical` = Tactical geometry and positioning
- `β_carnalismo` = Human solidarity and moral imperative
- `γ_bureaucracy` = Systematic dehumanization
- `t→0` = Time running out creates binary outcomes

### Behavior Vectors

Every character has a 3D behavior vector:
```typescript
{
  x: ideological_dimension,  // Belief system
  y: emotional_dimension,    // Feeling state
  z: tactical_dimension      // Action capacity
}
```

### Pre-defined Schemas

1. **Barrio Cognition**
   - Vector: `(0.4, 0.6, 0.8)` - High tactical awareness
   - Cultural markers: `carnal, familia, mijo, barrio`
   - Trigger: Environmental threat + familia protection

2. **Carnalismo** (Brotherhood Beyond Blood)
   - Vector: `(0.9, 0.8, 0.4)` - High moral imperative
   - Cultural markers: `carnales, por los niños`
   - Trigger: Vulnerable people threatened

3. **Yaqui Ancestral Memory**
   - Vector: `(0.8, 0.5, 0.6)` - Spiritual threat detection
   - Cultural markers: `albahaca, abuela, ancestral`
   - Trigger: Sensory pattern recognition

4. **Military Bureaucracy**
   - Vector: `(-0.7, -0.5, 0.3)` - Dehumanization
   - Cultural markers: `body count, kill ratio, pacification`
   - Represents the system Ramos fights against

5. **Foreign Legion Honor**
   - Vector: `(0.9, 0.6, 0.9)` - Last stand mentality
   - Cultural markers: `CAMERONE, last stand`
   - Historical precedent for Sacred Heart defense

### Usage Example

```typescript
import { SocialPhysicsEngine } from './lib/ai'

// Calculate survival probability for Chapter 30
const tension = SocialPhysicsEngine.calculateNarrativeTension(
  'chapter_30',
  characters, // Array of character behavior states
  0.9,        // Threat level (0.0 to 1.0)
  0.05        // Time remaining (nearly zero = critical)
)

console.log(tension.survivalProbability)  // ~0.45 (tense!)
console.log(tension.criticalMoment)       // true
```

## Sacred Data Engine

Treats every measurement as a narrative anchor with full provenance.

### Data Point Structure

```typescript
{
  id: "chapter_30_children_285_1234567890",
  type: "count",
  category: "children",
  value: 43,
  chapterId: "chapter_30",
  lineNumber: 285,
  context: "Forty-three. Forty-three.",
  moralWeight: 1.0,  // CRITICAL - this is the climax
  narrativeAnchor: true,
  chainOfCustody: [
    {
      action: "created",
      chapterId: "chapter_30",
      newValue: 43,
      reason: "Duc's final count",
      timestamp: "2026-07-23T04:00:00Z",
      actor: "author"
    }
  ]
}
```

### Counting Moments

When a **character** counts something, it's not just data - it's **bearing witness**:

```typescript
SacredDataEngine.recordCountingMoment(
  'duc',           // Character ID
  'chapter_30',    // Chapter
  'children',      // What was counted
  43,              // The count
  285,             // Line number
  '"Forty-three. Forty-three."',
  true             // This is a RITUAL - sacred counting
)
```

This creates:
- A data point with `moralWeight: 1.0`
- A counting moment flagged as `ritual: true`
- A narrative anchor for the entire manuscript

### Data Integrity Validation

```typescript
const report = SacredDataEngine.generateIntegrityReport('sgt_ramos')

console.log(report.integrityScore)  // 0.75 (needs work)
console.log(report.conflictingPoints)
// [
//   {
//     dataPoints: [31, 68, 43],
//     conflictType: "value_mismatch",
//     severity: "critical",
//     description: "children has inconsistent values",
//     resolution: {
//       canonicalValue: 43,
//       reason: "Highest moral weight - climactic count",
//       chaptersToUpdate: ["chapter_25", "sh_mission_pdf"]
//     }
//   }
// ]
```

### Recommendations Output

```
CRITICAL: Resolve 1 critical data conflicts before publication
  - children has inconsistent values: 43 vs 31, 68
    → Update: chapter_25, sh_mission_pdf
    → Set to: 43
```

## Integration Architecture

### OAuth Manager

Connect to Google Drive, GitHub, Dropbox, OneDrive:

```typescript
import { OAuthManager, OAUTH_PROVIDERS } from './lib/integrations'

// Initiate Google Drive connection
await OAuthManager.initiateOAuth(
  'google',
  'YOUR_CLIENT_ID',
  'http://localhost:3000/oauth/callback'
)

// Check if connected
if (OAuthManager.isConnected('google')) {
  const token = OAuthManager.getToken('google')
  // Use token for API calls
}
```

### Workflow Automation

Automate backups, commits, validations:

```typescript
import { WorkflowEngine } from './lib/integrations'

// Create auto-backup workflow
const workflow = {
  id: 'auto-backup',
  name: 'Auto-backup to Google Drive',
  description: 'Backup manuscript every hour',
  enabled: true,
  trigger: 'interval',
  actions: [
    {
      type: 'backup_google_drive',
      settings: { intervalMinutes: 60, folder: 'Manuscripts/SGT_RAMOS' }
    }
  ],
  runCount: 0,
  createdAt: new Date().toISOString()
}

WorkflowEngine.saveWorkflow(workflow)
```

## Complete Analysis Workflow

### Step 1: Load Chapter

```typescript
const chapterText = `
George counted them. Thirty-one children. The eldest maybe fifteen.
The youngest could not have been three...
`

const chapterId = 'chapter_25'
```

### Step 2: Extract Sacred Data Points

```typescript
import { SacredDataEngine } from './lib/ai'

// Extract the count
const dataPoint = SacredDataEngine.createDataPoint(
  'count',
  'children',
  31,
  chapterId,
  1,
  'George counted them. Thirty-one children.',
  0.8  // High moral weight
)
```

### Step 3: Validate Against Other Chapters

```typescript
const validation = SacredDataEngine.validateDataConsistency('children')

if (!validation.consistent) {
  console.warn('CONFLICT DETECTED:')
  validation.conflicts.forEach(conflict => {
    console.log(`  ${conflict.description}`)
    console.log(`  Canonical value: ${conflict.resolution.canonicalValue}`)
    console.log(`  Update chapters: ${conflict.resolution.chaptersToUpdate}`)
  })
}
```

### Step 4: Analyze Character Behavior

```typescript
import { SocialPhysicsEngine } from './lib/ai'

// Model Ramos's behavior
const ramosVector = SocialPhysicsEngine.createVector(
  0.7,  // Ideological: anti-bureaucracy
  0.8,  // Emotional: protective (Por los niños)
  0.9   // Tactical: barrio cognition
)

const validation = SocialPhysicsEngine.validateBehavior(
  'ramos',
  chapterId,
  ['threat_detection', 'protective_stance'],
  ['familia', 'carnal', 'por los niños'],
  ramosVector
)

console.log(`Schema match: ${(validation.schemaMatch * 100).toFixed(1)}%`)
// Expected: ~85% match with "Barrio Cognition" schema
```

### Step 5: Calculate Narrative Tension

```typescript
const tension = SocialPhysicsEngine.calculateNarrativeTension(
  chapterId,
  [ramosState, martinezState, hendersonState],  // All characters
  0.7,  // Threat level
  0.5   // Time remaining (moderate urgency)
)

console.log(`Survival probability: ${(tension.survivalProbability * 100).toFixed(1)}%`)
console.log(`Tactical component (α): ${tension.tacticalComponent.toFixed(2)}`)
console.log(`Human component (β): ${tension.humanComponent.toFixed(2)}`)
console.log(`Bureaucratic resistance (γ): ${tension.bureaucraticResistance.toFixed(2)}`)
```

### Step 6: Generate Full Report

```typescript
const integrityReport = SacredDataEngine.generateIntegrityReport('sgt_ramos')

console.log(`
Manuscript Integrity Report
===========================
Data Points: ${integrityReport.totalDataPoints}
Verified: ${integrityReport.verifiedPoints}
Integrity Score: ${(integrityReport.integrityScore * 100).toFixed(1)}%

Critical Anchors:
${integrityReport.criticalAnchors.map(id => `  - ${id}`).join('\n')}

Recommendations:
${integrityReport.recommendations.join('\n')}
`)
```

## UI Integration

The AI Assistant component in the sidebar provides access to all these features:

1. **Outline Tab** - Standard manuscript outline
2. **AI Assistant Tab** - Analysis and validation

### Features in UI:

- Real-time data integrity checking
- Character consistency validation
- Historical fact verification
- Behavioral schema matching
- Social physics calculations

## API Endpoints (Future)

When connected to an AI service, enable:

```typescript
POST /api/ai/analyze-chapter
{
  "chapterId": "chapter_30",
  "content": "...",
  "previousChapters": [...]
}

Response:
{
  "dataPoints": [...],
  "behaviors": [...],
  "tension": {...},
  "integrity": {...}
}
```

## Best Practices

### 1. Establish Canon Early

Define your canonical data points in Chapter 30 (the climax), then work backwards to ensure all previous mentions align.

### 2. Use High Moral Weight Sparingly

Only 1-3 data points should have `moralWeight: 1.0`. These are the **soul** of your narrative.

### 3. Track Character Vectors

As characters evolve, their behavior vectors should change gradually. Sudden jumps indicate inconsistency.

### 4. Honor the Mathematics

The survival formula isn't just decoration - it should actually calculate based on your narrative choices.

## Example: Resolving the 31/68/43 Conflict

```typescript
// Chapter 30 establishes canon: 43 children
const canonical = SacredDataEngine.createDataPoint(
  'count',
  'children',
  43,
  'chapter_30',
  285,
  'Forty-three. Forty-three.',
  1.0  // Maximum moral weight - this is THE count
)

// Mark as ritual counting
SacredDataEngine.recordCountingMoment(
  'duc',
  'chapter_30',
  'children',
  43,
  285,
  'Each child counted was a debt the dead had paid',
  true  // This is a sacred ritual
)

// Generate report - will flag chapters 25 and PDF as needing updates
const report = SacredDataEngine.generateIntegrityReport('sgt_ramos')

// Follow the recommendations to update all prior references to 43
```

## Chain of Custody Example

```json
{
  "value": 43,
  "chainOfCustody": [
    {
      "action": "created",
      "chapterId": "chapter_30",
      "newValue": 43,
      "reason": "Duc's climactic count - ritual witnessing",
      "timestamp": "2026-01-15T10:00:00Z",
      "actor": "author"
    },
    {
      "action": "verified",
      "chapterId": "chapter_30",
      "reason": "Cross-referenced with chapter 25",
      "timestamp": "2026-02-01T14:30:00Z",
      "actor": "ai_analysis"
    },
    {
      "action": "updated",
      "chapterId": "chapter_25",
      "previousValue": 31,
      "newValue": 43,
      "reason": "Retroactive correction for narrative consistency",
      "timestamp": "2026-02-01T15:00:00Z",
      "actor": "editor"
    }
  ]
}
```

## Conclusion

This isn't just a validation system - it's a **narrative integrity framework** where mathematics and storytelling are inseparable. Every data point is a promise, every count is an oath, and every number carries the weight of the lives it represents.

The data points **are** the soul of the novel.
