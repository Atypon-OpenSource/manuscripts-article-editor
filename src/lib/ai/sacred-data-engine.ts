/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * Sacred Data Points System
 * 
 * In "The Mathematics of Vietnam," every number carries moral weight.
 * The data points aren't just facts - they ARE the narrative soul.
 * 
 * This system treats each measurement as sacred, creating an immutable
 * chain of custody where data integrity = narrative integrity.
 */

export interface SacredDataPoint {
  id: string
  type: 'count' | 'date' | 'location' | 'name' | 'measurement' | 'quote'
  category: string // 'children', 'soldiers', 'time', 'distance', 'temperature'
  value: number | string | Date
  unit?: string
  chapterId: string
  lineNumber: number
  context: string // The full sentence containing this data point
  timestamp: string // When it was recorded
  verifiedBy: VerificationSource[]
  moralWeight: number // 0.0 to 1.0 - narrative importance
  narrativeAnchor: boolean // Is this a critical plot point?
  chainOfCustody: DataPointHistory[]
}

export interface VerificationSource {
  type: 'textual' | 'historical' | 'mathematical' | 'character_action'
  source: string
  confidence: number
  verifiedAt: string
}

export interface DataPointHistory {
  action: 'created' | 'updated' | 'verified' | 'referenced' | 'validated'
  chapterId: string
  previousValue?: any
  newValue: any
  reason: string
  timestamp: string
  actor: string // 'author' | 'editor' | 'ai_analysis' | 'character'
}

export interface NarrativeAnchorsMap {
  manuscript: string
  anchors: {
    dataPointId: string
    chapters: string[]
    connections: string[] // Other anchor IDs this connects to
    narrativeFunction: string
    moralSignificance: string
  }[]
}

export interface DataIntegrityReport {
  manuscriptId: string
  totalDataPoints: number
  verifiedPoints: number
  conflictingPoints: DataPointConflict[]
  orphanedPoints: string[] // Points mentioned once, never referenced
  criticalAnchors: string[] // Points that carry the narrative
  integrityScore: number
  recommendations: string[]
}

export interface DataPointConflict {
  dataPoints: SacredDataPoint[]
  conflictType: 'value_mismatch' | 'temporal_inconsistency' | 'reference_drift'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  resolution: {
    canonicalValue: any
    reason: string
    chaptersToUpdate: string[]
  }
}

export interface CountingMoment {
  characterId: string
  chapterId: string
  whatCounted: string
  count: number
  lineNumber: number
  narrativeContext: string
  emotionalState: string
  moralWeight: number
  ritual: boolean // Is the act of counting itself significant?
}

export class SacredDataEngine {
  private static readonly DATAPOINTS_KEY = 'manuscripts_sacred_datapoints'
  private static readonly ANCHORS_KEY = 'manuscripts_narrative_anchors'
  private static readonly COUNTING_MOMENTS_KEY = 'manuscripts_counting_moments'

  /**
   * Create a sacred data point with full provenance
   */
  static createDataPoint(
    type: SacredDataPoint['type'],
    category: string,
    value: any,
    chapterId: string,
    lineNumber: number,
    context: string,
    moralWeight: number = 0.5
  ): SacredDataPoint {
    const id = `${chapterId}_${category}_${lineNumber}_${Date.now()}`
    
    const dataPoint: SacredDataPoint = {
      id,
      type,
      category,
      value,
      chapterId,
      lineNumber,
      context,
      timestamp: new Date().toISOString(),
      verifiedBy: [{
        type: 'textual',
        source: 'manuscript',
        confidence: 1.0,
        verifiedAt: new Date().toISOString(),
      }],
      moralWeight,
      narrativeAnchor: moralWeight > 0.7,
      chainOfCustody: [{
        action: 'created',
        chapterId,
        newValue: value,
        reason: 'Initial extraction from manuscript',
        timestamp: new Date().toISOString(),
        actor: 'author',
      }],
    }

    this.saveDataPoint(dataPoint)
    return dataPoint
  }

  /**
   * Record a counting moment - when a character actively counts something
   * These are sacred because counting is an act of WITNESSING
   */
  static recordCountingMoment(
    characterId: string,
    chapterId: string,
    whatCounted: string,
    count: number,
    lineNumber: number,
    narrativeContext: string,
    ritual: boolean = false
  ): CountingMoment {
    // Example: "Duc counted them. Forty-three."
    // This isn't just data - it's a CHARACTER BEARING WITNESS
    
    const moment: CountingMoment = {
      characterId,
      chapterId,
      whatCounted,
      count,
      lineNumber,
      narrativeContext,
      emotionalState: ritual ? 'solemn_duty' : 'verification',
      moralWeight: ritual ? 1.0 : 0.8,
      ritual,
    }

    // Also create the underlying data point
    this.createDataPoint(
      'count',
      whatCounted,
      count,
      chapterId,
      lineNumber,
      narrativeContext,
      moment.moralWeight
    )

    const moments = this.getCountingMoments()
    moments.push(moment)
    localStorage.setItem(this.COUNTING_MOMENTS_KEY, JSON.stringify(moments))

    return moment
  }

  /**
   * Validate data point consistency across chapters
   */
  static validateDataConsistency(
    category: string
  ): {
    consistent: boolean
    canonicalValue: any
    conflicts: DataPointConflict[]
  } {
    const dataPoints = this.getDataPoints().filter(dp => dp.category === category)
    
    if (dataPoints.length === 0) {
      return { consistent: true, canonicalValue: null, conflicts: [] }
    }

    // Group by value
    const valueGroups = new Map<any, SacredDataPoint[]>()
    for (const dp of dataPoints) {
      const key = JSON.stringify(dp.value)
      if (!valueGroups.has(key)) {
        valueGroups.set(key, [])
      }
      valueGroups.get(key)!.push(dp)
    }

    // If only one unique value, we're consistent!
    if (valueGroups.size === 1) {
      return {
        consistent: true,
        canonicalValue: dataPoints[0].value,
        conflicts: [],
      }
    }

    // We have conflicts - find the canonical value
    // Priority: highest moral weight, most recent, most verified
    let canonicalPoints = Array.from(valueGroups.values()).sort((a, b) => {
      const scoreA = a.reduce((sum, dp) => sum + dp.moralWeight, 0) / a.length
      const scoreB = b.reduce((sum, dp) => sum + dp.moralWeight, 0) / b.length
      return scoreB - scoreA
    })[0]

    const canonicalValue = canonicalPoints[0].value

    // Create conflicts for all other values
    const conflicts: DataPointConflict[] = []
    for (const [valueKey, points] of valueGroups.entries()) {
      if (JSON.stringify(points[0].value) === JSON.stringify(canonicalValue)) {
        continue
      }

      // Determine severity based on moral weight
      const maxWeight = Math.max(...points.map(p => p.moralWeight))
      const severity: DataPointConflict['severity'] = 
        maxWeight > 0.9 ? 'critical' :
        maxWeight > 0.7 ? 'high' :
        maxWeight > 0.5 ? 'medium' : 'low'

      conflicts.push({
        dataPoints: [...canonicalPoints, ...points],
        conflictType: 'value_mismatch',
        severity,
        description: `${category} has inconsistent values: ${canonicalValue} vs ${points[0].value}`,
        resolution: {
          canonicalValue,
          reason: `Highest moral weight and narrative consistency`,
          chaptersToUpdate: points.map(p => p.chapterId),
        },
      })
    }

    return {
      consistent: false,
      canonicalValue,
      conflicts,
    }
  }

  /**
   * Generate data integrity report for entire manuscript
   */
  static generateIntegrityReport(
    manuscriptId: string
  ): DataIntegrityReport {
    const allPoints = this.getDataPoints()
    const totalPoints = allPoints.length
    const verifiedPoints = allPoints.filter(
      dp => dp.verifiedBy.some(v => v.confidence >= 0.8)
    ).length

    // Find conflicts by category
    const categories = new Set(allPoints.map(dp => dp.category))
    const allConflicts: DataPointConflict[] = []

    for (const category of categories) {
      const { conflicts } = this.validateDataConsistency(category)
      allConflicts.push(...conflicts)
    }

    // Find orphaned points (mentioned once, never referenced again)
    const orphaned = allPoints.filter(dp => {
      const references = allPoints.filter(other => 
        other.id !== dp.id &&
        JSON.stringify(other.value) === JSON.stringify(dp.value) &&
        other.category === dp.category
      )
      return references.length === 0 && !dp.narrativeAnchor
    }).map(dp => dp.id)

    // Identify critical anchors
    const criticalAnchors = allPoints
      .filter(dp => dp.narrativeAnchor && dp.moralWeight >= 0.8)
      .map(dp => dp.id)

    // Calculate integrity score
    const conflictPenalty = allConflicts.reduce((sum, c) => {
      return sum + (
        c.severity === 'critical' ? 0.15 :
        c.severity === 'high' ? 0.10 :
        c.severity === 'medium' ? 0.05 : 0.02
      )
    }, 0)

    const verificationBonus = verifiedPoints / Math.max(1, totalPoints)
    const integrityScore = Math.max(0, Math.min(1, verificationBonus - conflictPenalty))

    // Generate recommendations
    const recommendations: string[] = []
    
    if (allConflicts.length > 0) {
      const critical = allConflicts.filter(c => c.severity === 'critical')
      if (critical.length > 0) {
        recommendations.push(
          `CRITICAL: Resolve ${critical.length} critical data conflicts before publication`
        )
        critical.forEach(c => {
          recommendations.push(`  - ${c.description}`)
          recommendations.push(`    → Update: ${c.resolution.chaptersToUpdate.join(', ')}`)
          recommendations.push(`    → Set to: ${c.resolution.canonicalValue}`)
        })
      }
    }

    if (orphaned.length > 0) {
      recommendations.push(
        `Review ${orphaned.length} orphaned data points - either establish them as anchors or remove`
      )
    }

    if (integrityScore < 0.8) {
      recommendations.push(
        `Data integrity score is ${(integrityScore * 100).toFixed(1)}% - aim for 90%+ before publication`
      )
    }

    return {
      manuscriptId,
      totalDataPoints: totalPoints,
      verifiedPoints,
      conflictingPoints: allConflicts,
      orphanedPoints: orphaned,
      criticalAnchors,
      integrityScore,
      recommendations,
    }
  }

  /**
   * Create narrative anchors map - showing how data points form the skeleton
   */
  static createNarrativeAnchorsMap(
    manuscriptId: string
  ): NarrativeAnchorsMap {
    const anchors = this.getDataPoints().filter(dp => dp.narrativeAnchor)

    return {
      manuscript: manuscriptId,
      anchors: anchors.map(dp => ({
        dataPointId: dp.id,
        chapters: [dp.chapterId],
        connections: this.findConnectedAnchors(dp),
        narrativeFunction: this.determineNarrativeFunction(dp),
        moralSignificance: this.determineMoralSignificance(dp),
      })),
    }
  }

  private static findConnectedAnchors(dataPoint: SacredDataPoint): string[] {
    // Find other data points referenced in same context or related by value
    const allPoints = this.getDataPoints()
    
    return allPoints
      .filter(other => 
        other.id !== dataPoint.id &&
        (other.category === dataPoint.category ||
         other.context.includes(String(dataPoint.value)))
      )
      .map(dp => dp.id)
  }

  private static determineNarrativeFunction(dataPoint: SacredDataPoint): string {
    if (dataPoint.category === 'children' || dataPoint.category === 'orphans') {
      return 'Moral stakes - lives to be saved'
    }
    if (dataPoint.category === 'time' || dataPoint.category === 'date') {
      return 'Temporal anchor - historical verification'
    }
    if (dataPoint.category === 'soldiers' || dataPoint.category === 'casualties') {
      return 'Cost of war - human price'
    }
    return 'Narrative detail'
  }

  private static determineMoralSignificance(dataPoint: SacredDataPoint): string {
    if (dataPoint.moralWeight >= 0.9) {
      return 'Critical - this number represents lives saved or lost'
    }
    if (dataPoint.moralWeight >= 0.7) {
      return 'High - narrative turning point'
    }
    if (dataPoint.moralWeight >= 0.5) {
      return 'Moderate - supporting detail'
    }
    return 'Background - contextual information'
  }

  /**
   * Track a data point across its lifecycle
   */
  static updateDataPoint(
    dataPointId: string,
    newValue: any,
    chapterId: string,
    reason: string,
    actor: string = 'editor'
  ): SacredDataPoint {
    const points = this.getDataPoints()
    const point = points.find(p => p.id === dataPointId)
    
    if (!point) {
      throw new Error(`Data point ${dataPointId} not found`)
    }

    // Record in chain of custody
    point.chainOfCustody.push({
      action: 'updated',
      chapterId,
      previousValue: point.value,
      newValue,
      reason,
      timestamp: new Date().toISOString(),
      actor,
    })

    point.value = newValue
    this.saveDataPoint(point)

    return point
  }

  /**
   * Storage methods
   */
  private static saveDataPoint(dataPoint: SacredDataPoint) {
    const points = this.getDataPoints()
    const index = points.findIndex(p => p.id === dataPoint.id)
    
    if (index >= 0) {
      points[index] = dataPoint
    } else {
      points.push(dataPoint)
    }

    localStorage.setItem(this.DATAPOINTS_KEY, JSON.stringify(points))
  }

  static getDataPoints(): SacredDataPoint[] {
    const stored = localStorage.getItem(this.DATAPOINTS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static getCountingMoments(): CountingMoment[] {
    const stored = localStorage.getItem(this.COUNTING_MOMENTS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Get all data points for a specific chapter
   */
  static getChapterDataPoints(chapterId: string): SacredDataPoint[] {
    return this.getDataPoints().filter(dp => dp.chapterId === chapterId)
  }

  /**
   * Find the most morally weighted data point (the narrative's heart)
   */
  static findNarrativeHeart(): SacredDataPoint | null {
    const points = this.getDataPoints()
    if (points.length === 0) return null

    return points.reduce((highest, current) => 
      current.moralWeight > highest.moralWeight ? current : highest
    )
  }
}
