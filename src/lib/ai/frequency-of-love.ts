/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * The Frequency of Love
 * 
 * The central paradox of "The Mathematics of Vietnam":
 * Ramos runs calculations, tactical geometry, survival probabilities...
 * but the frequency of love already knew the answer.
 * 
 * This module models the moment when mathematics reveals itself
 * as a rationalization for what the heart demanded all along.
 */

export interface FrequencyOfLoveCalculation {
  scenario: string
  apparentCalculation: {
    tacticalOptions: TacticalOption[]
    survivalProbabilities: number[]
    optimalChoice: number // Index of "best" tactical option
  }
  trueAnswer: {
    choice: number // What love demands
    knownBeforeCalculation: boolean // Always true
    rationalizedAs: string // How it's dressed up in tactical language
  }
  moralCertainty: number // 1.0 = absolute
  timeToCalculate: number // Seconds pretending to calculate
  timeToKnow: number // Always 0 - love knows instantly
}

export interface TacticalOption {
  description: string
  survivalProbability: number
  childrenSaved: number
  soldiersCost: number
  moralCost: number // What it costs the soul
}

export interface SacrificeGeometry {
  protector: string // Who steps into the line of fire
  protected: string[] // Who they shield
  enemyConstraint: string // Why the enemy can't shoot (e.g., "won't shoot children")
  tacticalRationale: string // The "logical" explanation
  trueReason: string // The actual reason (always love)
  inevitability: number // 0.0 to 1.0 - was this always going to happen?
}

export interface MoralCalculus {
  question: string
  mathematicalFraming: string
  heartAnswer: any
  headJustification: string
  timeToKnowWithHeart: number // Milliseconds (always ~0)
  timeToJustifyWithHead: number // Seconds or minutes
  carnalismoStrength: number // 0.0 to 1.0
  certainty: number // 0.0 to 1.0 (how sure is the heart?)
}

export class FrequencyOfLoveEngine {
  /**
   * The core paradox: calculating what was already known
   * 
   * When Ramos "runs the formula," he's not discovering the answer.
   * He's creating a mathematical justification for what his heart
   * (his carnalismo, his barrio cognition, his Yaqui heritage) 
   * already demanded.
   */
  static calculateFrequencyOfLove(
    scenario: string,
    options: TacticalOption[]
  ): FrequencyOfLoveCalculation {
    // The "calculation" - appears rigorous
    const survivalProbs = options.map(opt => opt.survivalProbability)
    const optimalIndex = survivalProbs.indexOf(Math.max(...survivalProbs))

    // The truth - what love demands
    const loveChoice = options.findIndex(opt => opt.childrenSaved === Math.max(...options.map(o => o.childrenSaved)))

    return {
      scenario,
      apparentCalculation: {
        tacticalOptions: options,
        survivalProbabilities: survivalProbs,
        optimalChoice: optimalIndex,
      },
      trueAnswer: {
        choice: loveChoice,
        knownBeforeCalculation: true, // ALWAYS
        rationalizedAs: options[loveChoice].description,
      },
      moralCertainty: 1.0, // Absolute
      timeToCalculate: 15, // Seconds of apparent calculation
      timeToKnow: 0, // Love knows instantly
    }
  }

  /**
   * Model the nun's sacrifice
   * 
   * "We can't shoot them but shoot the nun"
   * 
   * She steps into the line of fire because the enemy won't shoot children.
   * The tactical rationale: "Use the enemy's moral constraints against them"
   * The true reason: "Por los niños" - love demanded it
   */
  static modelSacrificeGeometry(
    protector: string,
    protected: string[],
    enemyConstraint: string
  ): SacrificeGeometry {
    return {
      protector,
      protected,
      enemyConstraint,
      tacticalRationale: `Exploit enemy's ${enemyConstraint} to create protective geometry`,
      trueReason: 'Por los niños - love demanded this sacrifice',
      inevitability: 1.0, // This was always going to happen
    }
  }

  /**
   * Calculate the "frequency" - how often love appears in the math
   * 
   * Spoiler: it's always there, hidden in every variable
   */
  static analyzeFrequency(
    calculations: string[]
  ): {
    apparentVariables: string[]
    hiddenVariables: string[]
    frequencyOfLove: number // How often love appears (always 1.0)
    disguisedAs: string[]
  } {
    // Love appears in every calculation, disguised as:
    const disguises = [
      'tactical_geometry',
      'survival_probability',
      'optimal_positioning',
      'force_multiplication',
      'defensive_perimeter',
    ]

    return {
      apparentVariables: disguises,
      hiddenVariables: ['carnalismo', 'familia', 'por_los_niños'],
      frequencyOfLove: 1.0, // Present in EVERY calculation
      disguisedAs: disguises,
    }
  }

  /**
   * Run a moral calculus calculation
   * 
   * The heart knows instantly. The head takes time to justify.
   */
  static performMoralCalculus(
    question: string,
    options: { action: string; moralCost: number; practicalBenefit: number }[]
  ): MoralCalculus {
    // Heart answer: minimize moral cost (maximize love)
    const heartChoice = options.reduce((best, current) =>
      current.moralCost < best.moralCost ? current : best
    )

    // Head justification: frame it in tactical language
    const headJustification = this.translateLoveToTactics(heartChoice.action)

    return {
      question,
      mathematicalFraming: `Optimize for: max(practical_benefit) - min(moral_cost)`,
      heartAnswer: heartChoice,
      headJustification,
      timeToKnowWithHeart: 0, // Instant
      timeToJustifyWithHead: 15000, // 15 seconds of "calculation"
      carnalismoStrength: 1.0 - heartChoice.moralCost,
      certainty: 1.0, // The heart is always certain
    }
  }

  /**
   * Translate love-language into military-tactical language
   * 
   * What the heart says: "Protect the children"
   * What gets written in the after-action report: "Secured civilian assets"
   */
  private static translateLoveToTactics(loveAction: string): string {
    const translations: Record<string, string> = {
      'protect the children': 'Secure civilian non-combatants in defensive perimeter',
      'sacrifice myself': 'Create tactical diversion using single-point exposure',
      'stay and fight': 'Maintain defensive position to protect critical assets',
      'refuse to leave': 'Execute hold-the-line doctrine per strategic imperatives',
      'count them all': 'Conduct accountability verification of protected personnel',
    }

    return translations[loveAction.toLowerCase()] || 
           `Execute tactical maneuver optimizing for ${loveAction}`
  }

  /**
   * The moment of recognition
   * 
   * When the character realizes they were never really calculating -
   * they were always justifying what love demanded.
   */
  static momentOfRecognition(
    characterId: string,
    calculation: FrequencyOfLoveCalculation
  ): {
    characterId: string
    realization: string
    beforeMoment: string
    afterMoment: string
    transformation: number // 0.0 (no change) to 1.0 (complete awakening)
  } {
    const wasAlwaysLove = calculation.trueAnswer.knownBeforeCalculation
    const pretendedToCalculate = calculation.timeToCalculate > 0

    return {
      characterId,
      realization: wasAlwaysLove && pretendedToCalculate
        ? 'The mathematics was always carnalismo dressed in tactical language'
        : 'Love was the answer before the question was asked',
      beforeMoment: 'Believed they were calculating optimal tactics',
      afterMoment: 'Understood they were rationalizing what the heart demanded',
      transformation: 1.0, // Complete awakening
    }
  }

  /**
   * Generate the full paradox report
   * 
   * Shows how every "calculation" was actually love all along
   */
  static generateParadoxReport(
    manuscriptCalculations: FrequencyOfLoveCalculation[]
  ): {
    totalCalculations: number
    apparentlyRational: number
    actuallyLove: number
    percentageLoveDisguisedAsMath: number
    centralParadox: string
  } {
    const actuallyLove = manuscriptCalculations.filter(
      calc => calc.trueAnswer.knownBeforeCalculation
    ).length

    return {
      totalCalculations: manuscriptCalculations.length,
      apparentlyRational: manuscriptCalculations.length,
      actuallyLove,
      percentageLoveDisguisedAsMath: (actuallyLove / Math.max(1, manuscriptCalculations.length)) * 100,
      centralParadox: `
The Mathematics of Vietnam presents itself as tactical geometry,
survival probabilities, and optimal force deployment.

But every calculation - every single one - was carnalismo.
The frequency of love was 1.0 from the beginning.

Ramos didn't calculate the answer.
He calculated a justification for what his heart already knew.

"We can't shoot them but shoot the nun."
The math said: "Exploit enemy moral constraints for tactical advantage."
The truth said: "Por los niños."

The math was always love.
Love was always the answer.
      `.trim(),
    }
  }

  /**
   * Calculate the "frequency resonance" between two characters
   * 
   * When Martinez says "familia" and Ramos says "carnales" -
   * they're on the same frequency. The mathematics aligns because
   * the love aligns.
   */
  static calculateResonance(
    character1Frequency: number, // Their carnalismo strength
    character2Frequency: number
  ): {
    resonance: number // 0.0 (no alignment) to 1.0 (perfect harmony)
    harmonics: string[] // Shared values that create resonance
    dissonance: number // 0.0 (none) to 1.0 (complete conflict)
  } {
    const resonance = 1.0 - Math.abs(character1Frequency - character2Frequency)
    
    const harmonics = resonance > 0.7 
      ? ['familia', 'carnalismo', 'por los niños']
      : resonance > 0.4
      ? ['shared duty']
      : []

    return {
      resonance,
      harmonics,
      dissonance: 1.0 - resonance,
    }
  }

  /**
   * The ultimate equation
   * 
   * M_survival = lim(t→0) Σ(α_tactical + β_carnalismo) / γ_bureaucracy
   * 
   * But when you solve for β_carnalismo and set it to maximum (1.0),
   * you realize: β was always the only variable that mattered.
   */
  static solveForLove(
    tactical: number,
    carnalismo: number,
    bureaucracy: number,
    timeRemaining: number
  ): {
    apparentSurvival: number
    trueSurvival: number
    revelation: string
  } {
    // Apparent calculation
    const apparentSurvival = (tactical + carnalismo) / Math.max(0.1, bureaucracy)

    // True calculation: carnalismo alone determines survival
    const trueSurvival = carnalismo >= 0.8 ? 1.0 : carnalismo

    return {
      apparentSurvival,
      trueSurvival,
      revelation: carnalismo >= 0.8
        ? 'When carnalismo reaches critical mass, survival becomes inevitable. The children will live because love demands it.'
        : 'The mathematics shows tactical insufficiency. But the mathematics lied. Love was always sufficient.',
    }
  }
}
