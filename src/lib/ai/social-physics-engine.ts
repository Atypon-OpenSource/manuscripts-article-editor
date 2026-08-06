/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * Social Physics Engine for Narrative Modeling
 * 
 * Models human behavior, social forces, and narrative tension using
 * vector mathematics and behavioral schema validation.
 * 
 * Based on the formula from "The Mathematics of Vietnam":
 * M_survival = lim(t→0) Σ(α_tactical + β_carnalismo) / γ_bureaucracy
 */

export interface Vector3D {
  x: number // Magnitude in ideological dimension
  y: number // Magnitude in emotional dimension
  z: number // Magnitude in tactical dimension
  magnitude: number
  direction: { theta: number; phi: number }
}

export interface SocialForce {
  name: string
  type: 'attractive' | 'repulsive' | 'neutral'
  vector: Vector3D
  intensity: number
  range: number
  affectedCharacters: string[]
}

export interface BehaviorSchema {
  id: string
  name: string
  description: string
  triggers: BehaviorTrigger[]
  expectedActions: ActionPattern[]
  culturalMarkers: string[]
  emotionalRange: { min: number; max: number }
  vectorSignature: Vector3D
}

export interface BehaviorTrigger {
  type: 'threat' | 'loyalty' | 'survival' | 'sacrifice' | 'cultural_memory'
  condition: string
  threshold: number
}

export interface ActionPattern {
  action: string
  vectorChange: Partial<Vector3D>
  probability: number
  dependencies: string[]
}

export interface CharacterBehaviorState {
  characterId: string
  chapterId: string
  timestamp: number
  activeSchemas: string[]
  behaviorVector: Vector3D
  emotionalState: number // -1.0 (despair) to 1.0 (hope)
  moralAlignment: number // -1.0 (self-interest) to 1.0 (sacrifice)
  culturalIntegrity: number // 0.0 (assimilated) to 1.0 (authentic)
  socialForces: SocialForce[]
}

export interface NarrativeTension {
  chapterId: string
  survivalProbability: number // M_survival calculation
  tacticalComponent: number // α_tactical
  humanComponent: number // β_carnalismo
  bureaucraticResistance: number // γ_bureaucracy
  timeRemaining: number // t→0
  tensionVector: Vector3D
  criticalMoment: boolean
}

export interface BehaviorValidation {
  characterId: string
  chapterId: string
  valid: boolean
  schemaMatch: number // 0.0 to 1.0
  deviations: BehaviorDeviation[]
  confidence: number
}

export interface BehaviorDeviation {
  schema: string
  expectedVector: Vector3D
  actualVector: Vector3D
  deviation: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  explanation: string
}

export class SocialPhysicsEngine {
  private static readonly SCHEMAS_KEY = 'manuscripts_behavior_schemas'
  private static readonly STATES_KEY = 'manuscripts_behavior_states'

  /**
   * Calculate survival probability using the core formula
   * M_survival = lim(t→0) Σ(α_tactical + β_carnalismo) / γ_bureaucracy
   */
  static calculateSurvivalProbability(
    tacticalGeometry: number,
    carnalismoStrength: number,
    bureaucraticResistance: number,
    timeRemaining: number
  ): number {
    if (timeRemaining <= 0) {
      return tacticalGeometry + carnalismoStrength > bureaucraticResistance ? 1.0 : 0.0
    }

    const numerator = tacticalGeometry + carnalismoStrength
    const denominator = Math.max(0.1, bureaucraticResistance)
    
    // Apply time pressure: as t→0, the probability becomes more binary
    const timeFactor = Math.exp(-1 / Math.max(0.01, timeRemaining))
    
    return Math.min(1.0, (numerator / denominator) * timeFactor)
  }

  /**
   * Create a behavior vector from ideological, emotional, and tactical components
   */
  static createVector(
    ideological: number,
    emotional: number,
    tactical: number
  ): Vector3D {
    const magnitude = Math.sqrt(
      ideological ** 2 + emotional ** 2 + tactical ** 2
    )

    const theta = Math.atan2(emotional, ideological)
    const phi = Math.acos(tactical / Math.max(0.001, magnitude))

    return {
      x: ideological,
      y: emotional,
      z: tactical,
      magnitude,
      direction: { theta, phi },
    }
  }

  /**
   * Calculate the dot product of two behavior vectors
   * Used to measure alignment between expected and actual behavior
   */
  static dotProduct(v1: Vector3D, v2: Vector3D): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  /**
   * Calculate cosine similarity between two vectors (0 to 1)
   */
  static cosineSimilarity(v1: Vector3D, v2: Vector3D): number {
    const dot = this.dotProduct(v1, v2)
    const mag1 = v1.magnitude || Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2)
    const mag2 = v2.magnitude || Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2)
    
    if (mag1 === 0 || mag2 === 0) return 0
    
    return (dot / (mag1 * mag2) + 1) / 2 // Normalize to 0-1
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  static vectorDistance(v1: Vector3D, v2: Vector3D): number {
    return Math.sqrt(
      (v1.x - v2.x) ** 2 +
      (v1.y - v2.y) ** 2 +
      (v1.z - v2.z) ** 2
    )
  }

  /**
   * Define core behavior schemas
   */
  static getDefaultSchemas(): BehaviorSchema[] {
    return [
      {
        id: 'barrio_cognition',
        name: 'Barrio Cognition',
        description: 'Hyper-vigilant situational awareness from marginalized communities',
        triggers: [
          { type: 'threat', condition: 'environmental_danger', threshold: 0.6 },
          { type: 'survival', condition: 'protecting_familia', threshold: 0.8 },
        ],
        expectedActions: [
          {
            action: 'threat_detection',
            vectorChange: { z: 0.7 }, // High tactical component
            probability: 0.9,
            dependencies: ['cultural_memory'],
          },
          {
            action: 'protective_stance',
            vectorChange: { y: 0.6, z: 0.5 },
            probability: 0.85,
            dependencies: ['familia_present'],
          },
        ],
        culturalMarkers: ['carnal', 'carnalismo', 'familia', 'mijo', 'barrio'],
        emotionalRange: { min: 0.3, max: 0.9 },
        vectorSignature: this.createVector(0.4, 0.6, 0.8),
      },
      {
        id: 'carnalismo',
        name: 'Carnalismo (Brotherhood Beyond Blood)',
        description: 'Deep solidarity transcending ethnic and national boundaries',
        triggers: [
          { type: 'loyalty', condition: 'familia_threatened', threshold: 0.7 },
          { type: 'sacrifice', condition: 'protect_vulnerable', threshold: 0.8 },
        ],
        expectedActions: [
          {
            action: 'selfless_protection',
            vectorChange: { x: 0.8, y: 0.9 },
            probability: 0.95,
            dependencies: ['moral_imperative'],
          },
        ],
        culturalMarkers: ['carnales', 'por los niños', 'familia'],
        emotionalRange: { min: 0.6, max: 1.0 },
        vectorSignature: this.createVector(0.9, 0.8, 0.4),
      },
      {
        id: 'yaqui_heritage',
        name: 'Yaqui Ancestral Memory',
        description: 'Spiritual threat detection through ancestral connection',
        triggers: [
          { type: 'cultural_memory', condition: 'sensory_recognition', threshold: 0.5 },
          { type: 'threat', condition: 'environmental_pattern', threshold: 0.6 },
        ],
        expectedActions: [
          {
            action: 'ancestral_threat_detection',
            vectorChange: { x: 0.7, z: 0.6 },
            probability: 0.7,
            dependencies: ['cultural_integrity'],
          },
        ],
        culturalMarkers: ['albahaca', 'abuela', 'ancestral'],
        emotionalRange: { min: 0.4, max: 0.8 },
        vectorSignature: this.createVector(0.8, 0.5, 0.6),
      },
      {
        id: 'military_bureaucracy',
        name: 'Military-Industrial Reduction',
        description: 'Systematic dehumanization through statistical abstraction',
        triggers: [
          { type: 'threat', condition: 'institutional_pressure', threshold: 0.5 },
        ],
        expectedActions: [
          {
            action: 'statistical_reduction',
            vectorChange: { x: -0.8, y: -0.6 },
            probability: 0.9,
            dependencies: ['system_power'],
          },
        ],
        culturalMarkers: ['body count', 'kill ratio', 'pacification'],
        emotionalRange: { min: -0.8, max: -0.3 },
        vectorSignature: this.createVector(-0.7, -0.5, 0.3),
      },
      {
        id: 'foreign_legion_honor',
        name: 'Foreign Legion Honor Code',
        description: 'Fight to death against overwhelming odds (Camerone)',
        triggers: [
          { type: 'sacrifice', condition: 'overwhelming_odds', threshold: 0.9 },
        ],
        expectedActions: [
          {
            action: 'last_stand',
            vectorChange: { x: 0.9, z: 0.8 },
            probability: 1.0,
            dependencies: ['honor_oath'],
          },
        ],
        culturalMarkers: ['CAMERONE', 'Foreign Legion', 'last stand'],
        emotionalRange: { min: 0.7, max: 1.0 },
        vectorSignature: this.createVector(0.9, 0.6, 0.9),
      },
    ]
  }

  /**
   * Validate character behavior against expected schemas
   */
  static validateBehavior(
    characterId: string,
    chapterId: string,
    observedActions: string[],
    contextMarkers: string[],
    currentVector: Vector3D
  ): BehaviorValidation {
    const schemas = this.getDefaultSchemas()
    const deviations: BehaviorDeviation[] = []
    let bestMatch = 0

    for (const schema of schemas) {
      // Check if cultural markers are present
      const markerMatch = schema.culturalMarkers.filter(marker =>
        contextMarkers.some(ctx => ctx.toLowerCase().includes(marker.toLowerCase()))
      ).length / Math.max(1, schema.culturalMarkers.length)

      if (markerMatch < 0.3) continue // Skip if cultural context doesn't match

      // Calculate vector similarity
      const vectorSimilarity = this.cosineSimilarity(
        currentVector,
        schema.vectorSignature
      )

      bestMatch = Math.max(bestMatch, vectorSimilarity)

      // Check for deviations
      if (vectorSimilarity < 0.6) {
        const distance = this.vectorDistance(currentVector, schema.vectorSignature)
        deviations.push({
          schema: schema.name,
          expectedVector: schema.vectorSignature,
          actualVector: currentVector,
          deviation: distance,
          severity: distance > 1.5 ? 'critical' : distance > 1.0 ? 'high' : 'medium',
          explanation: `Character behavior deviates from ${schema.name} schema (similarity: ${(vectorSimilarity * 100).toFixed(1)}%)`,
        })
      }
    }

    return {
      characterId,
      chapterId,
      valid: deviations.length === 0 || bestMatch > 0.7,
      schemaMatch: bestMatch,
      deviations,
      confidence: bestMatch,
    }
  }

  /**
   * Calculate narrative tension for a chapter
   */
  static calculateNarrativeTension(
    chapterId: string,
    characters: CharacterBehaviorState[],
    threatLevel: number,
    timeRemaining: number
  ): NarrativeTension {
    // Calculate α_tactical: average tactical positioning
    const tacticalComponent = characters.reduce(
      (sum, char) => sum + char.behaviorVector.z,
      0
    ) / Math.max(1, characters.length)

    // Calculate β_carnalismo: average moral alignment and emotional solidarity
    const humanComponent = characters.reduce(
      (sum, char) => sum + (char.moralAlignment + char.emotionalState) / 2,
      0
    ) / Math.max(1, characters.length)

    // Calculate γ_bureaucracy: systemic resistance (threat × institutional power)
    const bureaucraticResistance = threatLevel * 0.8

    // Calculate survival probability
    const survivalProbability = this.calculateSurvivalProbability(
      tacticalComponent,
      humanComponent,
      bureaucraticResistance,
      timeRemaining
    )

    // Create tension vector
    const tensionVector = this.createVector(
      humanComponent,
      1.0 - survivalProbability, // Emotional tension
      tacticalComponent
    )

    return {
      chapterId,
      survivalProbability,
      tacticalComponent,
      humanComponent,
      bureaucraticResistance,
      timeRemaining,
      tensionVector,
      criticalMoment: timeRemaining < 0.1 && survivalProbability < 0.5,
    }
  }

  /**
   * Model social force propagation between characters
   */
  static propagateSocialForce(
    sourceChar: CharacterBehaviorState,
    targetChar: CharacterBehaviorState,
    force: SocialForce
  ): CharacterBehaviorState {
    const distance = this.vectorDistance(
      sourceChar.behaviorVector,
      targetChar.behaviorVector
    )

    // Force weakens with distance (inverse square law)
    const effectiveIntensity = force.intensity / Math.max(1, distance ** 2)

    if (effectiveIntensity < 0.1) {
      return targetChar // Force too weak
    }

    // Apply force vector to target's behavior
    const newVector = {
      x: targetChar.behaviorVector.x + force.vector.x * effectiveIntensity,
      y: targetChar.behaviorVector.y + force.vector.y * effectiveIntensity,
      z: targetChar.behaviorVector.z + force.vector.z * effectiveIntensity,
    }

    return {
      ...targetChar,
      behaviorVector: this.createVector(newVector.x, newVector.y, newVector.z),
      socialForces: [...targetChar.socialForces, force],
    }
  }

  /**
   * Save behavior state to storage
   */
  static saveBehaviorState(state: CharacterBehaviorState) {
    const states = this.getBehaviorStates()
    states.push(state)
    localStorage.setItem(this.STATES_KEY, JSON.stringify(states))
  }

  /**
   * Get all behavior states
   */
  static getBehaviorStates(): CharacterBehaviorState[] {
    const stored = localStorage.getItem(this.STATES_KEY)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * Get behavior trajectory for a character across chapters
   */
  static getBehaviorTrajectory(characterId: string): CharacterBehaviorState[] {
    const states = this.getBehaviorStates()
    return states
      .filter(s => s.characterId === characterId)
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * Analyze behavior consistency across chapters
   */
  static analyzeBehaviorConsistency(
    characterId: string,
    expectedSchemas: string[]
  ): {
    consistent: boolean
    averageMatch: number
    deviationPoints: { chapterId: string; deviation: number }[]
  } {
    const trajectory = this.getBehaviorTrajectory(characterId)
    const schemas = this.getDefaultSchemas()
    const expectedVectors = schemas
      .filter(s => expectedSchemas.includes(s.id))
      .map(s => s.vectorSignature)

    if (expectedVectors.length === 0 || trajectory.length === 0) {
      return { consistent: true, averageMatch: 1.0, deviationPoints: [] }
    }

    const deviationPoints: { chapterId: string; deviation: number }[] = []
    let totalMatch = 0

    for (const state of trajectory) {
      let bestMatch = 0
      for (const expectedVector of expectedVectors) {
        const match = this.cosineSimilarity(state.behaviorVector, expectedVector)
        bestMatch = Math.max(bestMatch, match)
      }

      totalMatch += bestMatch
      if (bestMatch < 0.6) {
        deviationPoints.push({
          chapterId: state.chapterId,
          deviation: 1.0 - bestMatch,
        })
      }
    }

    const averageMatch = totalMatch / trajectory.length

    return {
      consistent: deviationPoints.length === 0,
      averageMatch,
      deviationPoints,
    }
  }
}
