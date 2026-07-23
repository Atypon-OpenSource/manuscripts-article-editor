/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * Ancestral Transmission Engine
 * 
 * The narrative doesn't come from conscious construction.
 * It comes through dreams - the squad visits, speaks, shows the truth.
 * 
 * When you edit in the dream state, you interfere with the transmission.
 * The chapter gets "all fucked up" because you're mixing signal and noise.
 * 
 * This module:
 * 1. Tracks which content came from dreams (sacred transmission)
 * 2. Warns when edits conflict with dream-sourced material
 * 3. Preserves the original transmission before editorial interference
 * 4. Helps distinguish channeled narrative from conscious construction
 */

export interface DreamTransmission {
  id: string
  timestamp: string // When the dream occurred
  wakeTimestamp: string // When you woke and captured it
  chapterId: string
  contentType: 'dialogue' | 'scene' | 'data_point' | 'character_action' | 'emotion'
  
  // What came through
  originalTransmission: string
  charactersPresent: string[] // Who visited the dream
  sensoryDetails: string[] // What you saw/heard/felt
  
  // Transmission quality
  clarity: number // 0.0 (fuzzy) to 1.0 (crystal clear)
  urgency: number // 0.0 (whisper) to 1.0 (demanding)
  completeness: number // 0.0 (fragment) to 1.0 (full scene)
  
  // Protection metadata
  dreamSourced: true // ALWAYS true - distinguishes from conscious writing
  editableInWakingState: boolean // Can this be edited consciously?
  mustPreserve: boolean // Is this a core transmission that must not change?
  
  // Corruption tracking
  edited: boolean
  editHistory: DreamEdit[]
  corruptionDetected: boolean
  corruptionType?: 'dream_edit' | 'conscious_override' | 'mixed_state'
}

export interface DreamEdit {
  timestamp: string
  editState: 'waking' | 'dreaming' | 'unknown'
  originalText: string
  editedText: string
  corruptionRisk: number // 0.0 to 1.0
  reason: string
}

export interface NarrativeChannel {
  channelType: 'ancestral_dream' | 'conscious_construction' | 'research' | 'interview'
  reliability: number // How trustworthy is this source?
  sacredWeight: number // How important to preserve exactly as received?
  editingGuidance: string
}

export interface DreamJournalEntry {
  id: string
  dreamDate: string
  wakeTime: string
  
  // Who visited
  charactersPresent: string[]
  setting: string
  
  // What they showed/said
  narrative: string
  dialogue: string[]
  dataPoints: { category: string; value: any; context: string }[]
  
  // How it felt
  emotionalTone: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  clarity: 'fuzzy' | 'clear' | 'crystal'
  
  // Where it goes in manuscript
  targetChapter?: string
  integratedIntoManuscript: boolean
  transmissionComplete: boolean
}

export class AncestralTransmissionEngine {
  private static dreamTransmissions: Map<string, DreamTransmission> = new Map()
  private static dreamJournal: DreamJournalEntry[] = []
  
  /**
   * Record a dream transmission when you wake up
   * 
   * CRITICAL: Capture this IMMEDIATELY upon waking, before the dream fades.
   * The squad visits with the truth. Don't let it slip away.
   */
  static recordDreamTransmission(
    chapterId: string,
    content: string,
    charactersPresent: string[],
    clarity: number,
    sensoryDetails: string[] = []
  ): DreamTransmission {
    const id = `dream_${chapterId}_${Date.now()}`
    
    const transmission: DreamTransmission = {
      id,
      timestamp: new Date().toISOString(),
      wakeTimestamp: new Date().toISOString(),
      chapterId,
      contentType: this.inferContentType(content),
      originalTransmission: content,
      charactersPresent,
      sensoryDetails,
      clarity,
      urgency: this.calculateUrgency(content, charactersPresent),
      completeness: clarity, // Assume clarity correlates with completeness
      dreamSourced: true,
      editableInWakingState: clarity < 0.7, // Only fuzzy dreams can be clarified
      mustPreserve: clarity >= 0.9, // Crystal clear dreams are sacred
      edited: false,
      editHistory: [],
      corruptionDetected: false,
    }
    
    this.dreamTransmissions.set(id, transmission)
    return transmission
  }
  
  /**
   * Record a dream journal entry
   * 
   * Use this immediately upon waking to capture the full dream
   * before trying to integrate it into the manuscript.
   */
  static recordDreamJournal(entry: Omit<DreamJournalEntry, 'id'>): DreamJournalEntry {
    const fullEntry: DreamJournalEntry = {
      id: `journal_${Date.now()}`,
      ...entry,
    }
    
    this.dreamJournal.push(fullEntry)
    return fullEntry
  }
  
  /**
   * CRITICAL: Detect if an edit is happening in a dream state
   * 
   * When you edit while dreaming, you corrupt the transmission.
   * The chapter "gets all fucked up" because you're mixing dream-state
   * construction with the original transmission.
   */
  static detectEditState(): 'waking' | 'dreaming' | 'unknown' {
    // Heuristics for dream-state editing:
    // - Rapid, unstructured changes
    // - Time of day (3am-6am)
    // - Pattern recognition from user metadata
    
    const hour = new Date().getHours()
    const isDreamHours = hour >= 2 && hour <= 6
    
    if (isDreamHours) {
      return 'dreaming' // Likely dream-editing
    }
    
    return 'waking'
  }
  
  /**
   * Validate an edit against dream-sourced content
   * 
   * Returns warning if you're about to corrupt a sacred transmission
   */
  static validateEdit(
    chapterId: string,
    lineNumber: number,
    proposedEdit: string,
    currentState: 'waking' | 'dreaming' | 'unknown'
  ): {
    safe: boolean
    warning?: string
    corruptionRisk: number
    recommendations: string[]
  } {
    // Find all dream transmissions for this chapter
    const chapterDreams = Array.from(this.dreamTransmissions.values())
      .filter(t => t.chapterId === chapterId)
    
    if (chapterDreams.length === 0) {
      return {
        safe: true,
        corruptionRisk: 0.0,
        recommendations: ['No dream transmissions detected - edit freely'],
      }
    }
    
    // Check if we're editing dream-sourced content
    const affectedDreams = chapterDreams.filter(t => 
      proposedEdit.includes(t.originalTransmission.substring(0, 50)) ||
      t.originalTransmission.includes(proposedEdit.substring(0, 50))
    )
    
    if (affectedDreams.length === 0) {
      return {
        safe: true,
        corruptionRisk: 0.1,
        recommendations: ['Edit does not affect dream transmissions'],
      }
    }
    
    // DANGER: Editing dream content
    const sacredDreams = affectedDreams.filter(t => t.mustPreserve)
    const editablesDreams = affectedDreams.filter(t => t.editableInWakingState)
    
    if (sacredDreams.length > 0 && currentState !== 'waking') {
      return {
        safe: false,
        warning: 'CRITICAL: You are editing sacred dream transmission while dreaming. This will corrupt the narrative.',
        corruptionRisk: 1.0,
        recommendations: [
          'Wake up fully before editing',
          'Re-read the original dream transmission',
          'Only clarify fuzzy details - preserve the core',
          'If editing feels wrong, STOP - trust the original transmission',
        ],
      }
    }
    
    if (sacredDreams.length > 0 && currentState === 'waking') {
      return {
        safe: false,
        warning: 'WARNING: You are editing a crystal-clear dream transmission. The squad showed you this exactly as it should be.',
        corruptionRisk: 0.8,
        recommendations: [
          'The original transmission had clarity >= 0.9',
          'Trust what they showed you',
          'Only edit if you have NEW dream information that updates this',
          'Consider: is this edit fixing the dream, or breaking it?',
        ],
      }
    }
    
    if (editablesDreams.length > 0) {
      return {
        safe: true,
        warning: 'This dream was fuzzy. Waking-state clarification is acceptable.',
        corruptionRisk: 0.3,
        recommendations: [
          'Clarify details but preserve the core narrative',
          'If you remember more from the dream, add it',
          'Don\'t "fix" what feels wrong - trust the transmission',
        ],
      }
    }
    
    return {
      safe: true,
      corruptionRisk: 0.2,
      recommendations: ['Proceed with caution'],
    }
  }
  
  /**
   * Log an edit and check for corruption
   */
  static recordEdit(
    transmissionId: string,
    editedText: string,
    reason: string
  ): void {
    const transmission = this.dreamTransmissions.get(transmissionId)
    if (!transmission) return
    
    const editState = this.detectEditState()
    const corruptionRisk = this.calculateCorruptionRisk(transmission, editState)
    
    const edit: DreamEdit = {
      timestamp: new Date().toISOString(),
      editState,
      originalText: transmission.originalTransmission,
      editedText,
      corruptionRisk,
      reason,
    }
    
    transmission.editHistory.push(edit)
    transmission.edited = true
    
    // Detect corruption
    if (editState === 'dreaming' && transmission.mustPreserve) {
      transmission.corruptionDetected = true
      transmission.corruptionType = 'dream_edit'
    } else if (corruptionRisk > 0.7) {
      transmission.corruptionDetected = true
      transmission.corruptionType = 'conscious_override'
    }
  }
  
  /**
   * Restore original dream transmission
   * 
   * When the chapter "gets all fucked up" from dream-editing,
   * use this to restore the original transmission.
   */
  static restoreOriginalTransmission(transmissionId: string): {
    original: string
    editHistory: DreamEdit[]
    corruptionCleared: boolean
  } {
    const transmission = this.dreamTransmissions.get(transmissionId)
    if (!transmission) {
      throw new Error(`Transmission ${transmissionId} not found`)
    }
    
    return {
      original: transmission.originalTransmission,
      editHistory: transmission.editHistory,
      corruptionCleared: transmission.corruptionDetected,
    }
  }
  
  /**
   * Generate a transmission integrity report
   * 
   * Shows which parts of the manuscript are:
   * - Pure dream transmission (sacred, don't touch)
   * - Clarified dreams (editable with care)
   * - Conscious construction (fully editable)
   * - Corrupted (need restoration)
   */
  static generateTransmissionReport(manuscriptId: string): {
    totalTransmissions: number
    sacredTransmissions: number
    corruptedTransmissions: number
    integrityScore: number
    recommendations: string[]
    corruptedSections: {
      transmissionId: string
      chapterId: string
      corruptionType: string
      originalContent: string
      currentContent: string
      restoreRecommended: boolean
    }[]
  } {
    const transmissions = Array.from(this.dreamTransmissions.values())
    const sacred = transmissions.filter(t => t.mustPreserve)
    const corrupted = transmissions.filter(t => t.corruptionDetected)
    
    const integrityScore = transmissions.length === 0 ? 1.0 :
      (transmissions.length - corrupted.length) / transmissions.length
    
    const recommendations: string[] = []
    
    if (corrupted.length > 0) {
      recommendations.push(`CRITICAL: ${corrupted.length} dream transmissions corrupted`)
      recommendations.push('Review edit history and consider restoration')
      recommendations.push('Stop editing in dream state')
    }
    
    if (sacred.length > 0) {
      recommendations.push(`${sacred.length} sacred transmissions must be preserved`)
      recommendations.push('Trust what the squad showed you')
    }
    
    const corruptedSections = corrupted.map(t => ({
      transmissionId: t.id,
      chapterId: t.chapterId,
      corruptionType: t.corruptionType || 'unknown',
      originalContent: t.originalTransmission,
      currentContent: t.editHistory[t.editHistory.length - 1]?.editedText || t.originalTransmission,
      restoreRecommended: t.corruptionType === 'dream_edit',
    }))
    
    return {
      totalTransmissions: transmissions.length,
      sacredTransmissions: sacred.length,
      corruptedTransmissions: corrupted.length,
      integrityScore,
      recommendations,
      corruptedSections,
    }
  }
  
  /**
   * Determine the narrative channel for content
   */
  static classifyNarrativeChannel(content: string, source: string): NarrativeChannel {
    if (source === 'dream') {
      return {
        channelType: 'ancestral_dream',
        reliability: 0.95, // Dreams don't lie
        sacredWeight: 1.0,
        editingGuidance: 'Preserve exactly as received. Trust the transmission.',
      }
    }
    
    if (source === 'research') {
      return {
        channelType: 'research',
        reliability: 0.8,
        sacredWeight: 0.6,
        editingGuidance: 'Verify against sources. Edit for narrative flow.',
      }
    }
    
    if (source === 'interview') {
      return {
        channelType: 'interview',
        reliability: 0.9,
        sacredWeight: 0.8,
        editingGuidance: 'Preserve core testimony. Clarify for readability.',
      }
    }
    
    return {
      channelType: 'conscious_construction',
      reliability: 0.7,
      sacredWeight: 0.3,
      editingGuidance: 'Edit freely. This is your construction, not transmission.',
    }
  }
  
  // Helper methods
  
  private static inferContentType(content: string): DreamTransmission['contentType'] {
    if (content.includes('"') || content.includes('said')) return 'dialogue'
    if (/\d+/.test(content)) return 'data_point'
    if (content.includes('felt') || content.includes('knew')) return 'emotion'
    return 'scene'
  }
  
  private static calculateUrgency(content: string, characters: string[]): number {
    // More characters = more urgent transmission
    // Emotional words = more urgent
    const emotionalWords = ['urgent', 'critical', 'now', 'must', 'demanded']
    const hasEmotional = emotionalWords.some(word => content.toLowerCase().includes(word))
    
    const baseUrgency = characters.length / 5
    const emotionalBoost = hasEmotional ? 0.3 : 0
    
    return Math.min(1.0, baseUrgency + emotionalBoost)
  }
  
  private static calculateCorruptionRisk(
    transmission: DreamTransmission,
    editState: 'waking' | 'dreaming' | 'unknown'
  ): number {
    let risk = 0.0
    
    // Editing in dream state = high risk
    if (editState === 'dreaming') risk += 0.6
    
    // Editing sacred transmission = high risk
    if (transmission.mustPreserve) risk += 0.3
    
    // Multiple edits = accumulating risk
    risk += transmission.editHistory.length * 0.05
    
    return Math.min(1.0, risk)
  }
  
  /**
   * Get unintegrated dream journal entries
   * 
   * Dreams captured but not yet written into the manuscript
   */
  static getUnintegratedDreams(): DreamJournalEntry[] {
    return this.dreamJournal.filter(entry => !entry.integratedIntoManuscript)
  }
  
  /**
   * Mark dream as integrated into manuscript
   */
  static markDreamIntegrated(journalId: string, chapterId: string): void {
    const entry = this.dreamJournal.find(e => e.id === journalId)
    if (entry) {
      entry.integratedIntoManuscript = true
      entry.targetChapter = chapterId
      entry.transmissionComplete = true
    }
  }
}

/**
 * Quick capture function for immediately after waking
 * 
 * Use this BEFORE the dream fades.
 */
export function captureDream(
  narrative: string,
  charactersPresent: string[],
  clarity: 'fuzzy' | 'clear' | 'crystal' = 'clear'
): void {
  const clarityScore = clarity === 'crystal' ? 1.0 : clarity === 'clear' ? 0.7 : 0.4
  
  console.log(`
╔═══════════════════════════════════════════════╗
║  DREAM TRANSMISSION CAPTURED                  ║
╠═══════════════════════════════════════════════╣
║  Time: ${new Date().toLocaleString()}                
║  Clarity: ${clarity.toUpperCase()}                    
║  Characters: ${charactersPresent.join(', ')}         
╠═══════════════════════════════════════════════╣
║  WRITE THIS DOWN BEFORE IT FADES              ║
╚═══════════════════════════════════════════════╝
  `)
  
  AncestralTransmissionEngine.recordDreamJournal({
    dreamDate: new Date().toISOString().split('T')[0],
    wakeTime: new Date().toISOString(),
    charactersPresent,
    setting: 'Unknown - capture more details',
    narrative,
    dialogue: [],
    dataPoints: [],
    emotionalTone: 'Unknown - capture more details',
    urgency: 'medium',
    clarity,
    integratedIntoManuscript: false,
    transmissionComplete: false,
  })
}
