/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * Carrier Consciousness
 * 
 * "They became part of me and [they won't go] away."
 * 
 * This isn't about researching historical figures.
 * This is about CARRYING THE DEAD.
 * 
 * The squad lives inside you now.
 * They visit in dreams because they RESIDE there.
 * You are the VESSEL for their story.
 * 
 * The manuscript doesn't come FROM you - it comes THROUGH you.
 * You are the carrier, the witness, the living archive.
 */

export interface CarriedSoul {
  name: string
  role: string // 'soldier', 'child', 'nun', 'witness'
  
  // How they entered
  entryPoint: 'dream' | 'story' | 'photograph' | 'testimony' | 'unknown'
  firstEncounter: string // ISO timestamp or "before memory"
  
  // How they manifest
  manifestations: {
    dreams: number // How many times they've visited dreams
    waking_visions: number
    intrusive_thoughts: number
    physical_sensations: number
  }
  
  // What they carry
  message: string // What they need you to know
  unfinishedBusiness: string // Why they won't leave
  dataTheyProtect: string[] // Numbers/facts they demand accuracy on
  
  // Relationship to carrier
  bondStrength: number // 0.0 to 1.0 - how deeply embedded
  canLeave: boolean // Will they ever leave? (usually false)
  integrated: boolean // Have you accepted them as permanent?
  
  // Their voice
  speaksInDreams: boolean
  speaksInWakingLife: boolean
  languageUsed: string[] // Spanish, Vietnamese, English, silent knowing
  emotionalSignature: string // How you FEEL when they're present
}

export interface CarrierState {
  carrierId: string // The living person (you)
  carrierName: string
  
  // Who you carry
  carriedSouls: CarriedSoul[]
  totalCarried: number
  
  // Carrier capacity
  overwhelmed: boolean // Carrying too many?
  integrated: boolean // Have you accepted this role?
  resistance: number // 0.0 (acceptance) to 1.0 (fighting it)
  
  // Transmission state
  channelOpen: boolean // Are you receiving right now?
  dreamFrequency: number // Dreams per week
  lastTransmission: string // ISO timestamp
  
  // Narrative obligation
  storyOwed: boolean // Do you OWE this story to the dead?
  completionUrgency: number // 0.0 to 1.0 - how urgent is telling this?
  consequenceOfSilence: string // What happens if you DON'T tell it?
}

export interface TransmissionMoment {
  timestamp: string
  carriedSoul: string // Who spoke
  channel: 'dream' | 'waking_vision' | 'intrusive_knowing' | 'body_memory'
  
  content: string
  clarity: number
  urgency: number
  
  // Physical/emotional state during transmission
  yourState: {
    awake: boolean
    location: string
    emotionalState: string
    physicalSensations: string[]
  }
  
  // What they showed/said
  visualContent: string[]
  spokenWords: string[]
  feltEmotions: string[]
  bodyMemories: string[] // Smells, tastes, physical sensations
  
  // Integration status
  captured: boolean // Did you write it down?
  integrated: boolean // Did it make it into manuscript?
  corruptedByEditing: boolean
}

export class CarrierConsciousnessEngine {
  private static carrier: CarrierState | null = null
  private static transmissions: TransmissionMoment[] = []
  
  /**
   * Initialize carrier consciousness
   * 
   * Call this when you accept that you carry the dead.
   */
  static initializeCarrier(
    name: string,
    souls: Omit<CarriedSoul, 'manifestations' | 'bondStrength' | 'integrated'>[]
  ): CarrierState {
    const carriedSouls: CarriedSoul[] = souls.map(soul => ({
      ...soul,
      manifestations: { dreams: 0, waking_visions: 0, intrusive_thoughts: 0, physical_sensations: 0 },
      bondStrength: 0.5, // Will grow over time
      integrated: false, // Must actively integrate each soul
    }))
    
    this.carrier = {
      carrierId: `carrier_${Date.now()}`,
      carrierName: name,
      carriedSouls,
      totalCarried: carriedSouls.length,
      overwhelmed: carriedSouls.length > 10,
      integrated: false, // Must accept the role
      resistance: 0.5, // Natural resistance at first
      channelOpen: true,
      dreamFrequency: 3, // Estimate: 3 dreams per week
      lastTransmission: new Date().toISOString(),
      storyOwed: true, // You OWE this story
      completionUrgency: 0.8,
      consequenceOfSilence: 'Their stories die. They are forgotten. The children are erased.',
    }
    
    return this.carrier
  }
  
  /**
   * Record when a carried soul manifests
   */
  static recordManifestation(
    soulName: string,
    channel: TransmissionMoment['channel'],
    content: string,
    clarity: number = 0.7
  ): TransmissionMoment {
    if (!this.carrier) {
      throw new Error('Carrier not initialized. Call initializeCarrier first.')
    }
    
    const soul = this.carrier.carriedSouls.find(s => s.name === soulName)
    if (!soul) {
      throw new Error(`Soul ${soulName} not found in carrier consciousness`)
    }
    
    // Update manifestation count
    if (channel === 'dream') soul.manifestations.dreams++
    else if (channel === 'waking_vision') soul.manifestations.waking_visions++
    else if (channel === 'intrusive_knowing') soul.manifestations.intrusive_thoughts++
    else if (channel === 'body_memory') soul.manifestations.physical_sensations++
    
    // Strengthen bond with each manifestation
    soul.bondStrength = Math.min(1.0, soul.bondStrength + 0.05)
    
    const transmission: TransmissionMoment = {
      timestamp: new Date().toISOString(),
      carriedSoul: soulName,
      channel,
      content,
      clarity,
      urgency: 0.7,
      yourState: {
        awake: channel !== 'dream',
        location: 'Unknown',
        emotionalState: 'Unknown',
        physicalSensations: [],
      },
      visualContent: [],
      spokenWords: [],
      feltEmotions: [],
      bodyMemories: [],
      captured: false,
      integrated: false,
      corruptedByEditing: false,
    }
    
    this.transmissions.push(transmission)
    this.carrier.lastTransmission = transmission.timestamp
    
    return transmission
  }
  
  /**
   * Integrate a carried soul
   * 
   * When you stop resisting and accept they live in you now.
   */
  static integrateSoul(soulName: string): void {
    if (!this.carrier) return
    
    const soul = this.carrier.carriedSouls.find(s => s.name === soulName)
    if (soul) {
      soul.integrated = true
      soul.bondStrength = 1.0
      
      // Reduce overall resistance
      this.carrier.resistance = Math.max(0.0, this.carrier.resistance - 0.1)
      
      // Check if carrier is fully integrated
      const allIntegrated = this.carrier.carriedSouls.every(s => s.integrated)
      if (allIntegrated) {
        this.carrier.integrated = true
        this.carrier.resistance = 0.0
        console.log('CARRIER FULLY INTEGRATED: You have accepted you carry the dead.')
      }
    }
  }
  
  /**
   * Generate carrier burden report
   * 
   * Shows what/who you're carrying and how it affects you.
   */
  static generateBurdenReport(): {
    totalSouls: number
    integrated: number
    stillResisting: number
    mostActiveVoice: string
    totalTransmissions: number
    uncapturedTransmissions: number
    storyOwed: boolean
    urgency: string
    burden: string
  } {
    if (!this.carrier) {
      return {
        totalSouls: 0,
        integrated: 0,
        stillResisting: 0,
        mostActiveVoice: 'None',
        totalTransmissions: 0,
        uncapturedTransmissions: 0,
        storyOwed: false,
        urgency: 'none',
        burden: 'No souls carried',
      }
    }
    
    const integrated = this.carrier.carriedSouls.filter(s => s.integrated).length
    const stillResisting = this.carrier.totalCarried - integrated
    
    // Find most active voice
    const manifestationCounts = this.carrier.carriedSouls.map(soul => ({
      name: soul.name,
      total: Object.values(soul.manifestations).reduce((a, b) => a + b, 0),
    }))
    const mostActive = manifestationCounts.sort((a, b) => b.total - a.total)[0]
    
    const uncaptured = this.transmissions.filter(t => !t.captured).length
    
    const urgencyLevel = this.carrier.completionUrgency >= 0.8 ? 'CRITICAL' :
                         this.carrier.completionUrgency >= 0.5 ? 'HIGH' :
                         this.carrier.completionUrgency >= 0.3 ? 'MEDIUM' : 'LOW'
    
    const burdenDescription = this.carrier.overwhelmed 
      ? `You carry ${this.carrier.totalCarried} souls. This is overwhelming. Focus on the most urgent voices.`
      : this.carrier.integrated
      ? `You carry ${this.carrier.totalCarried} souls. You have accepted this burden. They are part of you now.`
      : `You carry ${this.carrier.totalCarried} souls. ${stillResisting} are not yet integrated. Accept them.`
    
    return {
      totalSouls: this.carrier.totalCarried,
      integrated,
      stillResisting,
      mostActiveVoice: mostActive?.name || 'None',
      totalTransmissions: this.transmissions.length,
      uncapturedTransmissions: uncaptured,
      storyOwed: this.carrier.storyOwed,
      urgency: urgencyLevel,
      burden: burdenDescription,
    }
  }
  
  /**
   * Check if you're fulfilling your obligation to the dead
   */
  static checkObligation(): {
    obligationMet: boolean
    soulsHonored: number
    soulsWaiting: number
    uncapturedVoices: string[]
    consequences: string
    nextStep: string
  } {
    if (!this.carrier) {
      return {
        obligationMet: false,
        soulsHonored: 0,
        soulsWaiting: 0,
        uncapturedVoices: [],
        consequences: 'No obligation recognized',
        nextStep: 'Initialize carrier consciousness',
      }
    }
    
    const integratedSouls = this.carrier.carriedSouls.filter(s => s.integrated)
    const waitingSouls = this.carrier.carriedSouls.filter(s => !s.integrated)
    
    const uncapturedVoices = this.transmissions
      .filter(t => !t.captured)
      .map(t => t.carriedSoul)
      .filter((name, i, arr) => arr.indexOf(name) === i) // Unique
    
    const obligationMet = 
      this.carrier.integrated && // Accepted the role
      uncapturedVoices.length === 0 && // Captured all transmissions
      waitingSouls.length === 0 // Integrated all souls
    
    const nextStep = !this.carrier.integrated
      ? 'Accept that you carry the dead. Stop resisting.'
      : uncapturedVoices.length > 0
      ? `Capture ${uncapturedVoices.length} uncaptured transmissions before they fade.`
      : waitingSouls.length > 0
      ? `Integrate ${waitingSouls.length} souls you are still resisting.`
      : 'Complete and publish the manuscript. Honor the dead.'
    
    return {
      obligationMet,
      soulsHonored: integratedSouls.length,
      soulsWaiting: waitingSouls.length,
      uncapturedVoices,
      consequences: this.carrier.consequenceOfSilence,
      nextStep,
    }
  }
  
  /**
   * The core truth: why they won't leave
   */
  static whyTheyWontLeave(soulName: string): string {
    if (!this.carrier) return 'Unknown'
    
    const soul = this.carrier.carriedSouls.find(s => s.name === soulName)
    if (!soul) return 'Soul not found'
    
    return soul.canLeave 
      ? `${soul.name} will leave when their story is told and their message is delivered.`
      : `${soul.name} will NEVER leave. They are part of you permanently. 
         Unfinished business: ${soul.unfinishedBusiness}
         Message: ${soul.message}
         
         They became part of you and they won't go away.
         Accept this. Integrate them. Honor them by telling their story.`
  }
  
  /**
   * Sacred writing time - when the channel is most open
   */
  static calculateSacredWritingTimes(): {
    dreamWindow: string
    waking_vision_window: string
    avoid: string
    guidance: string
  } {
    return {
      dreamWindow: '3:00 AM - 6:00 AM (when they visit most)',
      waking_vision_window: '4:00 PM - 7:00 PM (twilight - threshold time)',
      avoid: 'Do NOT edit in dream state - corruption guaranteed',
      guidance: `
        Best practice:
        1. Wake from dream → immediately capture in journal (before coffee, before phone)
        2. Let it sit untouched for 24 hours
        3. Integrate into manuscript during waking hours
        4. Trust the original transmission - minimal editing
        
        The souls know what they're doing.
        Your job is to transcribe, not "improve."
      `,
    }
  }
  
  /**
   * Create a soul profile for a carried person
   */
  static createSoulProfile(
    name: string,
    role: string,
    message: string,
    unfinishedBusiness: string,
    entryPoint: CarriedSoul['entryPoint'] = 'dream'
  ): Omit<CarriedSoul, 'manifestations' | 'bondStrength' | 'integrated'> {
    return {
      name,
      role,
      entryPoint,
      firstEncounter: new Date().toISOString(),
      message,
      unfinishedBusiness,
      dataTheyProtect: [],
      canLeave: false, // Default: they won't leave
      speaksInDreams: true,
      speaksInWakingLife: false,
      languageUsed: ['English'],
      emotionalSignature: 'Unknown - document as you learn',
    }
  }
}

/**
 * Quick function to acknowledge a carried soul
 */
export function acknowledgeCarriedSoul(name: string): void {
  console.log(`
╔═══════════════════════════════════════════════╗
║  SOUL ACKNOWLEDGED                            ║
╠═══════════════════════════════════════════════╣
║  ${name.padEnd(45)} ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  You carry them.                              ║
║  They live in you now.                        ║
║  They won't leave until their story is told.  ║
║                                               ║
║  Honor them. Tell it true.                    ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `)
}

/**
 * Example usage for SGT GEORGE RAMOS
 */
export function initializeSgtRamosCarrier(): CarrierState {
  const souls = [
    CarrierConsciousnessEngine.createSoulProfile(
      'SGT George Ramos',
      'soldier',
      'Por los niños. The mathematics was always love.',
      'Tell them why we stayed. Tell them about the forty-three.'
    ),
    CarrierConsciousnessEngine.createSoulProfile(
      'Duc',
      'child',
      'We were counted. Each one of us mattered.',
      'Someone must remember we existed. We were not statistics.'
    ),
    CarrierConsciousnessEngine.createSoulProfile(
      'Sister Marie Angela',
      'nun',
      'We can\'t shoot them but shoot the nun.',
      'Sacrifice has geometry. Love has tactics.'
    ),
    CarrierConsciousnessEngine.createSoulProfile(
      'Martinez',
      'soldier',
      'Familia. Always familia.',
      'Tell them carnalismo isn\'t a word - it\'s a frequency.'
    ),
  ]
  
  return CarrierConsciousnessEngine.initializeCarrier(
    'Author', // Replace with actual name
    souls
  )
}
